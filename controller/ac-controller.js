const relayToAC = require("../model/relay-to-ac");
const getSensorReadings = require("../model/sensor");
const db = require("../firebase");
const io = require("../io");
const fs = require("fs");

/* Properties of AC Unit */
let data = fs.readFileSync("./saveState.json");
const ac_unit = JSON.parse(data.toString());

/** Checks if desired temp is below current temp
 * @return {boolean} **/
function desiredBelow() {
    return ac_unit.desiredTemp <= getSensorReadings.getTemperature();
}

/** Checks if desired temp is above current temp
 * @return {boolean} **/
function desiredAbove() {
    return ac_unit.desiredTemp >= getSensorReadings.getTemperature();
}

/** Changes ac to fan state **/
function fanState() {
    ac_unit.cycleState = "fan";
    relayToAC.fan();
}

/** Changes ac to running state **/
function runningState() {
    ac_unit.cycleState = "running";
    relayToAC.run(ac_unit.setting);
}

/** Changes ac to resting state **/
function restingState() {
    ac_unit.cycleState = "resting";
    relayToAC.destroy();
}

/**
 * fan only cycle:          7min-6min           relayToAC.fan();
 * cooling/heating cycle:   6min-2min           relayToAC.run(ac_unit.setting);
 * fan only cycle:          2min-1min 30sec     relayToAC.fan();
 * rest cycle:              1min 30sec          relayToAC.destroy();
 *
 * Changes to cycleState at intervals to match ac behavior.
 * @param minutes
 * @param seconds
 */
function cycleStateManager(minutes, seconds) {
    // console.log("Minutes: " + minutes + " Seconds: " + seconds);
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

/**Starts a countdown after the ac has run to
 * prevent the ac from turning on again
 * after it has recently run**/
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

/** A timer to be used by the cycleStateManager
 * to track the cycleState that should be active **/
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

/** Starts the ac **/
function startAC() {
    ac_unit.running = true;
    startACCycleTimer();
}

/** Stops the ac **/
function stopAC() {
    ac_unit.running = false;
    relayToAC.destroy();
    startExpirationCountdown();
}

/** Starts and Stops the cooling event **/
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

/** Starts and Stops the heating event **/
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

/** Manages the state of the ac unit **/
function startStateManager() {
    getSensorReadings.initSensor();

    setInterval(() => {
        switch (ac_unit.setting) {
            case "cool":
                cooling();
                break;
            case "heat":
                heating();
                break;
            case "off":
                relayToAC.destroy();
        }
        io.sockets.emit("ac_state", ac_unit);
    }, 1000);

    setInterval(() => {
        const readings = getSensorReadings.getReadings();
        io.sockets.emit("temp", readings);
        db.addSensorData(readings);

        // Writes Current State to file
        let data = JSON.stringify(ac_unit, null, 2);
        fs.writeFile("./saveState.json", data, (err) => {
            if (err) throw err;
        });
    }, 1000 * 5);
}

module.exports.startStateManager = () => startStateManager();

module.exports.changeState = (name, data) => {
    ac_unit[name] = data;
};