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
  // let reports = [];
  // let outgoingMessage = null;
  // var initialMsg = "Hello, I\'m <@scrumbot>, please send me stand-up reports on my private channel when I ask for them. \n You can also ask me for `status` and `help`.";
  // Extract the Slack API token
  console.log("InData ", inData);
  // console.log("LOOKUP ", got['lookup'])



  // inData.data.forEach(function(d) {
  //   console.log("IND ", d);
  //   if (d.key == 'settings' && d.value) {
  //     settings = JSON.parse(d.value);
  //   }
  // });

  // // Initialize settings if not found.
  // if (settings) {
  //   console.log(clc.magenta("SETTINGS"), settings);
  // } else {
  //Setting defaults
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
