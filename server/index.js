/**
 * Created by Jens on 15-Oct-16.
 */
const config = require('./config');
const winston = require('winston');

const Populater = require('./dev/populater');
const ConnectionHandler = require('./connections');

let connectionHandler = new ConnectionHandler();
let db;
let app;

run();

function run() {
    app = connectionHandler.expressSetup();
    require('./routes')(app);
    let server = app.listen(3001, function () {
        winston.info('Server running at http://localhost:3001');
    });
    db = connectionHandler.mongoSetup();
    if (process.env.NODE_ENV !== 'production') {
        connectionHandler.mailSetup();
        Populater.prototype.populate();
    }
}

