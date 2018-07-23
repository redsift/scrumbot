/**
 * Simple Bot Sift. DAG's 'Slack' node implementation
 */

'use strict';

var slack = require('./slack.js');
const logger = require('simple-console-logger');
logger.configure({level: process.env.LOGLEVEL || 'info'});

// Entry point for DAG node
module.exports = function(got) {
  const inData = got['in'];
  var results = [];
  var botToken;
  // Extract the Slack API token
  logger.debug("IDD ", inData)
  inData.data.forEach(function(d) {
    if(d.key == 'slack/bot_access_token') {
      botToken = d.value.toString();
      logger.debug("BT ", botToken)
    }
  });

  // Send out standup call message
  var wakeup = 'Hello, time for the standup, what are you working on today?';

  try {
      results.push(slack.postMessage("#general", wakeup, null, botToken).then(()=>{
        return null;
      }));
  } catch (ex) {
    logger.error('meetingcall: Exception: ', ex);
  }

  return results;
};
