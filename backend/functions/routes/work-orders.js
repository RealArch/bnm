// Importaciones necesarias de Firebase, Express y Algolia
const router = require('express').Router();
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { onDocumentCreated, onDocumentDeleted, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const { algoliasearch } = require('algoliasearch');
const { logger } = require("firebase-functions");
const Joi = require('joi');

// Inicializa la base de datos de Firestore
const db = getFirestore();

// Middleware para verificar el token de autenticación (asumiendo que la ruta es la correcta)
const middlewares = require('../middlewares/verifyAuthTokens');
const { default: createWorkOrderSchema } = require('../validators/work-order.schema');

// --- Configuración de Algolia ---
// Define los secretos de Firebase para las claves de Algolia
const ALGOLIA_APP_ID = defineSecret("ALGOLIA_APP_ID");
const ALGOLIA_ADMIN_KEY = defineSecret("ALGOLIA_ADMIN_KEY");

// --- RUTAS DE LA API ---


//VALIDATIONS /CREATE


/**
 * @route   POST /create
 * @desc    Crea una nueva orden de trabajo (Work Order).
 * @access  Private (requiere token de cliente)
 */
router.post('/create', middlewares.verifyClientToken, async (req, res) => {
    // 1. Validación de Datos con Joi (esto se mantiene igual)
    console.log(req.body.workOrderData.customer)
    const { error, value } = createWorkOrderSchema.validate(req.body.workOrderData);
    if (error) {
        logger.warn("Validation error creating work order:", error.details[0].message);
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    try {
        const userUid = req.afAuthTokenDecoded.user_id;

        // Referencia al documento contador
        const counterRef = db.collection('counters').doc('workOrderCounter');
        //obetener el usuario que creo la work order
        const user = await db.collection('users').doc(userUid).get()

        // --- INICIO DE LA LÓGICA DE TRANSACCIÓN ---
        // Usamos una transacción para garantizar que el número de control sea único y se incremente de forma atómica.
        // db.runTransaction() intentará ejecutar este bloque de código. Si hay conflictos (ej: otro usuario intenta hacer lo mismo),
        // lo reintentará automáticamente, asegurando la consistencia de los datos.
        const workOrderId = await db.runTransaction(async (transaction) => {
            // Lee el documento contador DENTRO de la transacción
            const counterDoc = await transaction.get(counterRef);

            if (!counterDoc.exists) {
                // Si el documento contador no existe, lanzamos un error para detener la operación.
                // Es crucial que el documento 'workOrderCounter' exista.
                throw new Error("Counter document 'workOrderCounter' does not exist!");
            }

            // Obtenemos el último número y calculamos el nuevo
            const lastNumber = counterDoc.data().lastControlNo;
            const newControlNo = lastNumber + 1;

            // Prepara el objeto de la nueva orden de trabajo
            const newWorkOrder = {
                ...value, // Datos validados por Joi
                controlNo: newControlNo, // ¡Aquí asignamos el nuevo número de control!
                createdBy: {
                    uid: userUid,
                    firstName: user.data().firstName,
                    lastName: user.data().lastName,
                },
                createdAt: FieldValue.serverTimestamp(), // serverTimestamp es seguro de usar en transacciones
                status: 'pending',
                openSign: {
                    img: null,
                    dateSigned: null,
                    requestedBy: {
                        id: null,
                        firstName: null,
                        lastName: null
                    },
                    imgName: null
                },
                closeSign: {
                    img: null,
                    dateSigned: null,
                    requestedBy: {
                        id: null,
                        firstName: null,
                        lastName: null
                    },
                    imgName: null
                }
            };

            // Creamos una referencia para el nuevo documento de Work Order.
            // No usamos .add() porque necesitamos la referencia antes de crear el documento.
            const newWorkOrderRef = db.collection('workOrders').doc();

            // DENTRO de la transacción, realizamos todas las escrituras:
            // 1. Actualiza el contador con el nuevo número.
            transaction.update(counterRef, { lastControlNo: newControlNo });

            // 2. Crea (set) el nuevo documento de la orden de trabajo.
            transaction.set(newWorkOrderRef, newWorkOrder);

            // La transacción retorna el ID del nuevo documento para usarlo en la respuesta.
            return newWorkOrderRef.id;
        });
        // --- FIN DE LA LÓGICA DE TRANSACCIÓN ---

        logger.info(`Work Order created successfully with ID: ${workOrderId} by user ${userUid}`);

        return res.status(201).json({
            success: true,
            message: 'Work Order created successfully.',
            workOrderId: workOrderId
        });

    } catch (error) {
        logger.error("Error creating work order:", error);
        // Si el error es el que lanzamos nosotros (contador no existe), se mostrará aquí.
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while creating the work order.",
            error: error.message // Opcional: para debugging
        });
    }
});

