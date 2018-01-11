const mailDev = new require('maildev')();
module.exports = function () {
	mailDev.listen();
};