/**
 * Created by Jens on 12-Oct-16.
 */
"use strict"
const async = require('async');

const BaseController = require('../../util/bases/basecontroller');
const Model = require('./model');
const Mailer = require('../../util/mailing/mailer');
const config = require('../../config/index');


//TODO null and empty checks
//TODO OVERRIDE UPDATE FUNCTION WITH PW FOR VERIFICATION
class UserController extends BaseController {
	constructor(model = Model) {
		super(model);
		this.mailer = new Mailer();
	}

	registerUser(data, callback) {
		let self = this;
		async.waterfall([
			function (next) {
				let newUser = null;
				data.accessFlag = -999;
				newUser = new Model(data);
				newUser.save(function (err) {
					if (err) {
						next(err, 400);
					} else {
						next(null, newUser);
					}
				});
			},
			function (user, done) {
				let activationUrl = config.basepaths.clientUrl + '/pre-activation/' + user._id + '/' + user.regKey;
				let mailOpts = {
					message: {
						from: 'info@template.be',
						to: 'jens@codious.io',
						subject: 'Template activation'
					},
					locals: {
						activationUrl: activationUrl
					}
				};
				self.mailer.sendFromTemplate('activation', mailOpts, function (err) {
					done(err, user);
				});
			}

		], function (err, user) {
			let errors = null;
			if (err) {
				if (err.name === "ValidationError") {
					errors = self.handleValidationErrors(err);
				}
				Model.findByIdAndRemove(user._id).exec(function (err) {
				});
			}
			callback(err, user, errors);
		});
	}

	activate(data, callback) {
		let self = this;
		let errors = {};
		let status = 500;
		async.waterfall([
			function (next) {
				if (!data._id || !data.regKey || !data.password || !data.passwordRepeat) {
					errors['dev'] = 'Request was missing important information';
					status = 400;
					return next(status);
				} else {
					self.model
						.findById(data._id)
						.select('+regKey')
						.exec(function (err, obj) {
							next(err, obj);
						});
				}
			},
			function (user, next) {
				if (user.accessFlag > 0) {
					//Already activated
					status = 401;
					errors = null
					return next(status);
				}
				if ((user.regKey !== data.regKey)) {
					//hide the error here
					status = 401;
					errors = null;
					return next(status);
				}
				if (data.password !== data.passwordRepeat) {
					status = 400;
					errors['dev'] = 'Password and password repeat did not match';
					return next(status);
				}
				user.accessFlag = 1;
				user.password = data.password;
				next(null, user);
			},
			function (updatedUser, done) {
				self.updateObj(updatedUser._id, updatedUser, function (err, user, validationErrors) {
					errors = validationErrors;
					status = user.toTokenData();
					done(err)
				});
			}

		], function (err) {
			callback(err, status, errors);
		});
	}

	getUserByName(username, callback) {
		this.model
			.findOne({username: new RegExp('^' + username + '$', 'i')})
			.exec(function (err, user) {
				BaseController.getResult(err, user, callback);
			});
	}

	getUserByEmail(email, callback) {
		this.model
			.findOne({email: new RegExp('^' + email + '$', 'i')})
			.exec(function (err, user) {
				BaseController.getResult(err, user, callback);
			});
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
	authenticate(identifier, pwd, callback) {
		this.authenticator.authenticate(identifier, pwd, function (err, result) {
			BaseController.getResult(err, result, callback);
		});
	}

	//FIXME THIS IS FOR TESTING ONLY, BEWARE
	getAdminToken(callback) {
		let self = this;
		if (process.env.NODE_ENV !== 'production') {
			this.getUserByName('devAdmin', function (err, admin) {
				if (err || !isNaN(admin)) {
					BaseController.getResult(err, admin, callback);
				} else {
					self.authenticator.getAdminToken(admin, function (err, result) {
						BaseController.getResult(err, result, callback);
					});
				}
			});
		} else {
			return callback(null, 401);
		}
	}
}

module.exports = UserController;
