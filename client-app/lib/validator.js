'use strict';

import { isBaseType, isNullOrUndefined } from './helpers';
import { validateContent } from './content-validations';
import { validateType, extractType } from './type-validations';

/**
 * Schema cache.
 */
var schemas = {};

function validateProps(object, schema) {
    var props = {},
        valid = true;

    for (let prop in schema) {
        if (schema.hasOwnProperty(prop)) {
            let { type, validations } = schema[prop];

            let result = validateProp(object[prop], type, validations);

            valid = valid && result.valid;

            props[prop] = result;
        }
    }
    return { valid, props };
}

class ValidationResult {
    constructor() {
        this.typeErrors = [];
        this.validationErrors = [];
        this.valid = true;
    }
}

function validateProp(value, itemType, validations) {

    let result = new ValidationResult();

    let type = extractType(itemType);

    // Validate the type of the prop if the prop type is a base type.
    // TODO Try to get this working with non-base types (prototypes?)
    if ((itemType.indexOf("array") !== -1 && !Array.isArray(value)) &&
        (isBaseType(type) && !validateType(value, type))) {
        result.typeErrors.push(`${value} is not of type ${type}.`);
    }

    result.validationErrors = validateContent(value, validations);

    if (Array.isArray(value)) {
        let isBase = isBaseType(type);
        result.itemErrors = [];

        for (let item of value) {
            if (isBase) {
                if (!validateType(item, type)) {
                    result.typeErrors.push(`${item} is not of type ${type}.`);
                }

                result.itemErrors.push(validateContent(value, validations));
            } else {
                let contentValidation = validateProps(item, schemas[type]);
                result.valid = result.valid && contentValidation.valid;
                result.itemErrors.push(contentValidation.props);
            }
        }
    }
    else if (!isBaseType(type) && !isNullOrUndefined(value)) {
        let contentValidation = validateProps(value, schemas[type]);
        result.valid = result.valid && contentValidation.valid;
        result.propertyErrors = contentValidation.props;
    }

    result.valid = result.valid &&
        result.typeErrors.length === 0 &&
        result.validationErrors.length === 0;

    return result;
}

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

/**
 * @param {string} schemaName
 * @param {function} cb
 */
export function loadSchema(schemaName, done) {
    let additionalSchemas = [schemaName];

    let loadMoreSchemas = (cb) => {

        let schemaToLoad = additionalSchemas.pop();

        if (schemas[schemaToLoad]) {
            console.log(`${schemaToLoad} already loaded--returning early`);
            cb(null, schemaToLoad, schemas[schemaToLoad]);
            return;
        }

        console.log(`Loading ${schemaToLoad}`);

        let xhr = new XMLHttpRequest();

        xhr.open('get', `http://localhost:2106/validation/${schemaToLoad}`);
        xhr.setRequestHeader('Accept', 'application/json');

        xhr.addEventListener('load', (e) => {
            if (e.target.status === 200) {
                cb(null, schemaToLoad, JSON.parse(e.target.responseText));
            } else {
                cb(new Error(`Schama ${schemaToLoad} not found.`), null);
            }
        });

        xhr.addEventListener('error', cb);
        xhr.send();
    };

    let parseSchema = (err, loadedSchema, schema) => {
        if (err) { throw err; }

        // Skip the additional load steps if the schema was
        // already loaded, because we load schemas ourselves.
        if (!schemas[loadedSchema]) {
            schemas[loadedSchema] = schema;
            additionalSchemas = additionalSchemas.concat(findAdditionalSchemas(schema));
        }

        if (additionalSchemas.length === 0) {
            console.log('Calling back...');
            done(null, schemas[schemaName]);
        } else {
            loadMoreSchemas(parseSchema);
        }
    };

    loadMoreSchemas(parseSchema);
}

/**
 * Validates an object.
 * @param {object} obj The object to validate.
 * @param {schemaName} schema The name of the schema that is will be used
 * @param {function} cb
 * to validate [value].
 */
export function validate(obj, schema) {
    let result = {
        valid: true,
        validationResult: {}
    };

    let validation = validateProps(obj, schema);

    result.validationResult = validation.props;
    result.valid = validation.valid;

    return result;
}

export function validateAsync(obj, schemaName, cb) {
    loadSchema(schemaName, (err, schema) => {
        if (err) { cb(err); return; }
        try {
            cb(null, validate(obj, schema));
        } catch (e) {
            cb(e);
        }
    });
}
