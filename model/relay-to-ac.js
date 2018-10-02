const rpio = require('rpio');

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
        rpio.write(pins['fan'], rpio.LOW);
        rpio.write(pins[name], rpio.LOW);
    }
};