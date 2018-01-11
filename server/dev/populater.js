const winston = require('winston'),
	UserModel = require('../users/user/model'),
	UserController = require('../users/user/controller'),
	userController = new UserController();

function Populater() {
}

Populater.prototype.populate = function (cb) {
	UserModel.findOne().exec((err, user) => {
		if (!user) {
			populateUsers();
		}
	});
};

function populateUsers() {
	try {
		createAdmin('devAdmin', 'jens@codious.io', 'DevAdmin001*');
		createUser('jens_regular', 'jens@ips.be');
	} catch (err) {
		if (err) {
			handleError(err);
		}
	}
}

function createAdmin(name, mail, pwd) {
	try {
		const admin = new UserModel({
			username: name,
			email: mail,
			password: pwd,
			dateTimePref: 'dd/mm/yyyy',
			accessFlag: 999,
			avatarUrl: 'tier1/avatar1.png'
		});
		admin.save(function (err) {
			if (err) {
				winston.error(err);
			} else {
				winston.info('admin added');
			}
		});
	} catch (err) {
		winston.info('admin not added');
		handleError(err);
	}

}

async function createUser(name, mail) {
	try {
		const user = {
				"username": name,
				"email": mail,
				"dateTimePref": "dd/mm/yyyy",
				"avatarUrl": "tier1/avatar1.png"
			},
			result = await userController.registerUser(user);

		if (result.err) {
			winston.info(name + ' not added');
			handleError(result.err);
		} else {
			winston.info(name + ' added');
		}
	} catch (err) {
		winston.info(name + ' not added at error caught');
		handleError(err);
	}
}

function handleError(err) {
	winston.error('populater error');
	winston.error(err.message);
}

module.exports = Populater;