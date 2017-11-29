/**
 * Created by Jens on 17-Oct-16.
 */
const winston = require('winston');
const async = require('async');

const UserModel = require('../users/user/model');
const UserController = require('../users/user/controller');

let userController = new UserController();

function Populater() {
}

Populater.prototype.populate = function (cb) {
    UserModel.findOne().exec((err, user) => {
       if (!user){
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
        let admin = new UserModel({
            username: name,
            email: mail,
            password: pwd,
            dateTimePref: 'dd/mm/yyyy',
            accessFlag: 999,
            avatarUrl: 'tier1/avatar1.png'
        });
        admin.save(function(err){
            if(err){
                console.log(err);
            } else {
                winston.info('admin added');
            }
        });
    } catch (err) {
        winston.info('admin not added');
        handleError(err);
    }

}

function createUser(name, mail) {
    try {
        let user = {
            "username": name,
            "email": mail,
            "dateTimePref": "dd/mm/yyyy",
            "avatarUrl": "tier1/avatar1.png"
        };
        userController.registerUser(user, function (err, userRes) {
            if (err) {
                winston.info(name + ' not added');
                handleError(err);
            } else {
                winston.info(name + ' added');
            }
        })
    } catch (err) {
        winston.info(name + ' not added at error caught');
        handleError(err);
    }
}

function handleError(err) {
    winston.error('populater error');
    winston.error(err.message);
    // console.log(err);
}

module.exports = Populater;