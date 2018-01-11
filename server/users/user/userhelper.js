const pwdChecker = require('zxcvbn'),
	bcrypt = require('bcrypt-nodejs'),
	crypto = require('crypto'),
	masterValidator = require('validator'),
	config = require('../../config'),
	chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
	validationConfig = config.validationConfig;

class UserHelper {

	constructor() {
	}

	getPasswordValidators() {
		return [
			{
				validator: this.isValidPassword,
				msg: 'Password is not strong enough'
			}
		];
	}

	getUsernameValidators() {
		return [
			{
				validator: this.usernameLengthValidator,
				msg: 'Username length should be between ' + validationConfig.usernameMinLength + ' and ' + validationConfig.usernameMaxLength
			},
			{
				validator: this.isUsernameAllowed,
				msg: 'This username is reserved'
			}
		];
	}

	getEmailValidators() {
		return [
			{
				validator: this.isEmailValidator,
				msg: 'This is not a valid email address'
			}
		];
	}

	getDateTimeValidators() {
		return [
			{
				validator: this.isValidDateFormat,
				msg: 'This is not a valid date format'
			}
		];
	}

	//PASSWORD VALIDATION RULES
	isValidPassword(password) {
		return (pwdChecker(password).score >= 3);
	}

	//USERNAME VALIDATION RULES
	usernameLengthValidator(username) {
		return masterValidator.isLength(username, {
			min: validationConfig.usernameMinLength,
			max: validationConfig.usernameMaxLength
		});
	}

	isUsernameAllowed(username) {
		return !masterValidator.isIn(username, validationConfig.reservedUsernames);
	}

	//EMAIL VALIDATORS
	isEmailValidator(email) {
		return masterValidator.isEmail(email);
	}

	//DATE VALIDATORS
	isValidDateFormat(dateFormat) {
		return masterValidator.isIn(dateFormat, validationConfig.dateTimePrefs);
	}

	encryptPwd(password) {
		const pwdEnc = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		return pwdEnc;
	}

	generateRegKey(length) {
		const bytes = crypto.randomBytes(length);
		let result = new Array(length);
		for (let i = 0, j = length; i < j; i++)
			result[i] = chars[bytes[i] % chars.length];
		return result.join('');
	}
}

module.exports = UserHelper;