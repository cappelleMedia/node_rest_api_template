/**
 * Created by Jens on 19-Oct-16.
 */
const Authenticator = require('../../users/user/authenticator');

class BaseController {
    constructor(model) {
        this.model = model;
        //FIXME too much to create an authenticator for each controller?
        this.authenticator = Authenticator;
    }

    addObj(data, callback) {
        let self = this;
        let validationErrors = "";
        let newObj = null;
        newObj = new this.model(data);
        newObj.save(function (err) {
            if (err) {
                if (err.name === 'ValidationError') {
                    validationErrors = self.handleValidationErrors(err);
                }
                return callback(err, 400, validationErrors);
            }
            callback(err, newObj, null);
        });
    }

    getAll(limit, skip, callback) {
        this.model
            .find()
            .skip(skip)
            .limit(limit)
            .exec(function (err, objects) {
                if (err) {
                    callback(err, 500);
                } else {
                    if (!objects || !objects.length) {
                        callback(err, 404);
                    } else {
                        callback(err, objects);
                    }
                }
            });
    }

    getOne(id, callback) {
        this.model
            .findById(id)
            .exec(function (err, obj) {
                BaseController.getResult(err, obj, callback);
            });
    }

    //TODO VERIFY ADMIN BEFORE UPDATE
    updateObj(id, updated, callback) {
        let self = this;
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

    deleteObj(id, token, callback) {
        let self = this;
        if (token) {
            this.authenticator.verifyAdmin(token, function (err, valid) {
                if (valid === "verified") {
                    self.model
                        .findByIdAndRemove(id)
                        .exec(function (err, obj) {
                            if (!obj) {
                                obj = 404;
                            }
                            callback(err, obj);
                        });
                } else {
                    callback(401, 401);
                }
            })
        } else {
            callback(401, 401);
        }

    }

    handleValidationErrors(err) {
        console.log('should be overridden by subclass');
        console.log(err);
        //should be overridden by all subs
        // throw TypeError('not implemented, should be implemented by subclass');
    }

    verifyAdmin(jwt, callback) {
        this.authenticator.verifyAdmin(jwt, function (err, result) {
            BaseController.getResult(err, result, callback);
        })
    }

    static getResult(err, value, callback) {
        if (!value) {
            callback(err, 404);
        } else {
            callback(err, value);
        }
    }
}

module.exports = BaseController;