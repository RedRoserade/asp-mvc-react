'use strict';

import { extractType } from './type-validations';

export function isNullOrUndefined(val) {
    return val === null || val === undefined;
}

function getBaseType(typeName) {
  if (typeName.indexOf('<') !== -1) {
    return typeName.split('<')[0];
  }

  return extractType(typeName);
}

/**
 * Tests whether the type name is a basic JS type,
 * which can be any of the following.
 * - string, integer, number, date
 * @param {string} typeName
 */
export function isBaseType(typeName) {
    return (/string|number|integer|date|enum/).test(getBaseType(typeName));
}
