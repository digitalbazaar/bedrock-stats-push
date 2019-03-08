/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const _cache = require('./cache');
const _client = require('./client');
const _logger = require('./logger');
const brStats = require('bedrock-stats');
const {util: {BedrockError}} = require('bedrock');

exports.processTarget = async job => {
  const {data: {endpoint, query, source, storageApi, strictSSL}} = job;
  const endDate = query.endDate = Date.now();
  try {
    const reports = await brStats.getReports({query, storageApi});
    if(reports.length === 0) {
      // nothing to send, just advance the startDate
      await _advanceStartDate({endpoint, endDate});
      return;
    }
    const payload = {reports, source};
    await _client.send({endpoint, payload, strictSSL});

    // if send succeeds, advance the startDate
    await _advanceStartDate({endpoint, endDate});
  } catch(e) {
    const error = new BedrockError(
      'Error processing target.', 'OperationError', {...job.data}, e);
    _logger.error('Error processing target.', error);
    throw error;
  }
};

async function _advanceStartDate({endpoint, endDate}) {
  const startDate = endDate + 1;
  return _cache.setTargetStartDate({endpoint, startDate});
}
