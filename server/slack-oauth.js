/**
 * Simple Bot Sift. DAG's 'Slack' node implementation
 */

'use strict';

var slack = require('./slack.js');
var moment = require('moment-timezone');
const logger = require('simple-console-logger');
logger.configure({level: process.env.LOGLEVEL || 'info'});

// Entry point for DAG node
module.exports = function(got) {
  const inData = got['in'];
  const getData = got['get'];
  let results = [];
  let botToken;
  let settings = null;

  inData.data.forEach(function(d) {
    logger.debug("IND ", d);
    if (d.key == 'slack/bot_access_token' && d.value) {
      botToken = d.value.toString();
      logger.debug("SLACK OAUTHED! ", botToken)
    } else {
      logger.debug("NO SLACK CRED!");
      return;
    }
  });
  // Extract the Slack API token
  logger.debug("GD ", getData)
  getData.forEach(function(d) {
    if (d.data[0] && d.data[0].key == 'settings' && d.data[0].value) {
      settings = JSON.parse(d.data[0].value);
    }
  });
  if (!settings) {
    logger.debug("NO SETTINGS!");
    return;
  }

  // Send out standup call message
  let initialMsg = "Hello, I\'m <@scrumbot>, please send me stand-up reports on my private channel when I ask for them. \n You can also ask me for `status` and `help`";
  let now = moment.tz(settings.tz);
  logger.debug("No one on team");
  let timezoneMessage = `\nYour current timezone is ${now.format('zz')}, your workday starts at ${settings.startOfDay} o'clock and I'll send out a meeting call at ${settings.meetingCall} o'clock.`;
  let settingsMsg = "\nYour administrator can change these settings on your <https://dashboard.redsift.cloud/dashboard|Red Sift dashboard>.";
  let outgoingMessage = initialMsg + timezoneMessage + settingsMsg;
  logger.debug("LOCAL TIME ", now.format('MMMM Do YYYY, h:mm:ss a zz'));
  try {
    results.push(slack.postMessage("#general", outgoingMessage, null, botToken).then(() => {
      return null;
    }));
  } catch (ex) {
    logger.error('meetingcall: Exception: ', ex);
  }

  return results;
};