// --- TRIGGER DE FIREBASE FUNCTIONS (Para Sincronizar con Algolia) ---

/**
 * Se activa cuando un nuevo documento es creado en la colección 'workOrders'.
 * Su función es crear un registro correspondiente en Algolia.
 */
const workOrderCreated = onDocumentCreated({ document: 'workOrders/{workOrderId}', secrets: [ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY] },
    async (event) => {
        // Define el nombre del índice en Algolia (diferente para producción y desarrollo)
        const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'workOrders_prod' : 'workOrders_dev';

        // Inicializa el cliente de Algolia con tus credenciales
        const client = algoliasearch(ALGOLIA_APP_ID.value(), ALGOLIA_ADMIN_KEY.value());
        // const index = client.initIndex(ALGOLIA_INDEX_NAME);

        // Obtiene los datos del documento recién creado
        const newData = event.data.data();
        const objectID = event.data.id; // Usa el ID de Firestore como objectID en Algolia

        logger.info(`Syncing new Work Order ${objectID} to Algolia index: ${ALGOLIA_INDEX_NAME}`);

        try {
            // Guarda el nuevo objeto en el índice de Algolia
            await client.saveObject({
                indexName: ALGOLIA_INDEX_NAME,
                body: {
                    "objectID": objectID,
                    'id': objectID,
                    ...newData
                }
            });
            logger.info(`Successfully synced Work Order ${objectID} to Algolia.`);
        } catch (error) {
            logger.error(`Error syncing Work Order ${objectID} to Algolia:`, error);
        }
    }
);
const workOrderUpdated = onDocumentUpdated(
  { document: 'workOrders/{workOrderId}', secrets: [ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY] },
  async (event) => {
    // Define el nombre del índice en Algolia (diferente para producción y desarrollo)
    const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'workOrders_prod' : 'workOrders_dev';

    // Inicializa el cliente de Algolia con tus credenciales
    const client = algoliasearch(ALGOLIA_APP_ID.value(), ALGOLIA_ADMIN_KEY.value());
    // const index = client.initIndex(ALGOLIA_INDEX_NAME);

    // Obtiene los datos del documento después de la actualización
    const newData = event.data.after.data();
    const objectID = event.data.after.id; // Usa el ID de Firestore como objectID en Algolia

    logger.info(`Updating Work Order ${objectID} in Algolia index: ${ALGOLIA_INDEX_NAME}`);

    try {
      // Actualiza el objeto en el índice de Algolia
      await client.saveObject({
        indexName: ALGOLIA_INDEX_NAME,
        body: {
          objectID: objectID,
          id: objectID,
          ...newData,
        },
      });

      logger.info(`Successfully updated Work Order ${objectID} in Algolia.`);
    } catch (error) {
      logger.error(`Error updating Work Order ${objectID} in Algolia:`, error);
    }
  }
);

/**
 * Se activa cuando se elimina un documento en la colección 'workOrders'.
 * Elimina el objeto correspondiente del índice de Algolia.
 */
const workOrderDeleted = onDocumentDeleted({
    document: 'workOrders/{workOrderId}',
    secrets: [ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY]
}, async (event) => {
    // Define el nombre del índice en Algolia (diferente para producción y desarrollo)
    const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'workOrders_prod' : 'workOrders_dev';

    // Inicializa el cliente de Algolia con tus credenciales
    const client = algoliasearch(ALGOLIA_APP_ID.value(), ALGOLIA_ADMIN_KEY.value());

    // Obtiene el ID del documento eliminado de los parámetros del evento
    const objectID = event.params.workOrderId;

    logger.info(`Attempting to delete Work Order ${objectID} from Algolia index: ${ALGOLIA_INDEX_NAME}`);

    try {
        await client.deleteObject({
            indexName: ALGOLIA_INDEX_NAME,
            objectID: objectID
        });
        logger.info(`Successfully deleted Work Order ${objectID} from Algolia.`);
    } catch (error) {
        logger.error(`Error deleting Work Order ${objectID} from Algolia:`, error);
    }
});


// --- EXPORTACIONES ---
// Exporta tanto el router para la API como el trigger para Firebase Functions
module.exports = {
    router,
    workOrderCreated,
    workOrderDeleted,
    workOrderUpdated
};