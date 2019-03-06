const rpio = require("rpio"); // https://github.com/jperkin/node-rpio

/* Assign Pins to Relays */
const pins = {
    heat: 11,
    cool: 13,
    fan: 15
};

/* Open all assigned Pins */
for (let pin in pins) {
    rpio.open(pins[pin], rpio.OUTPUT, rpio.HIGH);
}

/* Functions for communicating with the serial pins */
module.exports = {
    destroy: function () {
        for (let pin in pins) {
            rpio.write(pins[pin], rpio.HIGH);
        }
    },
    run: function (name) {
        for (let pin in pins) {
            rpio.write(pins[pin], rpio.HIGH);
        }
        console.log("Starting: " + name);
        rpio.write(pins["fan"], rpio.LOW);
        rpio.write(pins[name], rpio.LOW);
    },
    fan: function () {
        for (let pin in pins) {
            rpio.write(pins[pin], rpio.HIGH);
        }
        console.log("Starting: fan" );
        rpio.write(pins["fan"], rpio.LOW);
    }
};