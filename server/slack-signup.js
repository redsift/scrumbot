/**
 * Slack Signed Up Node:
 * Triggered when Slack credentials are received on sign up
 */
'use strict';

const logger = require('simple-console-logger');
logger.configure({level: process.env.LOGLEVEL || 'info'});

module.exports = function (got) {
  logger.debug('slack-signup: running...');
  let rpcValue = {};
  const inData = got['in'];
  let ret = [];
  inData.data.map(datum => {
    if(datum.key === 'slack/team_name') {
      rpcValue.team_name = datum.value.toString();
      // ret.push({ name: 'intent', key: 'intent/_', value: { type: 'event', method: 'slackSignedUp' } });
    }
  });
  ret.push({name: 'slack_info', key: 'slack-signed-up', value: rpcValue });
  return ret;
};
