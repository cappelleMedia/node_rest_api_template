/**
 * Created by Jens on 11-Oct-16.
 */
const mongoose = require('mongoose');
const uniqueValidation = require('mongoose-beautiful-unique-validation');

const config = require('../../config/index');
const UserHelp = require('./userhelper');

let userHelp = new UserHelp();

//MAIN
let UserSchema = new mongoose.Schema({
    __v: {
        type: Number
    },
    username: {
        type: String,
        required: true,
        index: true,
        unique: 'This username is already taken',
        validate: userHelp.getUsernameValidators()
    },
    email: {
        type: String,
        required: true,
        index: true,
        lowercase: true,
        unique: 'This email is already in use',
        validate: userHelp.getEmailValidators()
    },
    password: {
        type: String,
        required: true,
        select: false,
        default: userHelp.generateRegKey(64),
        validate: userHelp.getPasswordValidators()
    },
    regKey: {
        type: String,
        required: true,
        select: false,
        min: 64,
        max: 64,
        default: userHelp.generateRegKey(64)
    },
    dateTimePref: {
        type: String,
        required: true,
        validate: userHelp.getDateTimeValidators()
    },
    creation: {
        type: Date,
        required: true,
        default: Date.now()
    },
    lastLogin: {
        type: Date,
        required: true,
        default: Date.now()
    },
    activeTime: {
        type: Number,
        min: 0,
        default: 0
    },
    accessFlag: {
        type: Number,
        required: true,
        default: -999
    },
    avatarUrl: {
        type: String,
        required: true
    },
    warnings: {
        type: Number,
        min: 0,
        default: 0
    }

}, {autoIndex: config.mongo.autoIndex, id: false, read: 'secondaryPreferred'});

UserSchema.plugin(uniqueValidation);

//METHODS
UserSchema.methods.toTokenData = function () {
    var tokenData = {
        _id: this._id,
        username: this.username,
        email: this.email,
        avatarUrl: this.avatarUrl,
        dateTimePref: this.dateTimePref,
        accessFlag: this.accessFlag
    };
    return tokenData;
};

// PRE'S
UserSchema.post('validate', function () {
    if (this.isModified('password')) {
        this.password = userHelp.encryptPwd(this.password);
    }
    this.regKey = userHelp.generateRegKey(64);
});

//EXPORTS
module.exports = mongoose.model('User', UserSchema);

module.exports.Schema = UserSchema;