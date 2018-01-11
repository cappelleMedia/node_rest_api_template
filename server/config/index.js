const _ = require('lodash'),
	envFile = process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
	configEnv = require('./config.' + envFile + '.json'),
	configGen = require('./config.gen.json'),
	config = _.merge(configEnv, configGen);

module.exports = config;