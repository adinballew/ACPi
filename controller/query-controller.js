const io = require("../io");
const SensorData = require("../model/sensordata");

let queryControllerThread = false;

setInterval(() => {
    SensorData.findAll({order: [["Date", "DESC"]], limit: 20})
        .then(result => {
            io.sockets.emit("dbData", {recentData: result});
        })
        .catch(err => console.log(err));
}, 1000);

module.exports = function (state) {
    queryControllerThread = state;
};