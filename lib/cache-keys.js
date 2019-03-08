/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const _constants = require('./constants');
const crypto = require('crypto');
const memoize = require('fast-memoize');

const _mHashEndpoint = exports.hashEndpoint = memoize(_hashEndpoint);

exports.target = endpoint =>
  `${_constants.STATS_PUSH_HTTP_PREFIX}|t|${_mHashEndpoint(endpoint)}`;

exports.targetKeys = () => `${_constants.STATS_PUSH_HTTP_PREFIX}|tk`;

exports.targetStartDate = endpoint =>
  `${_constants.STATS_PUSH_HTTP_PREFIX}|tsd|${_mHashEndpoint(endpoint)}`;

function _hashEndpoint(endpoint) {
  const hashBuffer = crypto.createHash('sha256').update(endpoint).digest();
  return hashBuffer.toString('base64');
}
