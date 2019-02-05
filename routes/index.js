const express = require("express");
const router = express.Router();
const io = require("../io");
const ac = require("../model/ac");
const SensorData = require("../model/sensordata");

/* Event Listener for name */
function relayEventListener(name, socket) {
    socket.on(name, function (data) {
        ac(name, data);
    });
}

let sensordata;

function getSensorData() {
    SensorData.findAll({limit: 20})
        .then(result => {
            sensordata = result;
        })
        .catch(err => console.log(err));
}

sensordata = getSensorData();

/* GET index */
router.get("/", function (req, res, next) {
    res.render("index", {});
});

router.get("/logs", function (req, res, next) {
    res.render("logs", {sensordata});
});

/* Open socket on Connection */
io.on("connection", function (socket) {
    relayEventListener("cool", socket);
    relayEventListener("heat", socket);
    relayEventListener("off", socket);
    console.log("Client Connected"); //show a log as a new client connects.
});

module.exports = router;