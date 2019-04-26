const admin = require('firebase-admin');

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://acpi-a1703.firebaseio.com/'
});
const db = admin.firestore();

function addSensorData(readings) {
    db.collection("sensordata").add({
        Temperature: readings.temperature,
        Humidity: readings.humidity,
        Pressure: readings.pressure,
        Lux: readings.lux,
        DateTime: readings.datetime
    })
        .catch(err => {
            console.log(err);
        });
}


module.exports = db;
module.exports.addSensorData = (readings) => addSensorData(readings);