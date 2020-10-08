/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
module.exports = {
  parser: {
    parseFile: require('./lufile/parseFileContents').parseFile,
    validateLUISBlob: require('./luis/luisValidator'),
    validateResource: require('./lufile/parseFileContents').validateResource,
  },
  sectionHandler: {
    luParser: require('./lufile/luParser'),
    sectionOperator: require('./lufile/sectionOperator'),
    luSectionTypes: require('./utils/enums/lusectiontypes'),
  },
};
