const relayToAC = require("./relay-to-ac");
const getSensorReadings = require("../controller/get-sensor-readings");
const io = require("../io");
const fs = require("fs");

/* Properties of AC Unit */
let data = fs.readFileSync("./saveState.json");
const ac_unit = JSON.parse(data.toString());

/* Desired Temp Below Current Temp */
function desiredBelow() {
    return ac_unit.desiredTemp <= getSensorReadings.getTemperature();
}

/* Desired Temp Above Current Temp */
function desiredAbove() {
    return ac_unit.desiredTemp >= getSensorReadings.getTemperature();
}

function fanState() {
    ac_unit.cycleState = "fan";
    relayToAC.fan();
}

function runningState() {
    ac_unit.cycleState = "running";
    relayToAC.run(ac_unit.setting);
}

function restingState() {
    ac_unit.cycleState = "resting";
    relayToAC.destroy();
}

/**
 * fan only cycle:          7min-6min           relayToAC.fan();
 * cooling/heating cycle:   6min-2min           relayToAC.run(ac_unit.setting);
 * fan only cycle:          2min-1min 30sec     relayToAC.fan();
 * rest cycle:              1min 30sec          relayToAC.destroy();
 */
function cycleStateManager(minutes, seconds) {
    console.log("Minutes: " + minutes + " Seconds: " + seconds);
    if ((minutes <= 7 && minutes >= 6) && ac_unit.cycleState !== "fan") {
        fanState();
    } else if ((minutes < 6 && minutes >= 2) && ac_unit.cycleState !== "running") {
        runningState();
    } else if (minutes < 2 && (minutes >= 1 && seconds >= 30) && ac_unit.cycleState !== "fan") {
        fanState();
    } else if ((minutes <= 1 && seconds < 30) && ac_unit.cycleState !== "resting") {
        restingState();
    }
}

/* Countdown until AC can run again */
function startExpirationCountdown() {
    let countDownDate = new Date();
    countDownDate.setMinutes(countDownDate.getMinutes() + 5);
    // Update the count down every 1 second
    const x = setInterval(function () {
        // Get today's date and time
        const now = new Date().getTime();
        // Find the distance between now and the count down date
        const distance = countDownDate - now;
        // Time calculations for minutes and seconds
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // Output the result in an element with id="demo"
        ac_unit.countdown = minutes + "m " + seconds + "s ";

        // If the count down is over, write some text
        if (distance <= 0) {
            clearInterval(x);
            ac_unit.countdown = "EXPIRED";
        }
    }, 1000);
}

function startACCycleTimer() {
    let countDownDate = new Date();
    countDownDate.setMinutes(countDownDate.getMinutes() + 7);

    // Update the count down every 1 second
    if (ac_unit.running && ac_unit.cycleState === "off") {
        const cycleTimer = setInterval(function () {
            // Get today's date and time
            const now = new Date().getTime();
            // Find the distance between now and the count down date
            const distance = countDownDate - now;
            // Time calculations for minutes and seconds
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            cycleStateManager(minutes, seconds);
            if (ac_unit.running && distance <= 0) {
                countDownDate.setMinutes(countDownDate.getMinutes() + 7);
            } else if (!ac_unit.running) {
                ac_unit.cycleState = "off";
                clearInterval(cycleTimer)
            }
        }, 1000);
    }
}

/* Start AC Event */
function startAC() {
    ac_unit.running = true;
    startACCycleTimer();
}

/* Stop AC Event */
function stopAC() {
    ac_unit.running = false;
    relayToAC.destroy();
    startExpirationCountdown();
}

function cooling() {
    if (!ac_unit.running) {
        if (desiredBelow() && ac_unit.countdown === "EXPIRED") {
            startAC();
            console.log("Cooling");
        }
    }
    if (!desiredBelow()) {
        if (ac_unit.running) {
            stopAC();
        }
        // Temp In Range
    }
}

function heating() {
    if (!ac_unit.running) {
        if (desiredAbove() && ac_unit.countdown === "EXPIRED") {
            startAC();
            console.log("Heating");
        }
    }
    if (!desiredAbove()) {
        if (ac_unit.running) {
            stopAC();
        }
        // Temp In Range
    }
}

/* Listens for signals to update the relay */
setInterval(() => {
    if (ac_unit.setting === "cool") {
        cooling();
    }
    if (ac_unit.setting === "heat") {
        heating();
    }
    // Emits Current State to UI
    io.sockets.emit("ac_state", ac_unit);

    // Writes Current State to file
    let data = JSON.stringify(ac_unit, null, 2);
    fs.writeFile("./saveState.json", data, (err) => {
        if (err) throw err;
    });
}, 1000);

/*
Fan = R-G
Cool = R-G, R-Y
Heat = R-G, R-W
 */
module.exports = function (name, data) {
    switch (name) {
        case "heat":
            console.log(name + ": on");
            ac_unit.setting = name;
            ac_unit.desiredTemp = data;
            break;
        case "cool":
            console.log(name + ": on");
            ac_unit.setting = name;
            ac_unit.desiredTemp = data;
            break;
        case "off":
            console.log(name + ": on");
            ac_unit.setting = name;
            ac_unit.desiredTemp = data;
            ac_unit.countdown = "EXPIRED";
            relayToAC.destroy();
            break;
        case "auto":
            console.log(name + ": " + data);
            break;
    }
};