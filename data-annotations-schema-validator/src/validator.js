'use strict';

import { isBaseType, isNullOrUndefined } from './helpers';
import validateContent from './content-validations';
import { validateType, extractType } from './type-validations';
import ValidationResult from './validation-result';

/**
 * Parses a schema and returns any additional
 * schemas that may need to be loaded.
 * @param {object} schema
 * @return {array}
 */
function findAdditionalSchemas(schema) {
  let additionalSchemasToLoad = [];

  for (let prop in schema) {
    if (schema.hasOwnProperty(prop)) {
      let typeName = schema[prop].type;

      if (!isBaseType(extractType(typeName))) {
        additionalSchemasToLoad.push(extractType(schema[prop].type));
      } else if (!isBaseType(typeName)) {
        additionalSchemasToLoad.push(typeName);
      }
    }
  }

  return additionalSchemasToLoad;
}

export default class Validator {

  constructor(spec = { baseUrl: '', urlFormat: null }) {
    this.schemas = {};

    this.baseUrl = spec.baseUrl;

    this.urlFormat = spec.urlFormat || (schemaName) => {
      return `${this.baseUrl}/${schemaName}`;
    };
  }

  /**
   * Adds a schema to this validator.
   * @param {string} name The name of the schema.
   * @param {object} shema The schema to add.
   */
  addSchema(name, schema) {
    if (typeof name !== 'string') { throw new Error('"name" must be a string.'); }
    if (!schema || typeof schema !== 'object') { throw new Error('"schema" must be a object.'); }

    this.schemas[name] = schema;
  }

  /**
   * Loads a schema asynchronously.
   * The schema is then parsed to check if any additional schemas
   * need to be loaded from the server.
   *
   * @param {string} name The name of the schema to load.
   * @param {function} done A function that is called with the loaded schema,
   * or with any error that occured during the fetch process.
   */
  loadSchema(schemaName, done) {
    if (!this.baseUrl && !this.urlFormat) {
      throw new TypeError('Either a baseUrl string or urlFormat function must be specified.');
    }

    let additionalSchemas = [schemaName];

    let loadMoreSchemas = (cb) => {

      let schemaToLoad = additionalSchemas.pop();

      if (this.schemas[schemaToLoad]) {
        cb(null, schemaToLoad, this.schemas[schemaToLoad]);
        return;
      }

      let xhr = new XMLHttpRequest();

      xhr.open('get', this.urlFormat(schemaName));
      xhr.setRequestHeader('Accept', 'application/json');

      xhr.onload = (e) => {
        if (e.target.status === 200) {
          cb(null, schemaToLoad, JSON.parse(e.target.responseText));
        } else {
          cb(new Error(`Unable to load ${schemaToLoad}.`), null);
        }
      };

      xhr.addEventListener('error', cb);
      xhr.send();
    };

    let parseSchema = (err, loadedSchema, schema) => {
      if (err) { throw err; }

      if (!this.schemas[loadedSchema]) {
        this.schemas[loadedSchema] = schema;
        additionalSchemas = additionalSchemas.concat(findAdditionalSchemas(schema));
      }

      if (!additionalSchemas.length) {
        done(null, this.schemas[schemaName]);
      } else {
        loadMoreSchemas(parseSchema);
      }
    };

    loadMoreSchemas(parseSchema);
  }

  validate(object, schema) {

    const result = {
      isValid: true,
      modelState: {}
    };

    const validation = this.validateObject(object,
      typeof (schema) === 'string' ? this.schemas[schema] :
      schema);

    result.modelState = validation.props;
    result.isValid = validation.isValid;

    return result;
  }

  /**
   * Asynchonously validates an object.
   * This will attempt to load any necessary schemas,
   * and then calls #validate with the loaded schema.
   *
   * @param {any} object The object to validate.
   * @param {string} schemaName The name of the schema to valdiate.
   * @param {function} cb A function that is called
   * with the validation result.
   */
  validateAsync(object, schemaName, cb) {
    this.loadSchema(schemaName, (err, schema) => {
      if (err) { cb(err); return; }
      try {
        cb(null, this.validate(object, schema));
      } catch (e) {
        cb(e);
      }
    });
  }

  validateProp(value, itemType, validations) {

    let result = new ValidationResult();
    let type = extractType(itemType);

    if (itemType.indexOf('array') !== -1 && !Array.isArray(value)) {
      result.errors.push(`${value} is not an array.`);
    } else if (isBaseType(itemType) && !validateType(value, itemType)) {
      result.errors.push(`${value} is not of type ${type}.`);
    }

    result.addErrors(validateContent(value, validations));

    if (Array.isArray(value)) {
      let isBase = isBaseType(type);
      result.itemErrors = [];

      for (let i = 0; i < value.length; i++) {
        let item = value[i];
        let itemResult = new ValidationResult();

        if (isBase) {
          if (!validateType(item, type)) {
            itemResult.errors.push(`${item} is not a ${type}.`);
          }
        } else {
          let contentValidation = this.validateObject(item, this.schemas[type]);

          itemResult.valid = result.valid && contentValidation.valid;
          itemResult.itemErrors.push(contentValidation.props);
        }

        result.itemErrors.push(itemResult);
      }
    }
    else if (!isBaseType(type) && !isNullOrUndefined(value)) {
      let contentValidation = this.validateObject(value, this.schemas[type]);
      result.valid = result.valid && contentValidation.valid;
      result.itemErrors = contentValidation.props;
    }

    return result;
  }

  validateObject(object, schema) {
    let props = {};
    let isValid = true;

    for (let prop in schema) {
      if (schema.hasOwnProperty(prop)) {
        let { type, validations } = schema[prop];

        let result = this.validateProp(object[prop], type, validations);

        props[prop] = result;
        isValid = isValid && result.isValid;
      }
    }
    return { isValid, props };
  }
}
