const { auth } = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
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
    if (body.firstName === null || body.firstName === undefined || body.firstName.length < 3 || body.firstName.length > 50 || body.firstName === '') {
        return res.status(500).json({
            msg: 'The "firstName" field is required and must contain between 3 and 50 characters.',
            code: 'auth/error-first-name'
        });
    }
    if (body.lastName === null || body.lastName === undefined || body.lastName.length < 3 || body.lastName.length > 50 || body.lastName === '') {
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
            firstName: body.firstName,
            lastName: body.lastName,
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
        }).catch(err => {
            return res.status(500).json({
                name: err.name, message: err.message, code: 'auth/error-user-creation'
            })
        })
        await auth().setCustomUserClaims(userCreated.uid, {
            admin: true
        })
        //Setear la DB
        await db.collection('general').doc('settings').set({
            lastStartingDate: 1743764400000,
            paymentSchedule: "biweekly",
            paycheckHistory: []
        })

        return res.json({ message: 'Admin user created' })
    } catch (err) {
        return res.status(500).json({
            name: err.name, message: err.message, code: 'auth/general-error'
        })
    }
    return res.status(500)
})
router.post('/deleteAccount',middlewares.verifyClientToken, async (req, res) => {
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