/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { expect, test } from '@oclif/test';
const nock = require('nock');

import {
  deleteTestConfigFile,
  initTestConfigFile,
} from '../../../configfilehelper';

describe('qnamaker:operationdetails:get', () => {
  before(async function () {
    await initTestConfigFile();
    // runs before all tests in this block
    nock('https://westus.api.cognitive.microsoft.com/qnamaker/v4.0')
      .get('/operations/52ce56bc-9b89-4532-9581-6caa88b02f90')
      .reply(200, {
        operationState: 'Succeeded',
        createdTimestamp: '2019-08-07T10:45:17Z',
        lastActionTimestamp: '2019-08-07T10:45:38Z',
        resourceLocation:
          '/knowledgebases/540c6c77-60e8-47df-a324-19f8c82bd692',
        userId: 'sahalksfhlakjfhalkdsjfhfs',
        operationId: '52ce56bc-9b89-4532-9581-6caa88b02f90',
      });
  });

  after(async function () {
    await deleteTestConfigFile();
  });

  test
    .stdout()
    .command([
      'qnamaker:operationdetails:get',
      '--operationId',
      '52ce56bc-9b89-4532-9581-6caa88b02f90',
    ])
    .it('Get operation details', (ctx) => {
      expect(ctx.stdout).to.contain(
        '"operationId": "52ce56bc-9b89-4532-9581-6caa88b02f90"'
      );
    });
});
