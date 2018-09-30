const rpio = require('rpio');
const getSensorReadings = require('../model/get-sensor-readings');

/* Assign Pins to Relays */
const pins = {
    heat: 11,
    cool: 13,
    fan: 15
};

/* Properties of AC Unit */
const ac_unit = {
    setting: 'off',
    desiredTemp: 70,
    running: false
};

/* Open all assigned Pins */
for (let pin in pins) {
    rpio.open(pins[pin], rpio.OUTPUT, rpio.HIGH);
}

function destroy() {
    for (let pin in pins) {
        rpio.write(pins[pin], rpio.HIGH);
    }
}

function heat(name) {
    destroy();
    rpio.write(pins['fan'], rpio.LOW);
    rpio.write(pins[name], rpio.LOW);
}

function cool(name) {
    destroy();
    rpio.write(pins['fan'], rpio.LOW);
    rpio.write(pins[name], rpio.LOW);
}

setInterval(() => {
    /* Cooling */
    if (ac_unit.setting === 'cool') {
        if (!ac_unit.running) {
            if (ac_unit.desiredTemp < getSensorReadings.getTemperature()) {
                ac_unit.running = true;
                cool(ac_unit.setting);
                console.log('Cooling');
            }
        }
        if (ac_unit.desiredTemp > getSensorReadings.getTemperature()) {
            destroy();
            ac_unit.running = false;
        }
        console.log(ac_unit.desiredTemp);
        console.log(getSensorReadings.getTemperature());
    }
    /* Heating */
    if (ac_unit.setting === 'heat') {
        if (!ac_unit.running) {
            if (ac_unit.desiredTemp > getSensorReadings.getTemperature()) {
                ac_unit.running = true;
                heat(ac_unit.setting);
                console.log('Heating');
            }
        }
        if (ac_unit.desiredTemp < getSensorReadings.getTemperature()) {
            destroy();
            ac_unit.running = false;
        }
        console.log(ac_unit.desiredTemp);
        console.log(getSensorReadings.getTemperature());
    }
}, 2000);

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
            destroy();
            break;
    }
};