const { auth } = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const router = require('express').Router();
const db = getFirestore()

const middlewares = require('../middlewares/verifyAuthTokens');


router.post('/start', middlewares.verifyClientToken, (req, res) => {
    console.log('entre')
    console.log(req.body)
    return res.status(200).json({ msg: "Shift started successfully" })
})

module.exports = router