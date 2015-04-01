'use strict';

export function isNullOrUndefined(val) {
    return val === null || val === undefined;
}

/**
 * Tests whether the type name is a basic JS type,
 * which can be any of the following.
 * - string, integer, number, array, date
 * @param {string} typeName
 */
export function isBaseType(typeName) {
    return (/string|number|integer|array|date|enum/).test(typeName);
}
