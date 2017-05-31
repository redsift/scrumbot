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
  console.log("IDD ", inData)
  inData.data.forEach(function(d) {
    if(d.key == 'slack/bot_access_token') {
      botToken = d.value.toString();
      console.log("BT ", botToken)
    }
  });

  // Send out standup call message
  var wakeup = 'Hello, time for the standup, what are you working on today?';

  try {
      results.push(slack.postMessage("#general", wakeup, null, botToken).then(()=>{
        return null;
      }));
  } catch (ex) {
    console.error('meetingcall: Exception: ', ex);
  }

  return results;
};
