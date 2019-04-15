const express = require("express");
const router = express.Router();
const io = require("../io");
const ac = require("../model/ac");
const googleCalendar = require("../googleCalendar");
const query = require("../controller/query-controller");

/* GET index */
router.get("/", function (req, res, next) {
    console.log(googleCalendar.todaysEvents);
    res.render("index", {});
});

router.get("/recent-data", function (req, res, next) {
    res.render("recent-data", {});
});

/* Event Listener for name */
function relayEventListener(name, socket) {
    socket.on(name, function (data) {
        ac(name, data);
    });
}

/* Open socket on Connection */
io.on("connection", function (socket) {
    relayEventListener("cool", socket);
    relayEventListener("heat", socket);
    relayEventListener("off", socket);
    relayEventListener("auto", socket);
    console.log("Client Connected"); //show a log as a new client connects.
});

module.exports = router;