"use strict";
const async = require('async'),
	BaseController = require('../../util/bases/basecontroller'),
	Model = require('./model'),
	Mailer = require('../../util/mailing/mailer'),
	config = require('../../config/index'),
	Authenticator = require('./authenticator'),
	UserHelper = require('./UserHelper');


//TODO OVERRIDE UPDATE FUNCTION WITH JWT FOR VERIFICATION
class UserController extends BaseController {
	constructor(model = Model) {
		super(model);
		this.mailer = new Mailer();
	}

	async registerUser(data) {
		let mailOpts = {
				message: {
					from: 'info@template.be',
					to: 'jens@codious.io',
					subject: 'Template activation'
				},
				locals: {
					activationUrl: ''
				}
			},
			newUser,
			errRes = null;

		data.accessFlag = -999;
		newUser = new Model(data);
		try {
			await newUser.save();
			mailOpts.locals.activationUrl = config.basepaths.clientUrl + '/pre-activation/' + newUser._id + '/' + newUser.regKey;
			const mailResult = await this.mailer.sendFromTemplate('activation', mailOpts);

			if (mailResult) {
				errRes = mailResult;
			}

			return {
				err: errRes,
				response: newUser,
				errors: null
			}

		} catch (err) {
			errRes = err;
		}
		return {
			err: errRes,
			response: newUser,
			errors: this.handleValidationErrors(errRes)
		}
	}

	async activate(data) {
		let errors = {},
			err = null,
			status = 401;

		if (data._id && data.regKey && data.password && data.passwordRepeat) {
			try {
				let user = await this.model
					.findById(data._id)
					.select('+regKey')
					.exec();

				if (user) {
					if (user.accessFlag > 0 || user.regKey !== data.regKey) {
						errors = null;
					} else if (data.password !== data.passwordRepeat) {
						errors['dev'] = 'Password and password repeat did not match';
					} else {
						user.accessFlag = 1;
						user.password = data.password;
						status = user;
						await this.addObj(user);
					}
				}
			} catch (error) {
				console.log(error);
				err = error;
				status = 500;
			}
		} else {
			errors['dev'] = 'Request was missing important information';
			status = 400;
		}

		return {
			err: err,
			errors: errors,
			response: status
		};
	}

	async getUserByName(username, extraField) {
		let err, query, user;
		try {
			query = this.model
				.findOne({username: new RegExp('^' + username + '$', 'i')});

			if(extraField){
				query.select('+' + extraField);
			}

			user = await query.exec();
		} catch (error) {
			err = error;
		}
		return BaseController.getResult(err, user);
	}

	async getUserByEmail(email, extraField) {
		let err, query, user;
		try {
			query = this.model
				.findOne({email: new RegExp('^' + email + '$', 'i')});
			if(extraField){

			}
			user = await query.exec();
		} catch (error) {
			err = error;
		}
		return BaseController.getResult(err, user);
	}

	handleValidationErrors(err) {
		let errorsAll = {};
		if (err.errors.password) {
			errorsAll['password'] = err.errors.password.message;
		}
		if (err.errors.username) {
			errorsAll['username'] = err.errors.username.message;
		}
		if (err.errors.email) {
			errorsAll['email'] = err.errors.email.message;
		}
		if (err.errors.dateTimePref) {
			errorsAll['dateTimePref'] = err.errors.dateTimePref.message;
		}

		return errorsAll;
	}

	//SECURITY AND ACCOUNT
	async authenticate(identifier, pwd) {
		let user,
			result = 401,
			err = null;
		try {
			if (UserHelper.isEmailValidator(identifier)) {
				user = await this.getUserByEmail(identifier, 'password');
			} else {
				user = await this.getUserByName(identifier, 'password');
			}

			if (!user.err && isNaN(user.response)) {
				result = await Authenticator.authenticate(user.response, UserHelper.encryptPwd(pwd));
			} else {
				err = user.err;
				result = user.response;
			}
		} catch (error) {
			err = error;
		}
		return BaseController.getResult(err, result);
	}


	updateObj(id, type, updated, adminToken, callback) {
		const self = this;
		this.getOne(id, function (err, found) {
			if (!isNaN(found)) {
				callback(err, found);
			} else {
				Object.assign(found, updated);
				self.addObj(found, function (err, result) {
					let errors = null;
					if (err) {
						if (err.name === "ValidationError") {
							errors = self.handleValidationErrors(err);
						}
					}
					callback(err, result, errors);
				});
			}
		});
	}

	resetPassword() {
	}

	//FIXME THIS IS FOR TESTING ONLY, BEWARE
	async getAdminToken() {
		let result = {
			err: null,
			response: 401
		};

		try {
			const admin = await this.getUserByName('devAdmin');
			if (isNaN(admin)) {
				result = await Authenticator.getAdminToken(admin.response);
			}
		} catch (err) {
			result.err = err;
		}
		console.log('hello');
		return result;
	}
}

module.exports = UserController;
