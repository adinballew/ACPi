const db = require("../firebase");
const io = require("../io");
const moment = require("moment-timezone");

const pollTime = 5;

let results = [{
    DateTime: undefined,
    Temperature: 0,
    Humidity: 0,
    Pressure: 0,
    Lux: 0
}];

const sensorDataRef = db.collection("sensordata");
let query = sensorDataRef.orderBy("DateTime", "desc").limit(1);

function formatData(date) {
    date = moment(date);
    date = date.tz("America/Monterrey").format();
    return date;
}

function getSensorData() {
    query.get()
        .then(snapshot => {
            if (!snapshot.empty) {
                snapshot.forEach(doc => {
                    results[0].DateTime = formatData(doc.data().DateTime.toDate());
                    results[0].Temperature = doc.data().Temperature;
                    results[0].Humidity = doc.data().Humidity;
                    results[0].Pressure = doc.data().Pressure;
                    results[0].Lux = doc.data().Lux;
                });
            } else
                console.log("No Data")
        });
}

module.exports.startQueryStream = () => setInterval(() => {
    getSensorData();
    io.sockets.emit("dbData", {recentData: results});
}, 1000 * pollTime);

