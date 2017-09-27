'use strict';

var slack = require('./slack.js');

// Entry point for DAG node
module.exports = function(got) {
  const inData = got['in'];
  var results = [];
  var botToken;
  // Extract the Slack API token
  console.log("SETTINGS ", inData)
  inData.data.forEach(function(d) {
    // if(d.key == 'slack/bot_access_token') {
    //   botToken = d.value.toString();
    //   console.log("INSTALLED! ", botToken)
    // }
    if(d.key == 'settings') {
      let formData = decodeURIComponent(d.value);
      console.log("INSTALLED! ", formData)
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
