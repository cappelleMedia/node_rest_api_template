/**
 * Created by Jens on 18-Nov-16.
 */
const jwt = require('jsonwebtoken');

const Model = require('./model');
const config = require('../../config');
const jwtConfig = config.jwt.auth;
class Authenticator {
    constructor() {
        //should never be called
    }

    //TODO THIS IS FOR TESTING ONLY, BEWARE
    static getAdminToken(admin, callback) {
        console.log(admin.toTokenData());
        if (process.env.NODE_ENV !== 'production') {
            jwt.sign(admin.toTokenData(), jwtConfig.secret, {issuer: jwtConfig.issuer}, function (err, token) {
                return callback(err, token);
            });
        } else {
            return callback(null, 401);
        }
    }

    static authenticate(identifier, pwd, callback) {
        //TODO IMPLEMENT
        return callback(null, 501);
    }

    static verifyAdmin(token, callback) {
        jwt.verify(token, jwtConfig.secret, {issuer: jwtConfig.issuer}, function (err, data) {
            if (err || !data) {
                return callback(err, 401);
            } else {
                if (data.accessFlag > 990) {
                    return callback(null, "verified");
                } else {
                    return callback(err, 401);
                }
            }
        });
    }
}

module.exports = Authenticator;