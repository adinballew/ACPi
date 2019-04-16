const io = require("../io");
const ac = require("../model/ac");

/* Event Listener for name */
function relayEventListener(name, socket) {
    socket.on(name, function (data) {
        ac(name, data);
    });
}

/* Open socket on Connection */
function openConnection() {
    io.on("connection", function (socket) {
        relayEventListener("cool", socket);
        relayEventListener("heat", socket);
        relayEventListener("off", socket);
        relayEventListener("auto", socket);
        console.log("Client Connected"); //show a log as a new client connects.
    });
}

module.exports.openConnection = () => openConnection();