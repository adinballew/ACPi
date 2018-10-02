const relayToAC = require('./relay-to-ac');
const getSensorReadings = require('../model/get-sensor-readings');

/* Properties of AC Unit */
const ac_unit = {
    setting: 'off',
    desiredTemp: 70,
    running: false
};

function cooling() {
    if (!ac_unit.running) {
        if (ac_unit.desiredTemp < getSensorReadings.getTemperature()) {
            ac_unit.running = true;
            relayToAC.run(ac_unit.setting);
            console.log('Cooling');
        }
    }
    if (ac_unit.desiredTemp > getSensorReadings.getTemperature()) {
        relayToAC.destroy();
        ac_unit.running = false;
    }
    console.log(ac_unit.desiredTemp);
    console.log(getSensorReadings.getTemperature());
}

function heating() {
    if (!ac_unit.running) {
        if (ac_unit.desiredTemp > getSensorReadings.getTemperature()) {
            ac_unit.running = true;
            relayToAC.run(ac_unit.setting);
            console.log('Heating');
        }
    }
    if (ac_unit.desiredTemp < getSensorReadings.getTemperature()) {
        relayToAC.destroy();
        ac_unit.running = false;
    }
    console.log(ac_unit.desiredTemp);
    console.log(getSensorReadings.getTemperature());
}

setInterval(() => {
    /* Cooling */
    if (ac_unit.setting === 'cool') {
        cooling();
    }
    /* Heating */
    if (ac_unit.setting === 'heat') {
        heating();
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
            relayToAC.destroy();
            break;
    }
};