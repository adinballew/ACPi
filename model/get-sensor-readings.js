const io = require("../io");
const db = require("../db");

// TODO: Consider writing firmware of sensor tag to support always on
//  http://www.ti.com/tool/BLE-Stack
//  http://e2e.ti.com/support/wireless-connectivity/bluetooth/f/538/t/423701?Sensor-Tag-2-Prevent-Sleep-Always-On-Firmware
const SensorTag = require("sensortag"); // https://github.com/sandeepmistry/node-sensortag
const tags = [];
const cc2650 = "546c0e533366";

const readings = {
    temperature: 0,
    humidity: 0,
    pressure: 0,
    lux: 0
};

function handleTag(tag) {
    "use strict";
    console.log("New Tag Connected");
    const tagRecord = {};   // make an object to hold sensor values
    tags.push(tagRecord);   // add it to the tags array

    function disconnect() {
        console.log("Tag Disconnected!");
    }

    function enableSensors() {
        console.log("Enabling Sensors");
        tag.enableHumidity(); // enable sensors
        tag.enableBarometricPressure();
        tag.enableLuxometer();

        tag.setHumidityPeriod(1000); // set its period
        tag.setBarometricPressurePeriod(1000);
        tag.setLuxometerPeriod(1000);

        tag.notifyHumidity(); //turn on notifications
        tag.notifyBarometricPressure();
        tag.notifyLuxometer();
    }

    function readHumidity(temperature, humidity) {
        readings.temperature = (temperature * 1.8 + 32).toFixed(1);
        readings.humidity = humidity.toFixed(1);
    }

    function readBarometricPressure(pressure) {
        readings.pressure = pressure;
    }

    function readLuxometer(lux) {
        readings.lux = lux;
    }

    tag.connectAndSetUp(enableSensors); // connect to the tag and set it up
    tag.on("humidityChange", readHumidity); // set a listener for when the sensor changes
    tag.on("barometricPressureChange", readBarometricPressure);
    tag.on("luxometerChange", readLuxometer);
    tag.on("disconnect", disconnect); // set a listener for the tag disconnects
}

// discovers tag by id
SensorTag.discoverById(cc2650, handleTag);

/* Prepared Statement Insert */
function insertSensorData(today) {
    "use strict";
    let connection = db.connect("sensordata.db");
    connection.run("INSERT INTO sensordata (Date, Temperature, Humidity, Pressure, Lux) VALUES (?, ?, ?, ?, ?)",
        ([today.toISOString(), readings.temperature, readings.humidity, readings.pressure, readings.lux]));
    connection.close();
}

/* Polls sensor data every second */
setInterval(() => {
    let today = new Date();
    // Emits sensor data to controller
    io.sockets.emit("temp", {
        temperature: readings.temperature,
        humidity: readings.humidity,
        pressure: readings.pressure,
        lux: readings.lux,
        date: today.getFullYear() + "-" + ("0" + (today.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + today.getDate()).slice(-2),
        time: (today.getHours()) + ":" + (today.getMinutes())
    });
    insertSensorData(today)
}, 1000);


module.exports.getTemperature = () => readings.temperature;
module.exports.getHumidity = () => readings.humidity;
module.exports.getPressure = () => readings.pressure;
module.exports.getLux = () => readings.lux;