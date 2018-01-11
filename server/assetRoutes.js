/**
 * Created by Jens on 31-Oct-16.
 */
const pathHelper = require('path'),
	winston = require('winston'),
	base = '/assets/',
	baseDir = pathHelper.join(__dirname, base);

module.exports = function (app) {
	app.get(base + 'images/:name', function (req, res) {
		const baseExtend = baseDir + 'images/design/',
			options = {
			root: baseExtend,
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		},
			filename = req.params.name;
		res.sendFile(filename, options, function (err) {
			if (err) {
				winston.error(err);
				res.sendStatus(404);
			} else {
				winston.info(filename + ' send successfully');
			}
		});
	});
};
