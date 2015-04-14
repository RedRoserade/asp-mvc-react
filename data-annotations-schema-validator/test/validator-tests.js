/*eslint-env mocha*/
'use strict';

import { inspect } from 'util';

import { assert } from 'chai';

import Validator from '../src/validator';

const toolSchema = {
  name: {
    type: 'string',
    validations: {
      required: {
        message: 'Specify the tool\'s name.'
      }
    }
  }
};

const personSchema = {
  name: {
    type: 'string',
    validations: {
      required: {
        message: 'The name of the person is required.'
      }
    }
  },
  pets: {
    type: 'array<string>',
    validations: {
      maxLength: {
        length: 2,
        message: 'You cannot have more than 2 pets.'
      }
    }
  },
  tool: {
    type: 'Tool',
    validations: {
      required: {
        message: 'You must have at least one tool.'
      }
    }
  }
};

describe('Validator', () => {
  describe('#addSchema', () => {
    it('Should throw for invalid parameters.', () => {
      const validator = new Validator();

      assert.throws(() => validator.addSchema());
      assert.throws(() => validator.addSchema(''));
      assert.throws(() => validator.addSchema('abc'));
      assert.throws(() => validator.addSchema('abc', null));
      assert.throws(() => validator.addSchema('abc', 5));
    });

    it('Should add the schema for valid parameters.', () => {
      const validator = new Validator({ baseUrl: '/api/validations' });

      validator.addSchema('Person', personSchema);
      assert.isObject(validator.schemas.Person);
    });
  });

  describe('#validate', () => {
    const validator = new Validator();

    validator.addSchema('Person', personSchema);

    it('Returns a validation object.', () => {
      const result = validator.validate({
        name: 'André'
      }, 'Person');
      assert.isObject(result);
    });
  });

  describe('#validateProp for basic types', () => {
    const validator = new Validator();

    validator.addSchema('Person', personSchema);

    it('Returns an object with an array of errors.', () => {
      const result = validator.validateProp(0, 'string', personSchema.name.validations);

      assert.isArray(result.errors);
    });

    it('Successful validations return an empty array and isValid === true.', () => {
      const result = validator.validateProp(
        'André', 'string', personSchema.name.validations);

      assert.lengthOf(result.errors, 0);
      assert.isTrue(result.isValid);
    });

    it('Failed validations return a non-empty array and isValid === false.', () => {
      const failedResult = validator.validateProp(
        0, 'string', personSchema.name.validations);

      assert.lengthOf(failedResult.errors, 1);

      assert.isFalse(failedResult.isValid);
    });
  });

  describe('#validateProp for arrays', () => {
    const validator = new Validator();
    validator.addSchema('Person', personSchema);

    const value = [1, 'a', {}];

    const result = validator.validateProp(
      value, 'array<string>', personSchema.pets.validations);

    it('Should return an errors array for the content in the array.', () => {
      assert.lengthOf(result.errors, 1);
    });

    it('The result should have an itemErrors array, equal to the length of the value array.', () => {
      assert.isArray(result.itemErrors);
      assert.lengthOf(result.itemErrors, value.length);
    });
  });

  describe('#validateProp for objects', () => {
    const validator = new Validator();
    validator.addSchema('Person', personSchema);
    validator.addSchema('Tool', toolSchema);

    const value = {
      name: 5048
    };

    const result = validator.validateProp(
      value, 'Tool', personSchema.tool.validations
    );

    it('Should return an array of errors for the object itself.', () => {
      assert.isArray(result.errors);
    });

    it('Should return an itemErrors object that mimicks the original\'s structure, with arrays for errors.', () => {
      assert.isObject(result.itemErrors);
      assert.property(result.itemErrors, 'name');
      assert.isArray(result.itemErrors.name.errors);
      console.log(JSON.stringify(result));
    });
  });
});
