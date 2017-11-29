/**
 * Created by Jens on 12-Oct-16.
 */
const winston = require('winston');

const Controller = require('./controller');
const helper = require('../../util/routerHelper');

module.exports = function (app, base) {
    let controller = new Controller();

    //BASE ROUTE OVERRIDES AND ADDONS
    app.post(base, function (req, res) {
        controller.registerUser(req.body, function (err, response, validationResult) {
            helper.respond(err, response, res, validationResult);
        })
    });
    app.get(base + '/username/:username', function (req, res) {
        controller.getUserByName(req.params.username, function (err, response) {
            helper.respond(err, response, res);
        });
    });
    app.get(base + '/email/:email', function (req, res) {
        controller.getUserByEmail(req.params.email, function (err, response) {
            helper.respond(err, response, res);
        });
    });
    app.put(base + '/activate', function (req, res) {
        controller.activate(req.body, function (err, response, errors) {
            helper.respond(err, response, res, errors);
        })
    });
    app.post(base + '/authenticate', function (req, res) {
        controller.authenticate(req.identifier, req.pwd, function (err, response) {
            helper.respond(err, response, res);
        });
    });

    app.post(base + '/verifyAdmin', function (req, res) {
        controller.verifyAdmin(req.body.token, function (err, response) {
            helper.respond(err, response, res);
        });
    });

    //TODO passwordUpdate (check regkey + new passwords)
    //TODO passwordReset (mail)

    //BASE ROUTES
    require('../../util/bases/baserouter')(app, base, controller);


    //FIXME THIS IS FOR TESTING ONLY, BEWARE
    app.get(base + '/dev/adminToken', function (req, res) {
        controller.getAdminToken(function (err, response) {
            helper.respond(err, response, res);
        })
    });
};
