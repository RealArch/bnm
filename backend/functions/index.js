/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const { admin, auth } = require("firebase-admin")
const { initializeApp, cert } = require('firebase-admin/app');
const { onDocumentUpdated, onDocumentCreated } = require('firebase-functions/v2/firestore');
const logger = require("firebase-functions/logger");
var express = require('express');
var app = express();
const { onInit } = require('firebase-functions/v2/core');

const { defineSecret } = require('firebase-functions/params');

const algoliaAppId = defineSecret('ALGOLIA_APP_ID');
const algoliaAdminKey = defineSecret('ALGOLIA_ADMIN_KEY');

//This is for the env variables
var serviceAccount = require('./adminKeyFirebase.json');

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "bnm-01-abd4b.appspot.com"
})

//RUTAS
const authRoute = require("./routes/auth")
app.use('/auth', authRoute)
//SHIFTS
const shiftRoute = require("./routes/shifts");
const { event } = require("firebase-functions/v1/analytics");
app.use('/shifts', shiftRoute)
// Middleware para acceder a los parámetros 
// app.use((req, res, next) => {
//     req.algoliaAppId = algoliaAppId.value();
//     req.algoliaAdminKey = algoliaAdminKey.value();
//     next()
// })
exports.api = onRequest({ secrets: [algoliaAppId, algoliaAdminKey] }, app);

//AUTOMATIC FUNCTIONS


exports.user = onDocumentUpdated('users/{usersID}',
    (event) => {
        // console.log(event.data.before);
        console.log(event.data.after.id)
        if (event.data.before.data().active == false && event.data.after.data().active == true) {
            auth().setCustomUserClaims(event.data.after.id, {
                active: true
            })
        } else if (event.data.before.data().active == true && event.data.after.data().active == false) {
            auth().setCustomUserClaims(event.data.after.id, {
                active: false
            })
        }
        return
    })
// exports.user = onDocumentUpdated('users/{usersID}',
//     (event) => {
//         // console.log(event.data.before);
//         // console.log(event.data.after);
//         //Adding the finished shift time to the data base
//         //if end
//         // if(event.data.before.data

//         console.log(1)
//         if (!event.data.before.data().currentShift.shiftFinished && event.data.after.data().currentShift.shiftFinished) {
//             console.log("finalice un turno, añadiendo al registro y re iniando data de usuario")
//         } else {
//             console.log(2)

//         }
//         return
//     }
// )
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

//todo: automatic function to close a shift when it reaches 12:00 And fill only 8 hours.