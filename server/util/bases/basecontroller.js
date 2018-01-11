const Authenticator = require('../../users/user/authenticator');

class BaseController {
	constructor(model) {
		this.model = model;
	}

	async addObj(data) {
		let result = {
			validationErrors: "",
			err: null,
			response: null
		};
		try {
			let newObj = new this.model(data);
			await newObj.save();
			result.response = newObj;
		} catch (error) {
			result.err = error;
			result.response = 400;
			if (error.name === 'ValidationError') {
				result.validationErrors = this.handleValidationErrors(error);
			}
		}
		return result;
	}

	async getAll(limit, skip) {

		let result = {
			err: null,
			response: 404
		};
		try {
			const queryResult = await this.model
				.find()
				.skip(skip)
				.limit(limit)
				.exec();

			if (queryResult && queryResult.length) {
				result.response = queryResult;
			}
		} catch (error) {
			result.err = 500
		}
		return result;
	}

	async getOne(id) {
		let err = null,
			queryResult = null;
		try {
			queryResult = await this.model
				.findById(id)
				.exec();
		} catch (error) {
			err = error;
		}
		return BaseController.getResult(err, queryResult);
	}

	async updateObj(id, data) {
		const updated = data.updateObject;
		let result = {
			err: null,
			validationResult: null,
			response: null
		};
		try {
			result = await this.getOne(id);
			if (isNaN(result.response)) {
				Object.assign(result.response, updated);
				result = await this.addObj(result.response);
			}

		} catch (error) {
			result.err = error;
			if (error.name === "ValidationError") {
				result.validationResult = this.handleValidationErrors(error);
			}
		}
		return result;
	}

	async deleteObj(id, token) {
		let result = {
			err: null,
			response: 401
		};

		if (token) {
			const isVerified = await this.verifyAdmin(token);
			if (isVerified.respone === 'verified') {
				try {
					const toDelete = await this.model
						.findByIdAndRemove(id)
						.exec();
					if (toDelete) {
						result.response = toDelete;
					}
				} catch (error) {
					result.err = error;
					result.response = 401;
				}
			}
		}
		return result;
	}

	handleValidationErrors(err) {
		console.log('should be overridden by subclass');
		console.log(err);
		//should be overridden by all subs
		// throw TypeError('not implemented, should be implemented by subclass');
	}

	async verifyAdmin(jwt) {
		return await Authenticator.verifyAdmin(jwt);
	}

	static getResult(err, value) {
		let result = {
			err: err,
			response: value ? value : 404
		};

		return result;
	}
}

module.exports = BaseController;