// Importaciones necesarias de Firebase, Express y Algolia
const router = require('express').Router();
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const { algoliasearch } = require('algoliasearch');
const { logger } = require("firebase-functions");
const Joi = require('joi');

// Inicializa la base de datos de Firestore
const db = getFirestore();

// Middleware para verificar el token de autenticación (asumiendo que la ruta es la correcta)
const middlewares = require('../middlewares/verifyAuthTokens');

// --- Configuración de Algolia ---
// Define los secretos de Firebase para las claves de Algolia
const ALGOLIA_APP_ID = defineSecret("ALGOLIA_APP_ID");
const ALGOLIA_ADMIN_KEY = defineSecret("ALGOLIA_ADMIN_KEY");

// --- RUTAS DE LA API ---


//VALIDATIONS /CREATE
const createWorkOrderSchema = Joi.object({
    billTo: Joi.string().trim().min(1).max(100).required().messages({
        'string.empty': '"billTo" cannot be empty.',
        'any.required': '"billTo" is a required field.'
    }),
    startDate: Joi.date().iso().required(),
    closeDate: Joi.date().iso().allow(null), // Permite que sea nulo
    notedEquipments: Joi.array().items(Joi.object()).allow(null),
    servicesPerformed: Joi.array().items(Joi.object()).min(1).required().messages({
        'array.min': 'At least one service must be performed.'
    }),
    materialsUsed: Joi.array().items(Joi.object()).allow(null),
    type: Joi.string().valid('work', 'pickup').required(), // Solo permite 'work' o 'pickup'
});

/**
 * @route   POST /create
 * @desc    Crea una nueva orden de trabajo (Work Order).
 * @access  Private (requiere token de cliente)
 */
router.post('/create', middlewares.verifyClientToken, async (req, res) => {
    console.log(req.body.workOrderData)
    const { error, value } = createWorkOrderSchema.validate(req.body.workOrderData);
    // Si hay un error de validación, devuelve un error 400 con el mensaje específico.
    if (error) {
        logger.warn("Validation error creating work order:", error.details[0].message);
        // Devuelve el primer mensaje de error encontrado para claridad.
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    try {
        const userUid = req.afAuthTokenDecoded.user_id;

        // 2. Prepara el Objeto para Guardar en Firestore
        // Usa `value` que es el objeto validado y sanitizado por Joi.
        const newWorkOrder = {
            ...value, 
            createdBy: userUid,
            createdAt: FieldValue.serverTimestamp(),
            status: 'open',
        };

        // 3. Guarda en Firestore
        const workOrderRef = await db.collection('workOrders').add(newWorkOrder);

        logger.info(`Work Order created successfully with ID: ${workOrderRef.id} by user ${userUid}`);
        return res.status(201).json({
            success: true,
            message: 'Work Order created successfully.',
            workOrderId: workOrderRef.id
        });

    } catch (error) {
        logger.error("Error creating work order:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while creating the work order."
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
                body:{
                    "objectID":objectID,
                    'id':objectID,
                        ...newData
                }
            });
            logger.info(`Successfully synced Work Order ${objectID} to Algolia.`);
        } catch (error) {
            logger.error(`Error syncing Work Order ${objectID} to Algolia:`, error);
        }
    }
);


// --- EXPORTACIONES ---
// Exporta tanto el router para la API como el trigger para Firebase Functions
module.exports = {
    router,
    workOrderCreated,
};