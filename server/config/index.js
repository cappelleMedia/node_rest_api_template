/**
 * Created by Jens on 11-Oct-16.
 */
const _ = require('lodash');

const envFile = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';

const configEnv = require('./config.' + envFile + '.json');
const configGen = require('./config.gen.json');

const config = _.merge(configEnv, configGen);

module.exports = config;