const { auth } = require('firebase-admin');
const admin = require('firebase-admin');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { defineSecret } = require('firebase-functions/params');
const { onDocumentDeleted } = require('firebase-functions/v2/firestore');
const middlewares = require('../middlewares/verifyAuthTokens');

const algoliaAppId = defineSecret('ALGOLIA_APP_ID');
const algoliaAdminKey = defineSecret('ALGOLIA_ADMIN_KEY');

const router = require('express').Router();
const db = getFirestore()

router.get('/', (req, res) => {
    console.log(algoliaAdminKey.value())
    console.log(algoliaAppId.value())
    return res.send("ok")
})
router.post('/signup', async (req, res) => {
    console.log('entre a crear')
    var body = req.body
    var dateNow = Date.now()
    if (body.firstName === null || body.firstName === undefined || body.firstName.length < 2 || body.firstName.length > 50 || body.firstName === '') {
        return res.status(500).json({
            msg: 'The "firstName" field is required and must contain between 3 and 50 characters.',
            code: 'auth/error-first-name'
        });
    }
    if (body.lastName === null || body.lastName === undefined || body.lastName.length < 2 || body.lastName.length > 50 || body.lastName === '') {
        return res.status(500).json({
            msg: 'The "lastName" field is required and must contain between 3 and 50 characters.',
            code: 'auth/error-last-name'
        });
    }
    if (body.password === null || body.password === undefined || body.password.length < 6 || body.password.length > 125 || body.password === '') {
        return res.status(500).json({
            msg: 'The "password" field is required and must contain between 6 and 125 characters.',
            code: 'auth/error-password'
        });
    }
    if (body.email === null || body.email === undefined || body.email.length < 6 || body.email.length > 125 || body.email === '') {
        return res.status(500).json({
            msg: 'The "email" field is required and must contain between 6 and 125 characters.',
            code: 'auth/error-email'
        });
    }
    var loginToken = null;
    var userCreated = null;
    try {
        userCreated = await auth().createUser({
            email: body.email,
            emailVerified: false,
            password: body.password,
        }).catch(err => {
            console.log(err)
            return res.status(500).json({
                name: err.name, message: err.message, code: 'auth/error-user-creation'
            })
        })
        //set claims, Ex. active:false
        //TODO, if this fails, remove the user
        await auth().setCustomUserClaims(userCreated.uid, {
            active: false
        })
        var userDataDb = {
            email: body.email,
            firstName: body.firstName.toString(),
            lastName: body.lastName.toString(),
            active: false,
            status: 'outOfShift', // outOfShift | onShift 
            currentShift: {
                blocks: [],
                lunchTaken: false,
            },
            paycheckHistory: [],
            currentPaycheck: [],
            creationDate: dateNow,
            lastUpdate: dateNow,
            lastFinishedShift: null,
            uid: userCreated.uid,
            hourlyRate: 0,
        }
        await db.collection('users').doc(userCreated.uid).set(userDataDb).catch(err => {
            //Delete user previeusly created
            auth().deleteUser(userCreated.uid)
            return res.status(500).json({
                name: err.name, message: err.message, code: 'auth/error-firestore'
            })
        })
        loginToken = await auth().createCustomToken(userCreated.uid)
            .catch(err => {
                auth().deleteUser(userCreated.uid)
                return res.status(500).json({
                    name: err.name, message: err.message, code: 'auth/token-firestore'
                })
            })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            name: err.name, message: err.message, code: 'auth/general-error'
        })

    }

    return res.json({ message: 'User created', data: userDataDb, loginToken: loginToken })
})


