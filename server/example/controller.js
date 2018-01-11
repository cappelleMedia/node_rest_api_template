"use strict";
const BaseController = require('../util/bases/basecontroller'),
	Model = require('./model');

class ExampleController extends BaseController {
	constructor(model = Model) {
		super(model);
	}
}

module.exports = ExampleController;
