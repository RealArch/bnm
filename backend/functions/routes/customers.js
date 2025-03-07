const { auth } = require('firebase-admin');
const router = require('express').Router();
const { onDocumentUpdated, onDocumentCreated, onDocumentDeleted, onDocumentWritten } = require('firebase-functions/v2/firestore');
//Algolia config
const { defineSecret } = require('firebase-functions/params');
const { algoliasearch } = require('algoliasearch');
const ALGOLIA_APP_ID = defineSecret("ALGOLIA_APP_ID")
const ALGOLIA_ADMIN_KEY = defineSecret("ALGOLIA_ADMIN_KEY");


router.get('/', (req, res) => {
    return res.send("Hola customers")

})

const update = exports.customerUpdated = onDocumentUpdated({ document: 'customers/{customerId}', secrets: [ALGOLIA_ADMIN_KEY, ALGOLIA_APP_ID] },
    async (event) => {
        const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'customers_prod' : 'customers_dev';
        const client = algoliasearch(ALGOLIA_APP_ID.value(), ALGOLIA_ADMIN_KEY.value());

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
const created = exports.customer = onDocumentCreated({ document: 'customers/{customerId}', secrets: [ALGOLIA_ADMIN_KEY, ALGOLIA_APP_ID] },
    async (event) => {

        const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'customers_prod' : 'customers_dev';

        // const client = await getAlgoliaClient();

        const client = algoliasearch(ALGOLIA_APP_ID.value(), ALGOLIA_ADMIN_KEY.value());

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
    async (event) => {
        const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'customers_prod' : 'customers_dev';
        client = algoliasearch(ALGOLIA_APP_ID.value(), ALGOLIA_ADMIN_KEY.value());

        client.deleteObject({
            indexName: ALGOLIA_INDEX_NAME, objectID: event.data.id
        });

        return
    }
)

// COLLECTION customers secrets:[algoliaAppId, algoliaAdminKey],



module.exports = [router, update, deleted, created]
