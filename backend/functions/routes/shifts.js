const { auth } = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const router = require('express').Router();
const db = getFirestore()

const middlewares = require('../middlewares/verifyAuthTokens');


router.post('/start', middlewares.verifyClientToken, async (req, res) => {
    //todo: Valitade if user is ACTIVE
    //declarations
    var userUid = req.afAuthTokenDecoded.user_id;
    var dateNow = Date.now()
    var userDocRef = db.collection("users").doc(userUid);
    var userData = null;
    var body = req.body
    //
    console.log('entre')
    console.log(req.body)
    //todo: Validate data


    //todo:edit status on user data info

    try {
        //todo: get current user data from transaction
        await db.runTransaction((transaction) => {
            return transaction.get(userDocRef).then((userDoc) => {
                if (!userDoc.exists) {
                    throw "Document does not exist!";
                }
                userData = userDoc.data()
                //if  currentShift is empty, just push the data
                if (userData.currentShift.length == 0) {
                    userData.currentShift.push({
                        startTime: body.startTime,
                        endTime: null,
                        type: body.type,
                        workingPlace: body.workingPlace,
                        details: body.details
                    })
                    userData.status = 'onShift';
                    userData.lastUpdate = dateNow
                }
                //save data
                transaction.update(userDocRef, userData)
            })
        })
        console.log("Transaction successfully committed!");
    } catch (error) {
        return res.status(500).json({ msg: "there were a problem saving the data" })

    }
    return res.status(200).json({ msg: "Shift started successfully" })
})

module.exports = router