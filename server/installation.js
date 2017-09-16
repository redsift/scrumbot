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
      console.log("INSTALLED! ", botToken)
    }
  });

  // Send out standup call message
  var installMsg = "Hello, I\'m <@scrumbot>, please send me stand-up reports on my private channel when I ask for them. \n You can also ask me for `status` and `help`";

  try {
      results.push(slack.postMessage("#general", installMsg, null, botToken).then(()=>{
        return null;
      }));
  } catch (ex) {
    console.error('meetingcall: Exception: ', ex);
  }
  //Setting defaults
  results.push({
    name: "settings",
    key: "settings",
    value: {
      tz: "US/Eastern",
      startOfDay: "9",
      meetingCall: "11"
    }
  });
  results.push({
    name: "settingsExport",
    key: "settings",
    value: {
      tz: "US/Eastern",
      startOfDay: "9",
      meetingCall: "11"
    }
  })

  return results;
};
