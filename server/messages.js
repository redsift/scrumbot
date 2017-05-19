/**
 * Simple Scumbot Sift. DAG's 'Slack' node implementation
 */

'use strict';

var slack = require('./slack.js');

// Entry point for DAG node
module.exports = function(got) {
  /* jshint camelcase: false */
  /* jshint -W069 */
  const inData = got['in'];

  var botToken;
  var results = [];
  var currentSummary;


  got.lookup.forEach(function(lookup) {
    //Extract the slack api token
    if (lookup.bucket === 'credentials' && lookup.data && lookup.data.key === 'slack/bot_access_token' && lookup.data.value) {
      botToken = lookup.data.value.toString();
    }
    if (lookup.bucket === 'currentSummary' && lookup.data && lookup.data.key === 'current' && lookup.data.value) {
      currentSummary = JSON.parse(lookup.data.value.toString()).message.text;
      console.log("CS", currentSummary)
    }
  });

  for (var d of inData.data) {
    console.log('MESSAGES: data: ', d.value.toString());
    if (d.value) {
      try {
        //Ignore deleted messages and bot messages.
        var msg = JSON.parse(d.value);
        if (msg.subtype === 'message_deleted' || msg.subtype === "bot_message") {
          console.log("DROPPING msg of subtype ", msg.subtype)
          continue;
        }
        // Ignore update messages
        if (msg.message) {
          continue
        }
        console.log("VALID MSG: ", msg)
        //var session_id = msg.channel + '-' + msg.user + '-' + Date.now();
        // remove <@..> direct mention
        msg.text = msg.text.replace(/(^<@.*>\s+)/i, '');

        //Only accept messages from my private channel
        if (msg.channel.substring(0, 1) != 'D') {
          continue;
        }
        if (msg.text == "status") {
          results.push(slack.postMessage(`<@${msg.user}>`, currentSummary, null, botToken).then(() => null)); // no result
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
        console.error('MESSAGES: Error parsing value for: ', d.key);
        console.error('MESSAGES: Exception: ', ex);
        continue;
      }
    }
  }
  return Promise.all(results);
};
