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

  logger.debug('slack-signup: inData:', JSON.stringify(inData, null, 4));

  inData.data.map(datum => {
    if(datum.key === 'slack/team_name') {
      rpcValue.team_name = datum.value.toString();
    }
  });  
  ret.push({name: 'slack_info', key: 'slack-signed-up', value: rpcValue });

  logger.debug('slack-signup: ret:', JSON.stringify(ret, null, 4));
  
  return ret;
};
