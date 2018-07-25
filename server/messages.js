/**
 * Simple Scumbot Sift. DAG's 'Slack' node implementation
 */

'use strict';

var slack = require('./slack.js');
const logger = require('simple-console-logger');
logger.configure({level: process.env.LOGLEVEL || 'info'});

// Entry point for DAG node
module.exports = function(got) {
  /* jshint camelcase: false */
  /* jshint -W069 */
  const inData = got['in'];

  var botToken;
  var results = [];
  var currentSummary;
  var throttleUser;
  var helpText = `Send all messages to scrumbot on it's private channel.\n
  Any text sent to scrumbot will be taken as your standup report except the commands
  \`status\` which prints out the current report summary and \`help\` which prints this message.
  Please report any problems or bugs to team@redsift.com`

  var outOfChannelText = `Please help keep the general channel clear by only talking to me on my private channel`
  got.lookup.forEach(function(lookup) {
    //Extract the slack api token
    if (lookup.bucket === 'credentials' && lookup.data && lookup.data.key === 'slack/bot_access_token' && lookup.data.value) {
      botToken = lookup.data.value.toString();
      return;
    }
    // Check to make sure that we haven't throtled the response because of duelling bots.
    if (lookup.bucket === 'throttle' && lookup.data && lookup.data.key === 'throttle' ) {
      throttleUser = lookup.data.value;
      return;
    }
    // Do we have a 'current' summary
    if (lookup.bucket === 'currentSummary' && lookup.data && lookup.data.key === 'current' && lookup.data.value) {
      try {
        currentSummary = JSON.parse(lookup.data.value.toString()).message.text;
      } catch (ex) {
        currentSummary = "No reports yet";
      }
      return;
    } else {
      currentSummary = "No reports yet!";
      return;
    }

  });

  for (var d of inData.data) {
    //logger.debug('MESSAGES: data: ', d.value.toString());
    if (d.value) {
      try {
        //Ignore deleted messages and bot messages.
        var msg = JSON.parse(d.value);
        if (msg.subtype === 'message_deleted' || msg.subtype === "bot_message") {
          logger.debug("DROPPING msg of subtype ", msg.subtype)
          continue;
        }
        // Ignore update messages
        if (msg.message) {
          continue
        }
        logger.debug("VALID MSG: ", msg)
        //var session_id = msg.channel + '-' + msg.user + '-' + Date.now();
        // remove <@..> direct mention
        msg.text = msg.text.replace(/(^<@.*>\s+)/i, '');

        //Only accept messages from my private channel
        if (msg.channel.substring(0, 1) != 'D') {
          if (throttleUser !== msg.user) {
            results.push(slack.postMessage(`<@${msg.user}>`, outOfChannelText, null, botToken).then(() => ({
              name: "throttle",
              key: "throttle",
              value: msg.user
            })));
          }
          continue;
        }
        if (msg.text.toLowerCase() == "status") {
          results.push(slack.postMessage(`<@${msg.user}>`, currentSummary, null, botToken).then(() => null)); // no result
        } else if (msg.text.toLowerCase() == "help") {
          results.push(slack.postMessage(`<@${msg.user}>`, helpText, null, botToken).then(() => null));
        } else {
          // Thank the user and add the report to the list of reports.
          results.push(slack.postMessage(`<@${msg.user}>`, 'Thanks for the report ' + "<@" + msg.user + ">", null, botToken)
            .then(() => ({
              name: "reports",
              key: msg.user,
              value: msg.text
            })));
        }


      } catch (ex) {
        logger.error('MESSAGES: Error parsing value for: ', d.key);
        logger.error('MESSAGES: Exception: ', ex);
        continue;
      }
    }
  }
  return Promise.all(results);
};
