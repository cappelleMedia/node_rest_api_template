/**
 * Created by Jens on 15-Oct-16.
 */
const config = require('./config'),
	winston = require('winston'),
	Populater = require('./dev/populater'),
	ConnectionHandler = require('./util/helpers/connections'),
	connectionHandler = new ConnectionHandler();
let db, app;

const run = () => {
	app = connectionHandler.expressSetup();
	require('./routes')(app);
	const server = app.listen(3001, () => {
		winston.info('Server running at http://localhost:3001');
	});
	db = connectionHandler.mongoSetup();
	if (process.env.NODE_ENV !== 'production') {
		connectionHandler.mailSetup();
		Populater.prototype.populate();
	}
};

run();