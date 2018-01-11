/**
 * Created by Jens on 17-Nov-16.
 */
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const winston = require('winston');

const config = require('../../config/index');

class ConnectionHandler {
	constructor() {

	}

	mongoSetup() {
		let db;
		mongoose.Promise = global.Promise;
		mongoose.connect(config.mongo.uri, config.mongo.options);
		db = mongoose.connection;
		db.on('error', function () {
			winston.error('connection to mongodb failed');
		});
		db.once('open', function () {
			winston.info('Connected to mongodb on ' + config.mongo.uri + '!');
		});
		return db;
	}

	expressSetup() {
		let app = express();
		app.set('view engine', 'ejs');
		let http = require('http').Server(app);
		let io = require('socket.io')(http);

		app.use(cors({
			exposedHeaders: config.cors.exposedHeaders, origin: config.cors.origins.map(function (origin) {
				return new RegExp(origin);
			})
		}));

		app.use(express.static(path.join(__dirname, '../client')));

		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({
			extended: true
		}));
		return app;
	}

	mailSetup() {
		let mailListener = require('../../dev/mail/mailTesting')();
		winston.info('Mail dev server setup');
		return mailListener;
	}
}

module.exports = ConnectionHandler;