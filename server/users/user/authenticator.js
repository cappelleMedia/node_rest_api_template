const jwt = require('jsonwebtoken'),
	winston = require('winston'),
	config = require('../../config'),
	jwtConfig = config.jwt.auth;

class Authenticator {
	constructor() {
		//should never be called
	}

	//TODO THIS IS FOR TESTING ONLY, BEWARE
	static async getAdminToken(admin) {
		// console.log(admin.toTokenData());
		winston.info('Admin tokenData generated');
		let result = {
			err: null,
			response: 401
		};
		try {
			result.response = jwt.sign(admin.toTokenData(), jwtConfig.secret, {issuer: jwtConfig.issuer});
		} catch (err) {
			result.err = err;
		}
		return result;
	}

	static authenticate(user, pwd) {
		let result = {
			err: null,
			response: 401
		};

		if (user.password === pwd) {
			try {
				result.response = jwt.sign(user.toTokenData(), jwtConfig.secret, {issuer: jwtConfig.issuer})
			} catch (err) {
				result.err = err;
			}
		}
		return result;
	}

	static async verifyAdmin(token) {
		let jwtResult = null,
			result = {
				err: null,
				response: null
			};
		try {
			jwtResult = await jwt.verify(token, jwtConfig.secret, {issuer: jwtConfig.issuer});
		} catch (error) {
			result.err = error;
		}
		if (result.err || !jwtResult || jwtResult.accessFlag <= config.validationConfig.adminMinAccessFlag) {
			result.response = 401;
		} else {
			result.response = "verified";
		}
		return result;
	}
}

module.exports = Authenticator;