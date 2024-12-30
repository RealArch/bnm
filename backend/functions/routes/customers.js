const { auth } = require('firebase-admin');
const router = require('express').Router();
const { onDocumentUpdated, onDocumentCreated, onDocumentDeleted, onDocumentWritten } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
//Algolia config
const algoliasearch = require('algoliasearch');
const { onInit } = require('firebase-functions/v2/core');
const ALGOLIA_APP_ID = defineSecret("ALGOLIA_APP_ID")
const ALGOLIA_ADMIN_KEY = defineSecret("ALGOLIA_ADMIN_KEY");



// const client = algoliasearch(algoliaAppId.value(), algoliaAdminKey.value());
var client;
onInit(() => {

    console.log(ALGOLIA_ADMIN_KEY.value())
    console.log(ALGOLIA_APP_ID.value())

    const algoliaAppIdValue = ALGOLIA_APP_ID.value()
    const algoliaAdminKeyValue = ALGOLIA_ADMIN_KEY.value();
    client = algoliasearch.searchClient(algoliaAppIdValue, algoliaAdminKeyValue);
    return
});

router.get('/', (req, res) => {
    return res.send("Hola customers")

})

const update = exports.customerUpdated = onDocumentUpdated({ document: 'customers/{customerId}', secrets: [ALGOLIA_ADMIN_KEY, ALGOLIA_APP_ID] },
    async (event) => {
        const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'customers_prod' : 'customers_dev';
        console.log(event.data.after.id)
        client.saveObject({
            indexName: ALGOLIA_INDEX_NAME,
            body: {
                "objectID": event.data.after.id,
                "id": event.data.after.id,
                ...event.data.after.data(),
            },
        })
        return
    }
)
const created =exports.customer = onDocumentCreated({ document: 'customers/{customerId}', secrets: [ALGOLIA_ADMIN_KEY, ALGOLIA_APP_ID] },
    (event) => {
        const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'customers_prod' : 'customers_dev';
        client.saveObject({
            indexName: ALGOLIA_INDEX_NAME,
            body: {
                "objectID": event.data.id,
                "id": event.data.id,
                ...event.data.data(),
            },
        })
        return
    }
)
const deleted = exports.customer = onDocumentDeleted({ document: 'customers/{customerId}', secrets: [ALGOLIA_ADMIN_KEY, ALGOLIA_APP_ID] },
    (event) => {
        const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'customers_prod' : 'customers_dev';
        client.deleteObject({
            indexName: ALGOLIA_INDEX_NAME, objectID: event.data.id
        });

        return
    }
)

// COLLECTION customers secrets:[algoliaAppId, algoliaAdminKey],



module.exports = [router, update, deleted, created]