router.get('/createAdminUser', async (req, res) => {
    try {
        var userCreated = await auth().createUser({
            email: 'admin@admin.com',
            password: '111111',
            name: 'Admin',
            lastName: 'Admin',
        }).catch(err => {
            return res.status(500).json({
                name: err.name, message: err.message, code: 'auth/error-user-creation'
            })
        })
        await auth().setCustomUserClaims(userCreated.uid, {
            admin: true,
            active:true
        })
        //Setear la DB
        await db.collection('general').doc('settings').set({
            lastStartingDate: 1743764400000,
            paymentSchedule: "biweekly",
            paycheckHistory: [],
            workOrderCounters:{
                lastControlNo:4999
            }
        })
        await db.collection('adminUsers').doc(userCreated.uid).set({
            email: 'admin@admin.com',
            createdDate: FieldValue.serverTimestamp(),
            name: 'Admin',
            lastName: 'Admin',
            active: true

        })

        return res.json({ message: 'Admin user created' })
    } catch (err) {
        return res.status(500).json({
            name: err.name, message: err.message, code: 'auth/general-error'
        })
    }
})

// Ruta para eliminar un usuario
router.delete('/adminUsers/:userId', middlewares.verifyAdminToken, async (req, res) => {
    const userId = req.params.userId; // Accede al ID desde los parámetros de la URL

    try {
        // Aquí iría la lógica para eliminar el usuario de tu base de datos
        // Por ejemplo, con Firebase Admin SDK si el usuario está en Authentication
        await admin.auth().deleteUser(userId);
        await db.collection('adminUsers').doc(userId).delete();

        return res.status(200).json({ success: true, message: `Usuario ${userId} eliminado correctamente.` });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        // Manejo de errores específicos, por ejemplo, si el usuario no existe
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }
        return res.status(500).json({ success: false, message: 'Error interno del servidor al eliminar usuario.', error: error.message });
    }
});

router.patch('/adminUsers/changeStatus', middlewares.verifyAdminToken, async (req, res) => {
    // Extract newStatus and userId from the request body
    const { newStatus, userId } = req.body;

    // --- Input Validation ---
    // Validate that newStatus is a boolean type
    if (typeof newStatus !== 'boolean') {
        return res.status(409).json({
            code: 'auth/newStatus-field-error',
            message: 'newStatus field must be a boolean (true/false).'
        });
    }
    // Validate that userId is provided and is a string
    if (!userId || typeof userId !== 'string') {
        return res.status(409).json({
            code: 'auth/userId-field-error',
            message: 'userId field not valid or not provided.'
        });
    }
    // --- End Input Validation ---

    try {
        // --- Update User in Firebase Authentication (Custom Claims) ---
        // Set the 'active' custom claim for the specified user.
        // This affects the user's token and can be used for authorization rules.
        await auth().setCustomUserClaims(userId, { active: newStatus });
        
        // --- Update User in Firestore Database ---
        // Update the 'active' field and 'lastUpdate' timestamp in the user's Firestore document.
        // This keeps the database record consistent with the authentication state.
        await db.collection('adminUsers').doc(userId).update({
            active: newStatus,
            lastUpdate: FieldValue.serverTimestamp() // Uses Firestore's server timestamp
        });

        // --- Success Response ---
        // Send a 200 OK response indicating successful status change.
        return res.status(200).json({
            success: true,
            message: `User ${userId} status changed to ${newStatus}.` // Use newStatus for the message
        });

    } catch (error) {
        // --- Error Handling ---
        console.error('Error changing user status:', error);

        // Handle specific Firebase Auth errors
        if (error.code === 'auth/user-not-found') {
            return res.status(404).json({
                success: false,
                message: 'User not found in Firebase Authentication.',
                error: error.message
            });
        }
        // General error response for any other unexpected errors during the process
        return res.status(500).json({
            success: false,
            message: 'Internal server error occurred while changing user status.',
            error: error.message
        });
    }


})

/**
 * @route POST /api/createUser
 * @desc Crea un nuevo usuario en Firebase Authentication y guarda su perfil en Firestore.
 * @access AdminAuth (Considera agregar middleware de autenticación si solo admins pueden crear usuarios)
 * @param {string} email - Correo electrónico del nuevo usuario.
 * @param {string} password - Contraseña del nuevo usuario (mínimo 6 caracteres).
 * @param {string} name - Contraseña del nuevo usuario (mínimo 2 caracteres).
 * @param {string} lastname - Contraseña del nuevo usuario (mínimo 2 caracteres).
 */
