/**
 * Created by Jens on 04-Nov-16.
 */
module.exports = function (app) {
	app.get('/api', function (req, res) {
		//TODO supply documentation with json
		res.json({
			"info": "The root for the template api"
		});
	});
	app.get('/assets', function (req, res) {
		//TODO supply documentation with json
		res.json({
			"info": "The root for template assets"
		});
	});
	app.get('*', function (req, res) {
		res.redirect('/api');
	});
};