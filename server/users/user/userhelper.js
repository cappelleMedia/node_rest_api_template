/**
 * Created by Jens on 11-Oct-16.
 */
const pwdChecker = require('zxcvbn');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const masterValidator = require('validator');

const config = require('../../config');

let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
let validationConfig = config.validationConfig;

class UserHelper {

    constructor() {
    }

    getPasswordValidators() {
        let validators = [
            {
                validator: this.isValidPassword,
                msg: 'Password is not strong enough'
            }
        ];
        return validators;
    }

    getUsernameValidators() {
        let validators = [
            {
                validator: this.usernameLengthValidator,
                msg: 'Username length should be between ' + validationConfig.usernameMinLength + ' and ' + validationConfig.usernameMaxLength
            },
            {
                validator: this.isUsernameAllowed,
                msg: 'This username is reserved'
            }
        ];
        return validators;
    }

    getEmailValidators() {
        let validators = [
            {
                validator: this.isEmailValidator,
                msg: 'This is not a valid email address'
            }
        ];
        return validators;
    }

    getDateTimeValidators() {
        let validators = [
            {
                validator: this.isValidDateFormat,
                msg: 'This is not a valid date format'
            }
        ];
        return validators;
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
        let pwdEnc = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        return pwdEnc;
    }

    generateRegKey(length) {
        let bytes = crypto.randomBytes(length);
        let result = new Array(length);
        for (let i = 0, j = length; i < j; i++)
            result[i] = chars[bytes[i] % chars.length];
        return result.join('');
    }

}
module.exports = UserHelper;