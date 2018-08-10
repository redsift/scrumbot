/**
 * Simple Bot Sift. DAG's 'Slack' node implementation
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

  var promises = [];
  var botToken;
  var current = null;
  var results = [];
  //Extract Slack API token
  got.get.forEach(function(get) {
    if (get.bucket === 'credentials' && get.data[0] && get.data[0].key === 'slack/bot_access_token' && get.data[0].value) {
      botToken = get.data[0].value.toString();
    }
    if (get.bucket === 'currentSummary' && get.data[0] && get.data[0].key === 'current' && get.data[0].value) {
      current = JSON.parse(get.data[0].value.toString());
    }
    logger.debug("CURRENT SUMMARY ", current);
  });

  var summary = "*Current Standup Status*\n_brought to you by <https://redsift.com/?utm_source=scrum_bot&utm_medium=slack|Red Sift>_\n";
  // Append all report records to summary message
  for (var d of inData.data) {
    logger.debug('report.js: data: ', d);
    let report = d.value.toString();
    summary += `><@${d.key}>:\t ${d.value.toString()}\n`;
  }
  logger.debug("SENDING ", summary)
  // If there is a current report update it, otherwise post a new one.
  if (current) {
    logger.debug("UPDATING STATUS")
    results.push(slack.updateMessage(current.channel, current.ts, summary, null, botToken).then((res, rej) => {
      return ({
        name: "currentSummary",
        key: "current",
        value: res
      })
    }));
  } else {
    logger.debug("NEW STATUS")
    results.push(slack.postMessage("#general", summary, null, botToken).then((res, rej) => {
      logger.debug("POST RES", res)
      return ({
        name: "currentSummary",
        key: "current",
        value: res
      })
    }));
  }

  return results;
};
