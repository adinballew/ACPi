/** TODO: Consider writing firmware of sensor tag to support always on
 * http://www.ti.com/tool/BLE-Stack
 * ttp://e2e.ti.com/support/wireless-connectivity/bluetooth/f/538/t/423701?Sensor-Tag-2-Prevent-Sleep-Always-On-Firmware **/
const SensorTag = require("sensortag"); // https://github.com/sandeepmistry/node-sensortag
const tags = [];
const cc2650 = "546c0e533366";
const pollTime = 5;
const tempConfig = 8;

const readings = {
    temperature: 0,
    humidity: 0,
    pressure: 0,
    lux: 0,
    date: "",
    time: "",
    datetime: new Date()
};

function appendLeadingZero(date) {
    return ("0" + (date)).slice(-2)
}

function to12HourClock(hour) {
    return (hour >= 13) ? hour - 12 : hour;
}

function formatDate(today) {
    return today.getFullYear() + "-"
        + appendLeadingZero(today.getUTCMonth() + 1) + "-"
        + appendLeadingZero(today.getDate());
}

function formatTime(today) {
    return (appendLeadingZero(to12HourClock(today.getHours()))) + ":"
        + (appendLeadingZero(today.getMinutes())) + ":"
        + appendLeadingZero(today.getSeconds())
}

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

        tag.setHumidityPeriod(1000 * pollTime); // set its period
        tag.setBarometricPressurePeriod(1000 * pollTime);
        tag.setLuxometerPeriod(1000 * pollTime);

        tag.notifyHumidity(); //turn on notifications
        tag.notifyBarometricPressure();
        tag.notifyLuxometer();
    }

    function readHumidity(temperature, humidity) {
        let today = new Date();
        readings.temperature = ((temperature - tempConfig) * 9 / 5 + 32).toFixed(1);
        readings.humidity = humidity.toFixed(1);
        readings.date = formatDate(today);
        readings.time = formatTime(today);
        readings.datetime = today;
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

module.exports.initSensor = () => SensorTag.discoverById(cc2650, handleTag);
module.exports.getReadings = () => readings;
module.exports.getTemperature = () => readings.temperature;
module.exports.getHumidity = () => readings.humidity;
module.exports.getPressure = () => readings.pressure;
module.exports.getLux = () => readings.lux;