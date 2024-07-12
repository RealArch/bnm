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
    //todo: Validate data
    try {
        //todo: get current user data from transaction
        await db.runTransaction((transaction) => {
            return transaction.get(userDocRef).then((userDoc) => {
                if (!userDoc.exists) {
                    throw "Document does not exist!";
                }
                userData = userDoc.data()
                //if there is a previous block, close that block adding the actual startTime as the previous endTime
                if (userData.currentShift.blocks.length > 0) {
                    userData.currentShift.blocks[userData.currentShift.blocks.length - 1].endTime = body.startTime
                    //if the current block is lunch and there is a lunch block already, send an error

                    // if(alreadyHasLunch(userData.currentShift)){
                    //     return res.status(500).json({ code:"S-001", msg: "This user already has a lunch period" })

                    // }

                }
                //then push the data
                userData.currentShift.blocks.push({
                    startTime: body.startTime,
                    endTime: null,
                    type: body.type,
                    workingPlace: body.workingPlace,
                    details: body.details
                })
                userData.status = 'onShift';
                if (body.type == 'lunch') {
                    userData.status = 'onLunch';
                    userData.currentShift.lunchTaken = true;
                }
                userData.lastUpdate = dateNow

                //save data
                transaction.update(userDocRef, userData)
            })
        })
        console.log("Transaction successfully committed!");
    } catch (error) {
        return res.status(500).json({ msg: "there were a problem saving the data" })

    }
    return res.status(200).json({ msg: "Shift updated successfully" })
})
router.post('/closeShift', middlewares.verifyClientToken, async (req, res)=>{
    //Close de previous block
    //totalize hours worked
    //add that block to the current active pay cycle
    
})


module.exports = router;

//Functions
function alreadyHasLunch(currentShift) {
    currentShift.forEach(element => {
        if (element.type == 'lunch') return true
    });
    return false
}