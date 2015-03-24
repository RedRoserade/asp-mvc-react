'use strict';

import { isNullOrUndefined } from './helpers';

/**
 * RegExp that is used to extract the generic type name
 * out of an array.
 */
export let genericExpr = /array<(\w+)>/i;

export function extractType(type) {
    if (genericExpr.test(type)) { return genericExpr.exec(type)[1]; }

    return type;
}

/**
 * Validators for basic JS types.
 */
let typeValidators = {
    string(val) {
        return isNullOrUndefined(val) || typeof (val) === 'string';
    },

    number(val) {
        return isNullOrUndefined(val) || typeof (val) === 'number' || !isNaN(parseFloat(val));
    },

    integer(val) {
        return isNullOrUndefined(val) || Number.isInteger(parseFloat(val));
    },

    array(val) {
        return isNullOrUndefined(val) || Array.isArray(val);
    },

    date() {
        return true; // TODO
    }
};

export function validateType(val, type) {
    // Remove generics from the picture.
    type = type.split('<')[0];

    return typeValidators[type](val);
}
