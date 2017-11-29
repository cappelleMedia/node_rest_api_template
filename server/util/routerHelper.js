/**
 * Created by Jens on 19-Oct-16.
 */
const winston = require('winston');

module.exports.respond = function respond(err, response, res, errors) {
    if (err) {
        handleError(err);
    }
    if (response) {
        if (isNaN(response)) {
            res.json(response);
        } else {
            if (errors) {
                res.status(response).json({errors});
            } else {
                res.sendStatus(response);
            }
        }
    } else {
        res.sendStatus(500);
    }
}

function handleError(err) {
    winston.error('routerHelper error');
    if (isNaN(err)) {
        winston.error(err.message);
    } else {
        winston.error(err);
    }
    // console.log(err);
}
