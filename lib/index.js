/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const _cache = require('./cache');
const _cacheKeys = require('./cache-keys');
const assert = require('assert-plus');
const bedrock = require('bedrock');
const _jobQueue = require('./job-queue');

require('./config');

/**
 * @module bedrock-stats-push-http
 */

bedrock.events.on('bedrock-stats.report-complete', async () => {
  // add a one time job to the jobQueue for sending to each target
  const targets = await _cache.getTargets();
  for(const {source, target} of targets) {
    const {endpoint, monitorIds, storageApi, strictSSL} = target;
    const startDate = await _cache.getTargetStartDate(endpoint);
    const jobQueue = exports.getJobQueue();
    await jobQueue.add({
      endpoint,
      query: {
        monitorIds,
        startDate,
      },
      source,
      storageApi,
      strictSSL
    }, {
      // specify non-unique jobId to prevent duplicate jobs
      jobId: _cacheKeys.hashEndpoint(endpoint),
      // do not keep record of failed/successful jobs in redis
      removeOnComplete: true,
      removeOnFail: true,
    });
  }
});

/**
 * Add an HTTP target that will receive stats reports.
 *
 * @param {Object} options - The options to use.
 * @param {Target} options.target - The target options.
 * @param {Object} options.source - The source options. May contain arbitrary
 *   properties in addition to `id`.
 * @param {string} options.source.id - Identifies the source to the target.
 * @param {number} [options.startDate=Date.now()] - The start date for the first
 *   report sent to the target in ms since epoch.
 *
 * @returns {Promise<undefined>} Resolves on completion.
 */
exports.addTarget = async ({startDate = Date.now(), source, target}) => {
  assert.object(target, 'options.target');
  assert.string(target.endpoint, 'options.target.endpoint');
  assert.number(startDate, 'options.startDate');
  assert.object(source, 'options.source');
  assert.string(source.id, 'options.source.id');

  await _cache.addTarget({startDate, source, target});
};

exports.getJobQueue = () => _jobQueue.jobQueue;

/**
 * The target options.
 *
 * @typedef {Object} Target
 * @property {string} endpoint - The HTTP REST endpoint.
 * @property {string[]} monitorIds - The stat monitors to report on.
 * @property {string} storageApi - The storage API to query.
 * @property {boolean} [strictSSL=true] - Use strictSSL when communicating
 *   with this target.
 */
