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
  logger.debug("SETTINGS ", inData)
  inData.data.forEach(function(d) {
    // if(d.key == 'slack/bot_access_token') {
    //   botToken = d.value.toString();
    //   logger.debug("INSTALLED! ", botToken)
    // }
    if(d.key == 'settings') {
      let formData = decodeURIComponent(d.value);
      logger.debug("INSTALLED! ", formData)
      results.push({
        name: "settings",
        key: "settings",
        value: formData
      });
      results.push({
        name: "settingsExport",
        key: "settings",
        value: formData
      });
    }

  });
  return results;
}
