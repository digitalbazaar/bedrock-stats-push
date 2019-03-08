/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
require('bedrock-stats');
require('bedrock-stats-storage-redis');
require('bedrock-stats-monitor-os');
require('bedrock-stats-push-http');

require('bedrock-test');
bedrock.start();
