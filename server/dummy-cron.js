'use strict';

const logger = require('simple-console-logger');
logger.configure({level: process.env.LOGLEVEL || 'info'});

// Entry point for DAG node
module.exports = function(got) {
}
