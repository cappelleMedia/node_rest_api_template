const helper = require('../helpers/routerHelper'),
	objectId = require('mongoose').Types.ObjectId;

module.exports = function (app, base, Controller) {

	app.get(base + '/ping', (req, res) => {
		res.json({pong: Date.now()});
	});

	app.post(base, async (req, res) => {
		const result = await Controller.addObj(req.body);
		helper.respond(result.err, result.response, res, result.validationResult);
	});

	app.get(base, async (req, res) => {
		const result = await Controller.getAll(0, 0);
		helper.respond(result.err, result.response, res);
	});

	app.get(base + '/paged/:limit/:skip?', async (req, res) => {
		const result = await Controller.getAll(parseInt(req.params.limit), parseInt(req.params.skip));
		helper.respond(result.err, result.response, res);
	});

	app.get(base + '/:id', async (req, res) => {
		if (!req.params.id || !isValidObjId(req.params.id)) {
			//TO HELP DEVELOPERS DEBUG
			helper.respond(null, 500, res, {'dev': '/' + req.params.id + '/' + ' is not a valid id'});
		} else {
			const result = await Controller.getOne(req.params.id);
			helper.respond(result.err, result.response, res);
		}
	});

	app.put(base + '/:id', async (req, res) => {
		if (!req.params.id || !isValidObjId(req.params.id)) {
			//TO HELP DEVELOPERS DEBUG
			helper.respond(null, 500, res, {'dev': '/' + req.params.id + '/' + ' is not a valid id'});
		} else if (!req.body.jwt) {
			helper.respond(null, 500, res, {'dev': 'No jwt found'});
		} else if (!req.body.updateObject) {
			helper.respond(null, 500, res, {'dev': 'No update object found'});
		}
		else {
			const result = await Controller.updateObj(req.params.id, req.body);
			helper.respond(result.err, result.response, res, result.validationResult);
		}
	});

	app.delete(base + '/:id', async (req, res) => {
		if (!req.params.id || !isValidObjId(req.params.id)) {
			helper.respond(null, 500, res, {'dev': '/' + req.params.id + '/' + ' is not a valid id'});
		} else if (!req.body.jwt) {
			helper.respond(null, 500, res, {'dev': 'No jwt found'});
		} else {
			const result = Controller.deleteObj(req.params.id, req.body.token);
			helper.respond(result.err, result.response, result.res);
		}
	});
};

//FIXME VALIDATOR PLUGIN CAN TEST THIS TOO
function isValidObjId(id) {
	try {
		return id === new objectId(id).toString()
	} catch (err) {
		return false;
	}
}



