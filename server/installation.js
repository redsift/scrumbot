'use strict';

var slack = require('./slack.js');
var clc = require('cli-color');
var moment = require('moment-timezone');
const logger = require('simple-console-logger');
logger.configure({level: process.env.LOGLEVEL || 'info'});

// Entry point for DAG node
module.exports = function(got) {
  const inData = got['in'];
  var results = [];
  let settings = null;

  logger.debug("InData ", inData);
  logger.debug(clc.red("INIT SETTINGS"))
  settings = {
    tz: "US/Eastern",
    startOfDay: "9",
    meetingCall: "11"
  };
  results.push({
    name: "settings",
    key: "settings",
    value: settings
  });
  results.push({
    name: "settingsExport",
    key: "settings",
    value: settings
  });
  return results;
};
