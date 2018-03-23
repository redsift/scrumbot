/**
 * Slack Signed Up Node:
 * Triggered when Slack credentials are received on sign up
 */
'use strict';

module.exports = function (got) {
  console.log('slack-signup: running...');
  let rpcValue = {};
  const inData = got['in'];
  let ret = [];
  inData.data.map(datum => {
    if(datum.key === 'slack/team_name') {
      rpcValue.team_name = datum.value.toString();
    }
  });  
  ret.push({name: 'slack_info', key: 'slack-signed-up', value: rpcValue });
  return ret;
};
