/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const { admin } = require("firebase-admin")
const { initializeApp, cert } = require('firebase-admin/app');
const logger = require("firebase-functions/logger");
var express = require('express');
var app = express();

var serviceAccount = require('./adminKeyFirebase.json');

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "bnm-01-abd4b.appspot.com"
})

//RUTAS
const authRoute = require("./routes/auth")
app.use('/auth', authRoute)
//


exports.api = onRequest(app);

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
