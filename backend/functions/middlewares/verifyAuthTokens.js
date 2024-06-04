
var admin = require("firebase-admin");

const middlewares = {
    verifyClientToken: function (req, res, next) {
        console.log('pase por aqui 0')

        var afAuthToken = req.body.afAuthToken || req.query.afAuthToken;
        if (afAuthToken) {
            admin.auth().verifyIdToken(afAuthToken)
                .then((decodedToken) => {
                    if (decodedToken.admin) {
                        return res.status(500).json({
                            'success': 'false',
                            'msg': "This account is not allowed to do this"
                        });
                    } else {
                        console.log('pase por aqui')
                        req.afAuthTokenDecoded = decodedToken
                        next();
                        return
                    }

                }).catch((err) => {
                    return res.status(500).json({
                        'success': 'false',
                        'message': 'Authentication error',
                        err: err
                    });
                })
        } else {
            //if there is no token
            // return an error
            return res.status(500).json({
                'code':'A-001',
                'success': 'false',
                'msg': 'No token provided.'
            });
        }
    },

    // verificarTokenAdmin: function (req, res, next) {
    //     console.log(req.body.afAuthToken)
    //     var afAuthToken = req.body.afAuthToken;
    //     if (afAuthToken) {
    //         admin.auth().verifyIdToken(afAuthToken)
    //             .then((decodedToken) => {
    //                 if (decodedToken.admin) {
    //                     req.afAuthTokenDecoded = decodedToken
    //                     next();
    //                     return
    //                 } else {
    //                     return res.status(500).json({
    //                         'success': 'false',
    //                         'msg': 'Este usuario no tiene persmisos para ejecutar esta acción.'
    //                     });
    //                 }

    //             }).catch((err) => {
    //                 console.log(err)
    //                 return res.status(500).json({
    //                     'success': 'false',
    //                     'message': 'Error en afAuth',
    //                     err: err
    //                 });
    //             })
    //     } else {
    //         return res.status(500).json({
    //             'success': 'false',
    //             'msg': 'No token provided.'
    //         });
    //     }
    // },
};
module.exports = middlewares;