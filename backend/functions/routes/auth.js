const { auth } = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const router = require('express').Router();
const db = getFirestore()

router.post('/signup', async (req, res) => {
    var body = req.body
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
        var userDataDb = {
            email: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            active:false,
            creationDate: Date.now()
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
        await auth().setCustomUserClaims(userCreated.uid,{
            admin:true
        })
        return res.json({ message: 'Admin user created'})
    } catch (error) {
        return res.status(500).json({
            name: err.name, message: err.message, code: 'auth/general-error'
        })
    }
    return res.status(500)
})
module.exports = router