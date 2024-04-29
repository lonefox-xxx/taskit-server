const serviceAccount = require('../serviceAccountKey.json');
const FireBaseAdmin = require("firebase-admin");

FireBaseAdmin.initializeApp({
    credential: FireBaseAdmin.credential.cert(serviceAccount),
    storageBucket: process.env.BUCKET_URL
});


module.exports = FireBaseAdmin;