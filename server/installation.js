'use strict';

var slack = require('./slack.js');
var clc = require('cli-color');
var moment = require('moment-timezone');

// Entry point for DAG node
module.exports = function(got) {
  const inData = got['in'];
  // const lookupData = got['lookup'];
  var results = [];
  // var botToken;
  let settings = null;

  console.log("InData ", inData);
  console.log(clc.red("INIT SETTINGS"))
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
