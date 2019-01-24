const sensor = require('node-dht-sensor');
const io = require('../io');

const readings = {
    temperature: 0,
    humidity: 0
};

const sensorMode = 11; // DTH11
const pin = 18; // GPIO24 Pin 18

const getSensorReadings = (callback) => {
    sensor.read(sensorMode, pin, function (err, temperature, humidity) {
        if (err) {
            return callback(err)
        }
        callback(null, temperature, humidity)
    })
};

/* Polls sensor data every second */
setInterval(() => {
    getSensorReadings((err, temperature, humidity) => {
        if (err) {
            return console.error(err)
        }
        /* Set the values of the cache on receiving new readings */
        readings.temperature = (temperature * 1.8 + 32).toFixed(1); // Convert to Fahrenheit
        readings.humidity = humidity
    });
    let today = new Date();
    // Emits sensor data to controller
    io.sockets.emit('temp', {
        temperature: readings.temperature,
        humidity: readings.humidity,
        date: today.getFullYear() + "-" + (today.getUTCMonth() + 1) + "-" + today.getDate(),
        time: (today.getHours()) + ":" + (today.getMinutes())
    });
}, 1000);


module.exports.getTemperature = () => readings.temperature;
module.exports.getHumidity = () => readings.humidity;