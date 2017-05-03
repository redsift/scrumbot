/**
 * Simple Bot Sift. DAG's 'Slack' node implementation
 */

'use strict';

var slack = require('./slack.js');

// Entry point for DAG node
module.exports = function (got) {
  /* jshint camelcase: false */
  /* jshint -W069 */
  const inData = got['in'];

  var promises = [];
  var botToken;
  var reports = [];

  got.lookup.forEach(function (lookup) {
    if (lookup.bucket === 'credentials' && lookup.data && lookup.data.key === 'slack/bot_access_token' && lookup.data.value) {
      botToken = lookup.data.value.toString();
    }
  });

  var summary = "*Current Standup Status*\n";
  for (var d of inData.data) {
    console.log('report.js: data: ', d);
    let report = d.value.toString();
    summary += "<@" + d.key + ">"  + ":\t \t" + d.value.toString() + "\n";
    console.log("REPORT: ", report)
    }
  console.log("SENDING ", summary)
  reports.push(slack.postMessage("#general", summary, null, botToken));
  return reports;
};
