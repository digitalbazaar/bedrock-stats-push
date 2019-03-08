/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const _cacheKeys = require('./cache-keys');
const cache = require('bedrock-redis');

exports.addTarget = async ({startDate, source, target}) => {
  const {endpoint} = target;
  const targetKey = _cacheKeys.target(endpoint);
  const targetStartDateKey = _cacheKeys.targetStartDate(endpoint);
  const txn = cache.client.multi();
  txn.set(targetKey, JSON.stringify({source, target}));
  txn.set(targetStartDateKey, startDate);
  txn.sadd(_cacheKeys.targetKeys(), targetKey);
  return txn.exec();
};

exports.getTargets = async () => {
  const targetKeys = await cache.client.smembers(_cacheKeys.targetKeys());
  if(targetKeys.length === 0) {
    return [];
  }
  const result = await cache.client.mget(targetKeys);
  return result.map(t => JSON.parse(t));
};

exports.getTargetStartDate = async endpoint => {
  const targetStartDateKey = _cacheKeys.targetStartDate(endpoint);
  const result = await cache.client.get(targetStartDateKey);
  return parseInt(result);
};

exports.setTargetStartDate = async ({endpoint, startDate}) => {
  const targetStartDateKey = _cacheKeys.targetStartDate(endpoint);
  return cache.client.set(targetStartDateKey, startDate);
};
