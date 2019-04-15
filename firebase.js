const admin = require('firebase-admin');

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://acpi-a1703.firebaseio.com/'
});
const db = admin.firestore();

module.exports = db;