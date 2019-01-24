const relayToAC = require('./relay-to-ac');
const getSensorReadings = require('../model/get-sensor-readings');
const io = require('../io');

/* Properties of AC Unit */
const ac_unit = {
    setting: 'off',             // Cool, Heat, Off
    desiredTemp: 70,            // Desired Temperature to be met
    running: false,             // Is the AC currently running?
    countdown: 'EXPIRED',       // Last time the AC Unit stopped
};

/* Desired Temp Below Current Temp */
function desiredBelow() {
    return ac_unit.desiredTemp <= getSensorReadings.getTemperature();
}

/* Desired Temp Above Current Temp */
function desiredAbove() {
    return ac_unit.desiredTemp >= getSensorReadings.getTemperature();
}

/* Countdown until OkToSwitch */
function startCountdown() {
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
        if (distance < 0) {
            clearInterval(x);
            ac_unit.countdown = "EXPIRED";
        }
    }, 1000);
}

/* Start AC Event */
function startAC() {
    relayToAC.run(ac_unit.setting);
    ac_unit.running = true;
}

/* Stop AC Event */
function stopAC() {
    relayToAC.destroy();
    ac_unit.running = false;
    startCountdown();
}

function cooling() {
    if (!ac_unit.running) {
        if (desiredBelow() && ac_unit.countdown === 'EXPIRED') {
            startAC();
            console.log('Cooling');
        }
    }
    if (!desiredBelow()) {
        if (ac_unit.running) {
            stopAC();
        }
        // Temp In Range
    }
    console.log(ac_unit.desiredTemp);
    console.log(getSensorReadings.getTemperature());
}

function heating() {
    if (!ac_unit.running) {
        if (desiredAbove() && ac_unit.countdown === 'EXPIRED') {
            startAC();
            console.log('Heating');
        }
    }
    if (!desiredAbove()) {
        if (ac_unit.running) {
            stopAC();
        }
        // Temp In Range
    }
    console.log("Desired Temperature: " + ac_unit.desiredTemp);
    console.log("Current Temperature: " + getSensorReadings.getTemperature());
}

/* Listens for signals to update the relay */
setInterval(() => {
    if (ac_unit.setting === 'cool') {
        cooling();
    }
    if (ac_unit.setting === 'heat') {
        heating();
    }
    io.sockets.emit('ac_state', ac_unit);   // Emits Current State to UI
}, 1000);

/*
Fan = R-G
Cool = R-G, R-Y
Heat = R-G, R-W
 */
module.exports = function (name, data) {
    console.log(name + ': on');
    ac_unit.desiredTemp = data;
    switch (name) {
        case 'heat':
            ac_unit.setting = name;
            break;
        case 'cool':
            ac_unit.setting = name;
            break;
        case 'off':
            ac_unit.setting = name;
            relayToAC.destroy();
            break;
    }
};