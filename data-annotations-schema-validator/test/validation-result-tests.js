/*eslint-env mocha*/
'use strict';

import { assert } from 'chai';

import ValidationResult from '../src/validation-result';

describe('ValidationResult', () => {
    it('Should have an empty array of errors by default.', () => {
        let result = new ValidationResult();

        assert.typeOf(result.errors, 'array');
        assert.lengthOf(result.errors, 0);
    });

    it('Should return isValid === true if array of errors is empty.', () => {
        let result = new ValidationResult();

        assert.typeOf(result.isValid, 'boolean');
        assert.isTrue(result.isValid);
    });

    it('Should return isValid === false if array of errors is not empty.', () => {
        let result = new ValidationResult();

        result.errors.push('Error');

        assert.typeOf(result.isValid, 'boolean');
        assert.isFalse(result.isValid);
    });
});
