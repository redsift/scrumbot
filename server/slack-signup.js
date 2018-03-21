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
  ret.push({name: 'slack_info', key: 'slack-signed-up', value: rpcValue });
  return ret;
};
