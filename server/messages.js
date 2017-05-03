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
      console.log("BOT TOK ", botToken)
    }
  });

  for (var d of inData.data) {
    console.log('slackbot.js: data: ', d);
    if (d.value) {
      try {
        var msg = JSON.parse(d.value);
        if (msg.subtype === 'message_deleted' || msg.subtype == "bot_message") {
          console.log("DROPPING msg of subtype ", msg.subtype)
          continue;
        }

        console.log('PROCESS MSG: ', msg);

        var session_id = msg.channel + '-' + msg.user + '-' + Date.now();

        // remove <@..> direct mention
        msg.text = msg.text.replace(/(^<@.*>\s+)/i, '');
        console.log("AFTER EDIT ", msg.text)
        reports.push(slack.postMessage(`<@${msg.user}>`, 'Thanks for the report' + "<@"+msg.user+">", null, botToken));

        reports.push({name: "reports", key: msg.user, value: msg.text})

      } catch (ex) {
        console.error('slackbot.js: Error parsing value for: ', d.key);
        console.error('slackbot.js: Exception: ', ex);
        continue;
      }
    }
  }
  return reports;
};
