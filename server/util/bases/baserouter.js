/**
 * Created by Jens on 19-Oct-16.
 */
const helper = require('../routerHelper');
const objectId = require('mongoose').Types.ObjectId;

module.exports = function (app, base, Controller) {

    app.get(base + '/ping', function (req, res) {
        res.json({pong: Date.now()});
    });

    app.post(base, function (req, res) {
        Controller.registerUser(req.body, function (err, response, validationResult) {
            helper.respond(err, response, res, validationResult);
        });
    });

    app.get(base, function (req, res) {
        Controller.getAll(0, 0, function (err, response, errors) {
            helper.respond(err, response, res, errors);
        });
    });

    app.get(base + '/paged/:limit/:skip?', function (req, res) {
        Controller.getAll(parseInt(req.params.limit), parseInt(req.params.skip), function (err, response) {
            helper.respond(err, response, res);
        })
    });

    app.get(base + '/:id', function (req, res) {
        if (!req.params.id || !isValidObjId(req.params.id)) {
            //TO HELP DEVELOPERS DEBUG
            helper.respond(null, 500, res, {'dev': '/' + req.params.id + '/' + ' is not a valid id'});
        } else {
            Controller.getOne(req.params.id, function (err, response) {
                helper.respond(err, response, res);
            });
        }
    });

    app.put(base + '/:id', function (req, res) {
        if (!req.params.id || !isValidObjId(req.params.id)) {
            //TO HELP DEVELOPERS DEBUG
            helper.respond(null, 500, res, {'dev': '/' + req.params.id + '/' + ' is not a valid id'});
        }
        else {
            Controller.updateObj(req.params.id, req.body, function (err, response, validationResult) {
                helper.respond(err, response, res, validationResult);
            });
        }
    })
    ;

    app.delete(base + '/:id', function (req, res) {
        //TODO CHECK FOR AUTHENTICATIONS (admin credentials)
        if (!req.params.id || !isValidObjId(req.params.id)) {
            //TO HELP DEVELOPERS DEBUG
            helper.respond(null, 500, res, {'dev': '/' + req.params.id + '/' + ' is not a valid id'});
        } else {
            Controller.deleteObj(req.params.id, req.body.token,function (err, response) {
                helper.respond(err, response, res);
            });
        }
    });
};

//FIXME VALIDATOR PLUGIN CAN TEST THIS TOO
function isValidObjId(id) {
    try {
        var validId = new objectId(id);
        if (id === validId.toString()) {
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
}



