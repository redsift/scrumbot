'use strict';

var slack = require('./slack.js');

// function _processSettingsObj(obj, lookups) {
//   let settings = lookup(lookups, 'settings', 'settings');
//   settings = Object.assign({}, settings, obj);
//   let res = [{name: 'settings', key: 'settings', value: settings}];
//
//   for (let key in settings) {
//     // Stringify all values, even strings; makes parsing settings fields easier on the frontend.
//     res.push({name: 'frontendSettings', key: key, value: JSON.stringify(obj[key])});
//   }
//   return res;
// }

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
