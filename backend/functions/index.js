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
const { onDocumentUpdated, onDocumentCreated, onDocumentDeleted, onDocumentWritten } = require('firebase-functions/v2/firestore');
const logger = require("firebase-functions/logger");
var express = require('express');
var app = express();
const { onInit } = require('firebase-functions/v2/core');

const { defineSecret } = require('firebase-functions/params');
const algoliasearch = require('algoliasearch');

//Algolia config
const algoliaAppId = defineSecret('ALGOLIA_APP_ID');
const algoliaAdminKey = defineSecret('ALGOLIA_ADMIN_KEY');
const ALGOLIA_ADMIN_KEY = defineSecret("ALGOLIA_ADMIN_KEY");
const ALGOLIA_APP_ID = defineSecret("ALGOLIA_APP_ID")

//This is for the env variables
var serviceAccount = require('./adminKeyFirebase.json');
const customersTrigger = require('./routes/customers')

// let client;
// onInit(() => {

//     console.log(ALGOLIA_ADMIN_KEY.value())
//     console.log(ALGOLIA_APP_ID.value())

//     const algoliaAppIdValue = ALGOLIA_APP_ID.value()
//     const algoliaAdminKeyValue = ALGOLIA_ADMIN_KEY.value();
//     client = algoliasearch.searchClient(algoliaAppIdValue, algoliaAdminKeyValue);
//     return
// });
initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "bnm-01-abd4b.appspot.com"
})

//RUTAS
const authRoute = require("./routes/auth")
app.use('/auth', authRoute)
//SHIFTS
const shiftRoute = require("./routes/shifts");
app.use('/shifts', shiftRoute)
//CUSTOMERS
const customersRoute = require("./routes/customers")
app.use('/customers', customersRoute)
// Middleware para acceder a los parámetros 
app.use((req, res, next) => {
    req.secret = ALGOLIA_ADMIN_KEY.value();
    req.secret = ALGOLIA_APP_ID.value();
    next();
});


exports.api = onRequest({ secrets: [ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY] }, app);
exports.customersTrigger = customersTrigger;
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





//todo: automatic function to close a shift when it reaches 12:00 And fill only 8 hours.