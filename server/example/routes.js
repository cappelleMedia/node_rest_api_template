const Controller = require('./controller');

module.exports = function (app, base) {
	const controller = new Controller();

	//BASE ROUTE OVERRIDES AND ADD-ONS

	//BASE ROUTES
	require('../util/bases/baserouter')(app, base, controller);

};
