'use strict';

var slack = require('./slack.js');
var clc = require('cli-color');
var moment = require('moment-timezone');
const logger = require('simple-console-logger');
logger.configure({level: process.env.LOGLEVEL || 'info'});

// Entry point for DAG node
module.exports = function(got) {
  const inData = got['in'];
  const lookupData = got['lookup'];
  var results = [];
  var botToken;
  let settings = null;
  let reports = [];
  let outgoingMessage = null;
  var initialMsg = "Hello, I\'m <@scrumbot>, please send me stand-up reports on my private channel when I ask for them. \n You can also ask me for `status` and `help`.";
  // Extract the Slack API token
  logger.debug("InData ", inData);
  logger.debug("LOOKUP ", got['lookup'])



  inData.data.forEach(function(d) {
    logger.debug('IN ITEM', d);
    reports.push({
      name: "reports",
      key: d.key,
      value: d.value.toString()
    });
  });

  lookupData.forEach(function(d) {
    //Get settings and slack token.
    logger.debug('LK ITEM', d.data);
    if (d.data.key == 'settings' && d.data.value) {
      settings = JSON.parse(d.data.value);
    }
    if(settings == null) {
      settings = {
        tz: "US/Eastern",
        startOfDay: "9",
        meetingCall: "11"
      };
    }

    if (d.data.key == 'slack/bot_access_token' && d.data.value) {
      botToken = d.data.value.toString();
      logger.debug("BT ", botToken)
    }
  });


  var now = moment.tz(settings.tz);
  logger.debug("LOCAL TIME ", now.format('MMMM Do YYYY, h:mm:ss a zz'));
  //Is it the weekend?
  if (now.day() > 0 && now.day() < 6) {
    logger.debug("Its a workday")
    //Is it start of Day?
    if (now.hour() == parseInt(settings.startOfDay)) {
      // Do we have anyone on the team?
      if (reports.length > 0) {
        logger.debug("Resetting Reports");
        //Reset reports
        // Iterate over all report records and reset them.
        for (var d of reports) {
          logger.debug('RESETTING: ', d);
          results.push({
            name: "reports",
            key: d.key,
            value: "No report yet"
          });
        }
        // Reset current summary
        results.push({
          "name": "currentSummary",
          "key": "current",
          "value": null
        });
      } else {
        //No one joined team yet, send out hello message
        logger.debug("No one on team");
        let timezoneMessage = `\nYour current timezone is ${now.format('zz')}, your workday starts at ${settings.startOfDay} o'clock and I'll send out a meeting call at ${settings.meetingCall} o'clock.`;
        let settingsMsg = "\nYour administrator can change these settings on your <https://dashboard.redsift.cloud/dashboard|Red Sift dashboard>.";
        outgoingMessage = initialMsg + timezoneMessage + settingsMsg;
      }
    }
    if (now.hour() == parseInt(settings.meetingCall)) {
      logger.debug("SEND OUT MEETING CALL");
      outgoingMessage = 'Hello, time for the standup, what are you working on today?';
    }
  } else {
    logger.debug("YOU CAN SLEEP IN")
  }

  // Send out message(s)
  // var wakeup = 'Hello, time for the standup, what are you working on today?';
  //
  if (outgoingMessage) {
    try {
      results.push(slack.postMessage("#general", outgoingMessage, null, botToken).then(() => {
        return null;
      }));
    } catch (ex) {
      logger.error('meetingcall: Exception: ', ex);
    }
    finally {
      return results;
    }
  } else {
    return results;
  }


};