router.post('/addAdminUser', middlewares.verifyAdminToken, async (req, res) => {
    const { email, password, name, lastName } = req.body;

    // --- 1. Validaciones de entrada ---
    if (!email || email.length > 200) {
        return res.status(409).json({
            code: 'auth/email-error',
            message: 'Email field not valid.'
        });
    }
    if (!password || password.length < 6 || password.length > 125) {
        return res.status(409).json({
            code: 'auth/password-error',
            message: 'password field not valid.'
        });
    }
    if (!name || name.length < 2 || name.length > 125) {
        return res.status(409).json({
            code: 'auth/name-error',
            message: 'name field not valid.'
        });
    }
    if (!lastName || lastName.length < 2 || lastName.length > 125) {
        return res.status(409).json({
            code: 'auth/lastName-error',
            message: 'lastName field not valid.'
        });
    }


    try {
        let userRecord;
        try {
            // --- 2. Crear el usuario en Firebase Authentication ---
            userRecord = await auth().createUser({
                email: email,
                password: password,
                name: name,
                lastName: lastName,
            });

        } catch (authError) {
            // Manejo de errores específicos de Firebase Authentication
            if (authError.code === 'auth/email-already-in-use') {
                return res.status(409).json({
                    name: authError.name,
                    message: 'The email address is already in use by another account.',
                    code: authError.code
                });
            }
            // Otros errores de autenticación inesperados
            return res.status(500).json({
                name: authError.name,
                message: authError.message,
                code: 'auth/firebase-auth-error'
            });
        }

        // --- 3. Guardar información adicional del usuario en Firestore ---
        // Se asume que siempre queremos guardar un perfil en Firestore después de crear el usuario en Auth.
        await db.collection('adminUsers').doc(userRecord.uid).set({
            email: userRecord.email, // Usa userRecord.email para asegurar consistencia
            createdDate: FieldValue.serverTimestamp(),
            active: true, // El usuario está activo por defecto
            name: name,
            lastName: lastName,
            // Puedes añadir más campos aquí, como:
            // name: '',
            // lastName: '',
            // role: 'standard' // Ejemplo de rol predeterminado
        });

        // --- 4. Opcional: Establecer claims personalizados (si es necesario para la lógica de tu app) ---
        // Por ejemplo, si necesitas definir roles o permisos a nivel de token de forma inmediata:
        // await auth().setCustomUserClaims(userRecord.uid, {
        //     role: 'standardUser',
        //     level: 1
        // });
        await auth().setCustomUserClaims(userRecord.uid, {
             admin: true,
            active:true
        })

        // --- 5. Respuesta exitosa ---
        return res.status(201).json({
            message: 'User created successfully',
            uid: userRecord.uid,
            email: userRecord.email
        });

    } catch (dbError) {
        // Manejo de errores que ocurran *después* de la creación en Auth (ej. fallos en Firestore)
        // Consideración: Si el fallo es aquí, el usuario ya existe en Firebase Auth pero no en Firestore.
        // Podrías añadir lógica para limpiar el usuario de Auth si esto es crítico para tu aplicación.
        //eng
        console.error(`Error saving user data in Firestore for UID ${dbError.uid}:`, dbError);
        return res.status(500).json({
            name: dbError.name,
            message: ' There was an error saving the user data in the database.',
            code: 'firestore/data-save-error'
        });
    }
});
router.post('/deleteAccount', middlewares.verifyClientToken, async (req, res) => {
    const userUid = req.body.userUid;
    try {
        await auth().deleteUser(userUid);
        await db.collection('users').doc(userUid).delete();

        return res.status(200).json({
            success: true,
            message: 'Your account has been deleted successfully.'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'There was an error deleting your account. Please try again.'
        });
    }
});
//Trigger functions
// const userDeleted = exports.userDeleted = onDocumentDeleted('users/{userId}',
//     async (event) => {
//         // const userId = event.params.userId;
//         const userId = event.id;
//         try {
//             await auth().deleteUser(userId);
//             console.log(`User ${userId} deleted from Firebase Auth.`);
//         } catch (error) {
//             console.error(`Error deleting user ${userId} from Auth:`, error);
//         }
//     }
// );

module.exports = {
    router,
    // userDeleted // Exporta el router para las rutas de Express

};