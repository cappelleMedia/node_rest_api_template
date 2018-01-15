const Controller = require('./controller'),
	helper = require('../../util/helpers/routerHelper');

module.exports = function (app, base) {
	const controller = new Controller();

	//BASE ROUTE OVERRIDES AND ADDONS
	app.post(base, async (req, res) => {
		const result = await controller.registerUser(req.body);
		helper.respond(result.err, result.response, res, result.errors);
	});

	app.put(base + '/activate', async (req, res) => {
		const result = await controller.activate(req.body);
		helper.respond(result.err, result.response, res, result.errors);
	});

	app.get(base + '/username/:username', async (req, res) => {
		const result = await controller.getUserByName(req.params.username);
		helper.respond(result.err, result.response, res);
	});

	app.get(base + '/email/:email', async (req, res) => {
		const result = await controller.getUserByEmail(req.params.email);
		helper.respond(result.err, result.response, res);
	});

	app.post(base + '/authenticate', async (req, res) => {
		const result = await controller.authenticate(req.body.identifier, req.body.pwd);
			helper.respond(result.err, result.response, res);

	});

	app.post(base + '/verifyAdmin', async (req, res) => {
		const result = await controller.verifyAdmin(req.body.token);
		helper.respond(result.err, result.response, res);
	});

	//TODO passwordReset (mail)

	//BASE ROUTES
	require('../../util/bases/baserouter')(app, base, controller);


	//FIXME THIS IS FOR TESTING ONLY, BEWARE
	app.get(base + '/dev/adminToken', async (req, res) => {
		const result = await controller.getAdminToken();
		helper.respond(result.err, result.response, res);
	});
};
