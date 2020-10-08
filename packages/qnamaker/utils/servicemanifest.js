/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const cc = require('camelcase');

function getServiceManifest(json) {
  for (let iOperation in json.operations) {
    let operation = json.operations[iOperation];
    return Object.assign(
      {
        operation: operation,
        identifier: cc(json.className),
      },
      json.name
    );
  }
}

async function validateArguments(serviceManifest, args) {
  let error = new Error();
  let body = undefined;
  error.name = 'ArgumentError';
  if (!serviceManifest) {
    error.message = 'The operation does not exist';
    throw error;
  }

  const { operation } = serviceManifest;
  if (!operation) {
    error.message = 'The operation does not exist';

    throw error;
  }

  const entitySpecified = typeof args.in === 'string';
  const entityRequired = !!operation.entityName;

  if (!entityRequired && entitySpecified) {
    error.message = `The ${operation.name} operation does not accept an input`;
    throw error;
  }

  if (entityRequired && !entitySpecified) {
    error.message = `The ${operation.name} requires an input of type: ${operation.entityType}`;
    throw error;
  }

  if (serviceManifest.operation.params) {
    for (let param of serviceManifest.operation.params) {
      if (
        param.required &&
        !args[param.name] &&
        !args[param.alias || param.name]
      ) {
        error.message = `The --${param.name} argument is missing and required`;
        throw error;
      }
    }
  }

  // Note that the ServiceBase will validate params that may be required.
  return body;
}

module.exports = {
  getServiceManifest,
  validateArguments,
};
