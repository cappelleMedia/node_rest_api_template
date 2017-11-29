/**
 * Created by Jens on 27-Oct-16.
 */
const MailDev = require('maildev');
let mailDev = new MailDev();
module.exports = function () {
    mailDev.listen();
};