/**
 * Simple Bot Sift. DAG's 'Slack' node implementation
 */

'use strict';

var slack = require('./slack.js');

// Entry point for DAG node
module.exports = function(got) {
  const inData = got['in'];
  var results = [];
  var botToken;
  // Extract the Slack API token
  got.lookup.forEach(function(lookup) {
    if (lookup.bucket === 'credentials' && lookup.data && lookup.data.key === 'slack/bot_access_token' && lookup.data.value) {
      botToken = lookup.data.value.toString();
    }
  });
  // Iterate over all report records and reset them.
  for (var d of inData.data) {
    console.log('clock.js: ', d);
    results.push({
      name: "reports",
      key: d.key,
      value: "No report yet"
    });
  }
  // Send out standup call message, and reset currentSummary
  try {
      results.push(slack.postMessage("#general", 'Hello, time for the standup, what are you working on today?', null, botToken).then((res,rej)=> {
        return({
          "name": "currentSummary",
          "key": "current",
          "value": null
        })
      }));
  } catch (ex) {
    console.error('clock.js: Exception: ', ex);
  }

  return results;
};
