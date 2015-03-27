'use strict';

import _ from 'underscore';

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
    return (/string|number|integer|array|date/).test(typeName);
}

export function flattenObject(ob) {
	var toReturn = {};

	for (var i in ob) {
		if (!ob.hasOwnProperty(i)) { continue; }

		if ((typeof ob[i]) === 'object') {
			var flatObject = flattenObject(ob[i]);
			for (var x in flatObject) {
				if (!flatObject.hasOwnProperty(x)) { continue; }

				toReturn[i + '.' + x] = flatObject[x];
			}
		} else {
			toReturn[i] = ob[i];
		}
	}
	return toReturn;
}
