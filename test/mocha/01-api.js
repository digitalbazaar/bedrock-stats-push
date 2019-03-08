/*!
 * Copyright (c) 2019 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const pushHttp = require('bedrock-stats-push-http');
const nock = require('nock');

const nockReports = [];

describe('api', () => {
  it('works', async () => {
    const endpoint = 'https://example.com/foo';
    _nockEndpoint({endpoint});
    const mockSourceId = 'testSourceId';
    await pushHttp.addTarget({
      source: {id: mockSourceId},
      target: {
        endpoint,
        monitorIds: ['os'],
        storageApi: 'redis',
        strictSSL: false,
      }
    });
    // accumulate some reports
    await sleep(2100);
    // reporting interval in test.config is 500ms so there should be ~4 reports
    nockReports.length.should.be.oneOf([4, 5]);
    const [r] = nockReports;
    should.exist(r);
    r.should.have.property('reports');
    r.reports.should.be.an('array');
    r.reports.should.have.length(1);
    const [report] = r.reports;
    should.exist(report);
    report.should.have.property('createdDate');
    report.should.have.property('monitors');
    report.monitors.should.have.property('os');
    r.should.have.property('source');
    r.source.should.have.property('id');
    r.source.id.should.equal(mockSourceId);
  });
});

async function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

function _nockEndpoint({endpoint}) {
  nock(endpoint)
    .post('/', body => {
      nockReports.push(body);
      return true;
    })
    .times(1000)
    .reply(200);
}
