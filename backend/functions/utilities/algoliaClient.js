const { algoliasearch } = require('algoliasearch');
const { defineSecret } = require('firebase-functions/params');

const ALGOLIA_APP_ID = defineSecret('ALGOLIA_APP_ID');
const ALGOLIA_ADMIN_KEY = defineSecret('ALGOLIA_ADMIN_KEY');

let client = null;
let currentAppId = null;
let currentAdminKey = null;

async function getAlgoliaClient() {
    const algoliaAppIdValue = await ALGOLIA_APP_ID.value();
    const algoliaAdminKeyValue = await ALGOLIA_ADMIN_KEY.value();

    if (!client || currentAppId !== algoliaAppIdValue || currentAdminKey !== algoliaAdminKeyValue) {
        client = algoliasearch(algoliaAppIdValue, algoliaAdminKeyValue);
        currentAppId = algoliaAppIdValue;
        currentAdminKey = algoliaAdminKeyValue;
    }

    return client;
}

module.exports = { getAlgoliaClient };

