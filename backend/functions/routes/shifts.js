const { auth } = require('firebase-admin');
const router = require('express').Router();
const { onDocumentUpdated, onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { logger } = require("firebase-functions");
const { initializeApp } = require('firebase-admin/app');

const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const db = getFirestore()




const middlewares = require('../middlewares/verifyAuthTokens');
const { createFortnightArray, calculateEndOfPaycheck } = require('../utilities/utilities');
const utilities = require('../utilities/utilities');

//Algolia config
const { algoliasearch } = require('algoliasearch');
const { defineSecret } = require('firebase-functions/params');
const ALGOLIA_APP_ID = defineSecret("ALGOLIA_APP_ID")
const ALGOLIA_ADMIN_KEY = defineSecret("ALGOLIA_ADMIN_KEY");



router.get('/closePaycheck', async (req, res) => {
    try {
        var paychecks = await closePaycheck()
        return res.json(paychecks)

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
    //Validate Geolocation
    if (body.startGeolocation == null || body.startGeolocation.lat == null || body.startGeolocation.lng == null) {
        return res.status(500).json({ 'success': false, msg: 'Geolocation not provided', code: 'g-001' })
    }
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
                    userData.currentShift.blocks[userData.currentShift.blocks.length - 1].endGeolocation = body.startGeolocation
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
                    details: body.details,
                    startGeolocation: body.startGeolocation,
                    endGeolocation: null
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
    if (body.endGeolocation == null || body.endGeolocation.lat == null || body.endGeolocation.lng == null) {
        return res.status(500).json({ 'success': false, msg: 'Geolocation not provided', code: 'g-001' })
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
                userData.currentShift.blocks[blocksLength - 1].endGeolocation = body.endGeolocation;

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
        //get the day, month and year from string
        var startTime = blocks[0].startTime
        const [datePart] = startTime.split('T');
        const [year, month, day] = datePart.split('-');
        //Create Date and Set the shiftDate to 12:00pm
        const dateUTC = new Date(year, month - 1, day, 12, 0, 0, 0);
        const shiftDate = dateUTC.getTime();
        // Add the closing shift to collection "usersCurrentPaychecks"
        await userDocRef.set({
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
//TRIGGER FUNCTIONS
const paycheckHistoryCreated = exports.paycheckHistory = onDocumentCreated({ document: 'paycheckHistory/{paycheckHistoryId}', secrets: [ALGOLIA_ADMIN_KEY, ALGOLIA_APP_ID] },
    (event) => {
        const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'paycheckHistory_prod' : 'paycheckHistory_dev';
        const client = algoliasearch(ALGOLIA_APP_ID.value(), ALGOLIA_ADMIN_KEY.value());

        client.saveObject({
            indexName: ALGOLIA_INDEX_NAME,
            body: {
                "objectID": event.data.id,
                "id": event.data.id,
                ...event.data.data(),
            },
        })
        return
    }
)
const paycheckHistoryUpdated = exports.paycheckHistory = onDocumentUpdated({ document: 'paycheckHistory/{paycheckHistoryId}', secrets: [ALGOLIA_ADMIN_KEY, ALGOLIA_APP_ID] },
    (event) => {
        const ALGOLIA_INDEX_NAME = !process.env.FUNCTIONS_EMULATOR ? 'paycheckHistory_prod' : 'paycheckHistory_dev';
        const client = algoliasearch(ALGOLIA_APP_ID.value(), ALGOLIA_ADMIN_KEY.value());

        client.saveObject({
            indexName: ALGOLIA_INDEX_NAME,
            body: {
                "objectID": event.data.after.id,
                "id": event.data.after.id,
                ...event.data.after.data(),
            },
        })
        return
    }
)


// module.exports = router;

const closePaychecks = exports.closePaychecks = onSchedule({
    schedule: "45 23 * * *",
    timeZone: "America/New_York"
},
    async (event) => {
        console.log('Ejecutando auto')
        try {
            await closePaycheck()
            return

        } catch (e) {
            console.log(e)
            logger.error(e)
            return res.status(500).send(e)
        }
    });
module.exports = {
    router, // Exporta el router para las rutas de Express
    paycheckHistoryCreated, // Exporta la función de Firebase
    paycheckHistoryUpdated, // Exporta la función de Firebase
    closePaychecks // Exporta la función de Firebase
};
//   module.exports = [paycheckHistoryCreated, paycheckHistoryUpdated, closePaychecks]
//   module.exports =[paycheckHistoryCreated]
//   module.exports = [router, paycheckHistoryCreated, paycheckHistoryUpdated]
//   exports.closePaychecks = closePaychecks
//Automatic function simulation
//Execute it every day at 11:59 new york timezone
async function closePaycheck() {
    let users
    let paychecks
    let settings
    let settingsRef = db.collection('general').doc('settings')
    let paymentSchedule
    let lastStartingDate
    let endDate
    let paycheckHistoryId
    try {
        //Read configurations
        settings = (await settingsRef.get()).data()
        paymentSchedule = settings.paymentSchedule
        lastStartingDate = settings.lastStartingDate
        //Calculate next closing date
        endDate = calculateEndOfPaycheck(paymentSchedule, lastStartingDate)
        paycheckHistoryId = lastStartingDate.toString() + '-' + endDate.toString()


        //If today is closing date or > (omitted when simulation)

        // console.log(endDate)
        // if (Date.now() < endDate) {
        //     return console.log('nop')
        // }

        paychecks = {
            paymentScheme: paymentSchedule,
            usersPaychecks: [],
            startDate: lastStartingDate,
            endDate: endDate
        }
        //Read all users to see if some of then have any open shift, then remove the shift
        //Read all users
        let usersDocs = await db.collection('users').get()
        let batch = db.batch();

        for (let i = 0; i < usersDocs.docs.length; i++) {
            const doc = usersDocs.docs[i];
            let userRef = db.collection('users').doc(doc.id);
            let user = doc.data();
            const lastBlockLength = user.currentShift.blocks[user.currentShift.blocks.length - 1];


            //close the last block if open and set the status to outOfShift 
            if (lastBlockLength != undefined && lastBlockLength.endTime == null) {
                batch.update(userRef, {
                    currentShift: { blocks: [], lunchTaken: false },
                    status: 'outOfShift',
                    // currentPaycheck: []
                });
            }

            // if it is payday, do this
            if (Date.now() > endDate) {


                // return console.log('it is not payday'); // Detiene la ejecución completa de la función

                // Agrega el cheque de pago actual formateado para este usuario a la colección de cheques de pago
                let userPaycheck = {
                    userId: doc.id,
                    days: user.currentPaycheck,
                    hourlyRate: user.hourlyRate
                };
                if (user.currentPaycheck.length > 0) {
                    paychecks.usersPaychecks.push(userPaycheck);
                    batch.update(userRef, {
                        paycheckHistory: FieldValue.arrayUnion(paycheckHistoryId),
                        currentPaycheck: []
                    });
                }

                //Update next lastStartingDate
                let lastStartingDateUpdated = utilities.calculateNextPaycheckStart(endDate)
                batch.update(settingsRef, { lastStartingDate: lastStartingDateUpdated })

                //Create a doc in collection 'paychecks' with id 'lastStartingDate'
                batch.set(db.collection('paycheckHistory').doc(paycheckHistoryId), paychecks)
                //Add the referencia of the paycheck generated to configs
                //TODO tal vez sea bueno anadir una validacion que confirma si existe el valor en el array paycheckHistory. Asi no haya pie para dublicados
                batch.set(db.collection('general').doc('settings'), {
                    paycheckHistory: FieldValue.arrayUnion(paycheckHistoryId)
                }, { merge: true })
            }



            // batch.update(userRef, {
            //     currentShift: { blocks: [], lunchTaken: false },
            //     status: 'outOfShift',
            //     currentPaycheck: []
            // });

            // Si el turno aún está abierto (endTime == null), elimina el turno del día

        }
        // usersDocs.forEach(doc => {
        //     let userRef = db.collection('users').doc(doc.id)
        //     let user = doc.data()
        //     const lastBlockLength = user.currentShift.blocks[user.currentShift.blocks.length - 1];

        //     //if it is not payday, check if there is some open shift, if so, close it
        //     if (Date.now() < endDate) {
        //         //IT IS NOT PAYDAY
        //         //close use has open shifts (endTime == null), close them
        //         if (lastBlockLength != undefined && lastBlockLength.endTime == null) {
        //             //close the last block and set the status to outOfShift
        //             db.collection('users').doc(doc.id).update({
        //                 currentShift: { blocks: [], lunchTaken: false },
        //                 status: 'outOfShift',
        //                 currentPaycheck: []
        //             }).then(() => {
        //                 console.log('Shift closed successfully!')
        //             }).catch((error) => {
        //                 console.error('Error closing shift: ', error);
        //             })
        //             // batch.update(userRef, {
        //             //     currentShift: { blocks: [], lunchTaken: false },
        //             //     status: 'outOfShift',
        //             //     currentPaycheck: []
        //             // })
        //         }
        //         return console.log('it is not payday')
        //     }


        //     //Then, add the current paycheck formatted for this user to the collection paychecks
        //     //the id will be the start date
        //     let userPaycheck = {
        //         userId: doc.id,
        //         days: user.currentPaycheck,
        //         hourlyRate: user.hourlyRate
        //     }
        //     if (user.currentPaycheck.length > 0) {
        //         paychecks.usersPaychecks.push(userPaycheck)
        //         batch.update(userRef, {
        //             paycheckHistory: FieldValue.arrayUnion(paycheckHistoryId)
        //         })
        //     }
        //     batch.update(userRef, {
        //         currentShift: { blocks: [], lunchTaken: false },
        //         status: 'outOfShift',
        //         currentPaycheck: []
        //     })

        //     //if the shift is still open (endTime == null), remove day shift
        //     if (lastBlockLength != undefined && lastBlockLength.endTime == null) {

        //         batch.update(userRef, {
        //             currentShift: { blocks: [], lunchTaken: false },
        //             status: 'outOfShift',
        //             currentPaycheck: []
        //         })
        //     }



        // });


        await batch.commit()
    } catch (error) {
        if (error.message === 'Cannot commit a write batch with no writes.') {
            console.log('Batch is empty, skipping commit');
        } else {
            console.log(error)
        }

    }
    return paychecks
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
    //eliminar los segundos para que sean minutos exactos

    var workedHours = setSecondsToZeroFromMillis(totalTimeWorked)
    var lunchedHours = setSecondsToZeroFromMillis(totalTimeLunch)

    return {
        lunch: lunchedHours,
        work: workedHours
    }
}

function setSecondsToZeroFromMillis(milliseconds) {
    const date = new Date(milliseconds); // Convierte los milisegundos a un objeto Date
    date.setSeconds(0, 0); // Establece los segundos y milisegundos a cero
    return date.getTime(); // Devuelve el tiempo en milisegundos con los segundos en cero
}

