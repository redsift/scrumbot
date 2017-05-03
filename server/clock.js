/**
 * Simple Bot Sift. DAG's 'Slack' node implementation
 */

'use strict';

var slack = require('./slack.js');

// Entry point for DAG node
module.exports = function(got) {
  /* jshint camelcase: false */
  /* jshint -W069 */
  const inData = got['in'];
  console.log("CLOCK: ", inData)
  var results = [];
  var botToken;

  got.lookup.forEach(function(lookup) {
    if (lookup.bucket === 'credentials' && lookup.data && lookup.data.key === 'slack/bot_access_token' && lookup.data.value) {
      botToken = lookup.data.value.toString();
    }
  });

  for (var d of inData.data) {
    console.log('clock.js: ', d);
    results.push({name: "reports", key: d.key, value: "No report yet"});
  }
  try {
    results.push(slack.postMessage("#general", 'Hello, time for the standup, what are you working on today?', null, botToken));
  } catch (ex) {
    console.error('clock.js: Error parsing value for: ', d.key);
    console.error('clock.js: Exception: ', ex);
  }
  return results;
};
