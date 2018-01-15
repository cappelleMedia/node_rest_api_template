/**
 * Created by Jens on 27-Oct-16.
 */
"use strict";
const Email = require('email-templates');
const NodeMailer = require('nodemailer');
const winston = require('winston');
const path = require('path');

const config = require('../../config/index');
const templatesBaseDir = path.join(__dirname, 'templates');

// const defaultFrom = 'info@template.com';

class Mailer {
	constructor() {
		this.nodemailer = NodeMailer;
		this.smtpConfig = config.smtpConfig;
		this.transporter = this.nodemailer.createTransport(this.smtpConfig);
	}


	verifyConnection() {
		this.transporter.verify(function (error, success) {
			if (error || !success) {
				winston.error('Nodemailer not ready: ' + error)
			}
			else {
				winston.info('Nodemailer ready for messages');
			}
		});
	}

	async sendFromTemplate(type, mailOpt) {
			let extraOptions = {
				"send": true,
				"transport": this.transporter,
				"views": {
					"options": {
						"extension": "ejs"
					},
					"root": templatesBaseDir
				}

			},
			templateDir = this.getTemplateDir(type, mailOpt);

		if (templateDir) {
			let mailOptMerge = Object.assign(mailOpt, extraOptions, {template: templateDir});
			let template = new Email(mailOptMerge);
			template.send(mailOptMerge).then((info) => {
				return null;
			}).catch((e) => {
				return e;
			});
		} else {
			return new Error('no Template dir found');
		}
	}

	getTemplateDir(type, options) {
		switch (type) {
			case 'activation':
				if (this.checkRequiredFields(type, options)) {
					return 'activation';
				}
				return false;
			default:
				return 'template not found';
		}
	}

	checkRequiredFields(type, options) {
		switch (type) {
			case 'activation':
				return !!options.locals.activationUrl;
			default:
				return false;
		}
	}

}

module.exports = Mailer;