'use strict';

import { isNullOrUndefined } from './helpers';


let contentValidations = {
    /**
     * Tests if the value is not null, undefined,
     * or, if spec.allowEmpty == false, empty strings or empty arrays.
     */
    required(val, spec = { allowEmpty: false }) {
        if (isNullOrUndefined(val)) { return false; }

        if (!spec.allowEmpty && (typeof (val) === 'string' || Array.isArray(val))) {
            return val.length > 0;
        }

        return true;
    },

    /**
     * Tests if the value (string or array or anything with a 'length' prop)
     * is of, at least, spec.length long.
     */
    minLength(val, spec) {
        return isNullOrUndefined(val) || val.length >= spec.length;
    },

    /**
     * Tests if the value (string or array or anything with a 'length' prop)
     * is of, at most, spec.length long.
     * @param {object} spec
     */
    maxLength(val, spec) {
        return isNullOrUndefined(val) || val.length <= spec.length;
    },

    /**
     * Tests if a numeric value is between spec.minValue and spec.maxValue.
     */
    range(val, spec) {
        return isNullOrUndefined(val) || val >= spec.minValue && val <= spec.maxValue;
    },

    /**
     * Tests if a string value is a valid email address.
     * @param {string} email The email address to validate.
     */
    emailAddress(email) {
        if (isNullOrUndefined(email)) { return true; }

        return /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b./i.test(email);
    }
};

/**
 * Validates a value against a set of validations.
 * @param {object} val
 * @param {object} validations
 * @return {array} An array of errors. The array will be empty if no errors were found.
 */
export default function validateContent(val, validations = {}) {
    let errors = [];

    for (let validation in validations) {
        if (validations.hasOwnProperty(validation)) {
            let isValid = contentValidations[validation](val, validations[validation]);

            if (!isValid) {
                errors.push(validations[validation].message);
            }
        }
    }

    return errors;
}
