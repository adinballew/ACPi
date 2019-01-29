const io = require('../io');
const db = require('../db');

const SensorTag = require('sensortag');					// sensortag library
const tags = [];
const cc2650 = '546c0e533366';

const readings = {
    sensor: 'Humidity Sensor',
    temperature: 0,
    humidity: 0
};

function handleTag(tag) {
    console.log('New Tag Connected');
    const tagRecord = {};		// make an object to hold sensor values
    tags.push(tagRecord);	// add it to the tags array

    function disconnect() {
        console.log('Tag Disconnected!');
    }

    function enableSensors() {
        console.log('Enabling Sensors');
        tag.enableHumidity(); // enable sensor
        tag.setHumidityPeriod(1000); // set its period
        tag.notifyHumidity(); //turn on notifications
    }

    function readHumidity(temperature, humidity) {
        // read the three values and save them in the
        // sensor value object:
        readings.temperature = (temperature * 1.8 + 32).toFixed(1);
        readings.humidity = humidity.toFixed(1);
        console.log(readings); // print it
    }

    tag.connectAndSetUp(enableSensors); // connect to the tag and set it up
    tag.on('humidityChange', readHumidity); // set a listener for when the sensor changes
    tag.on('disconnect', disconnect); // set a listener for the tag disconnects
}

// discovers tag by id
SensorTag.discoverById(cc2650, handleTag);

/* Prepared Statement Insert */
function insertSensorData(temperature, humidity) {
    let connection = db.connect('sensordata.db');
    connection.run('INSERT INTO sensordata (temperature, humidity) VALUES (?, ?)',
        ([temperature, humidity]));
    connection.close();
}

/* Polls sensor data every second */
setInterval(() => {
    let today = new Date();
    // Emits sensor data to controller
    io.sockets.emit('temp', {
        temperature: readings.temperature,
        humidity: readings.humidity,
        date: today.getFullYear() + "-" + (today.getUTCMonth() + 1) + "-" + today.getDate(),
        time: (today.getHours()) + ":" + (today.getMinutes())
    });
    // insertSensorData(readings.temperature, readings.humidity)
}, 1000);


module.exports.getTemperature = () => readings.temperature;
module.exports.getHumidity = () => readings.humidity;