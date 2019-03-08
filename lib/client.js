/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const {create} = require('apisauce');
const https = require('https');
const {util: {BedrockError}} = require('bedrock');

exports.send = async ({endpoint, payload, strictSSL = true}) => {
  const api = create({baseURL: endpoint});
  const axiosOptions = {};
  if(!strictSSL) {
    axiosOptions.httsAgent = new https.Agent({rejectUnauthorized: false});
  }
  const response = await api.post('/', payload, axiosOptions);
  if(response.problem) {
    const error = new BedrockError(
      'Error sending reports.', 'NetworkError');
    if(response.problem === 'CLIENT_ERROR') {
      error.details = {
        endpoint, error: response.data, status: response.status
      };
    } else {
      error.details = {
        endpoint, error: response.originalError, status: response.status
      };
    }
    throw error;
  }
};
