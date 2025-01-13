const { auth } = require('firebase-admin');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const functions = require('firebase-functions/v2');
const { firestore } = require('firebase-functions/v2');
const { onDocumentUpdated } = require('firebase-functions/v2/firestore');
const router = require('express').Router();
const db = getFirestore()


const express = require('express');

const app = express();

const middlewares = require('../middlewares/verifyAuthTokens');
const { createFortnightArray } = require('../utilities/utilities');


router.get('/closePaycheck', async (req, res) => {
    try {
        await closePaycheck()
        return res.send('ok')

    } catch (e) {
        return res.status(500).send(e)
    }
})
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
router.post('/close', middlewares.verifyClientToken, async (req, res) => {
    var userUid = req.afAuthTokenDecoded.user_id;
    var body = req.body;
    var blocksLength;
    var userDocRef = db.collection("users").doc(userUid);
    var userData = null;
    var blocks;
    var timeWorked
    var dateNow = Date.now()
    var lunchTaken;
    var shiftDate
    var nextPayDay = null
    var settings = null
    var currentFortnight = null
    var dayName = null
    //INPUTS: closingTime,
    console.log(body.closingTime)
    if (body.closingTime === null || body.closingTime === undefined || body.closingTime.length < 1 || body.closingTime.length > 150) {
        return res.status(500).json({
            msg: 'The "closingTime" field is required and must contain between 1 and 15 characters.',
            code: 'shifts/error-no-closing-time'
        });
    }

    //Close de previous block
    try {
        await db.runTransaction((transaction) => {
            return transaction.get(userDocRef).then((userDoc) => {
                if (!userDoc.exists) {
                    throw "Document does not exist!";
                }
                userData = userDoc.data();
                blocksLength = userData.currentShift.blocks.length;
                userData.currentShift.blocks[blocksLength - 1].endTime = body.closingTime;
                //Change the status of the user to 'outOfShift'
                userData.status = 'outOfShift';
                userData.lastUpdate = dateNow;
                userData.lastFinishedShift = Date.now();
                // userData.currentShift.shiftFinished = true;
                //TODO: Es date.now seguro si trabajo con diferentes husos horarios?
                blocks = userData.currentShift.blocks
                lunchTaken = userData.currentShift.lunchTaken
                // timeWorked = getElapsedMinSec(blocks);
                // userData.currentShift.totalTimeWorked = getElapsedMinSec(blocks);
                userData.currentShift.blocks = [];
                userData.currentShift.lunchTaken = false;
                //save data
                // return

                return transaction.update(userDocRef, userData);
            })
        })
        //totalize hours worked
        timeWorked = getElapsedMinSec(blocks);
        //Set the shiftDate to 12:00pm
        console.log(blocks[0].startTime)
        shiftDate = new Date(blocks[0].startTime).setHours(12, 0, 0, 0);
        // Add the closing shift to collection "usersCurrentPaychecks"
        var userCurrentPaychecks = await userDocRef.set({
            currentPaycheck: FieldValue.arrayUnion({
                blocks: blocks,
                lunchTaken: lunchTaken,
                day: shiftDate,
                timeWorked: timeWorked
            })

        }, { merge: true })







        // //Una vez guardamos la data añadimos el bloque trabajado al registro general semanal
        // // quedamos en crear un documento por cada quincena. ademas crear una coleccion para dias individuales y guiardarlos en algolia


        // //obtener el dia de pago correspondiente para la fecha de hoy
        // settings = await db.collection('general').doc('settings').get();
        // nextPayDay = settings.data().nextPayDay.toString()
        // console.log(nextPayDay)
        // //Leer el fortnight current
        // console.log(111)
        // // currentFortnight = await db.collection('fortnights').doc(nextPayDay).get()



        // // console.log('999')

        // //Then save the data from createFortnightArray, adding the data for this user. 
        // //with a transaction due to the change sensitive data
        // var userDocRef = db.collection('fortnights').doc(nextPayDay)
        // await db.runTransaction((transaction) => {
        //     return transaction.get(userDocRef).then((userDoc) => {
        //         //Si no existe para esta semana, crearlo
        //         if (!userDoc.exists) {
        //             //"createFortnightArray" creates the template for filling the payCheck  data
        //             var fortnightArray = createFortnightArray('biweekly', nextPayDay)
        //             fortnightArray
        //             return transaction.update(userDocRef, userData);
        //         }
        //     })
        // })
        // console.log(fortnightArray)
        // // dayName = getDayName()

        // // await db.collection('fortnights').doc(nextPayDay).set({
        // //     days: FieldValue.arrayUnion({
        // //         day: null,
        // //         employees: [
        // //             {
        // //                 employeeId: null,
        // //                 block: blocks,
        // //                 timeWorked: timeWorked,
        // //             }
        // //         ]
        // //     })
        // // })





        //TODO add that block to the current active pay cycle
        return res.status(200).json({ msg: "Shift successfully finished" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "there were a problem saving the data" })
    }
    return res.status(200).json({ msg: "Shift updated successfully" })






})

module.exports = router;
exports.app = functions.https.onRequest(app);

//Automatic function simulation
//Execute it every day at 11:59 new york timezone
async function closePaycheck() {
    //If today is closing date (omitted when simulation)
    //read all users
    let usersRef = db.collection('users')
    try {
        await db.runTransaction(async (t) => {
            const users = await t.get(usersRef);
            //Delete all open shifts, and send a notification to those
            for (let i = 0; i < users.length; i++) {
                const j = users[i].data().currentPaycheck.length;
                const lastBlock = users[i].data().currentPaycheck[j-1].blocks[users[i].data().currentPaycheck[j-1].blocks.length - 1];
                if(lastBlock.endTime == null){
                    console.log(user[i].data().currentPaycheck.length)
                    users[i].data().currentPaycheck.splice(0, 1);
                    console.log(users[i].data().currentPaycheck.length)

                    console.log(users[i].data().currentPaycheck)

                }
            }
            // users.forEach(user => {
            //     //get last block worked of the paycheck
                
            //     // console.log(user.data().currentPaycheck[1])
            //     // if (user.data().currentPaycheck[l < 1].block)
            // });
            
            // const newPopulation = doc.data().population + 1;
            // t.update(cityRef, { population: newPopulation });
        });

        console.log('Transaction success!');
    } catch (e) {
        console.log('Transaction failure:', e);
    }


    //Copy data from userData to collection payChecks and add a new doc with id= openingDay-closingDay Ex 12-27-24/1-9-25
    //set lastStartingDate with 12pm set
}

//Functions
function alreadyHasLunch(currentShift) {
    currentShift.forEach(element => {
        if (element.type == 'lunch') return true
    });
    return false
}
function getDayName(milliseconds) {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(milliseconds);
    const dayName = daysOfWeek[date.getUTCDay()];
    return dayName;
}
function getElapsedMinSec(blocks) {
    var totalTimeWorked = 0;
    var totalTimeLunch = 0;

    blocks.forEach((block, index) => {
        let timeDifference = new Date(block.endTime).getTime() - new Date(block.startTime).getTime();
        if (block.type != "lunch") {
            totalTimeWorked += timeDifference
        } else {
            totalTimeLunch += timeDifference
        }

    });
    var workedHours = totalTimeWorked
    var lunchedHours = totalTimeLunch
    return {
        lunch: lunchedHours,
        work: workedHours
    }
}