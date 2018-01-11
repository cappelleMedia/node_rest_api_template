const mongoose = require('mongoose'),
	uniqueValidation = require('mongoose-beautiful-unique-validation'),
	config = require('../config/index');

//MAIN
const ExampleSchema = new mongoose.Schema({
	__v: {
		type: Number
	},
	stringField: {
		type: String,
		required: true,
		index: true
	},
	numberField: {
		type: Number,
		default: 0
	}

}, {autoIndex: config.mongo.autoIndex, id: false, read: 'secondaryPreferred'});

ExampleSchema.plugin(uniqueValidation);

//EXPORTS
module.exports = mongoose.model('Example', ExampleSchema);

module.exports.Schema = ExampleSchema;