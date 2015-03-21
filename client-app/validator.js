'use strict';

function isNullOrUndefined(val) {
    return val === null || val === undefined;
}

/**
 * RegExp that is used to extract the generic type name
 * out of an array.
 */
let genericExpr = /array<(\w+)>/i;

/**
 * Tests whether the type name is a basic JS type,
 * which can be any of the following.
 * - string, integer, number, array, date
 * @param {string} typeName
 */
function isBaseType(typeName) {
    return (/string|number|integer|array|date/).test(typeName);
}

/**
 * Validators for basic JS types.
 */
var typeValidators = {
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
function validateType(val, type) {
    // Remove generics from the picture.
    type = type.split('<')[0];

    return typeValidators[type](val);
}

/**
 * Functions which validate the content of a prop.
 */
var contentValidations = {
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
    minLength(val, spec) { return isNullOrUndefined(val) || val.length >= spec.length; },
    /**
     * Tests if the value (string or array or anything with a 'length' prop)
     * is of, at most, spec.length long.
     */
    maxLength(val, spec) { return isNullOrUndefined(val) || val.length <= spec.length; },
    /**
     * Tests if a numeric value is between spec.minValue and spec.maxValue.
     */
    range(val, spec) { return isNullOrUndefined(val) || val >= spec.minValue && val <= spec.maxValue; },
    /**
     * Tests if a string value is a valid email address.
     * @param {string} email The email address to validate.
     */
    emailAddress(email) {
        if (isNullOrUndefined(email)) { return true; }

        // TODO Probably just use a regexp to validate the value
        // in case the browser doesn't support input[type=email].
        // This is a nice way, though.
        let input = document.createElement('input');
        input.type = 'email';
        input.value = email;
        return input.validity.valid;
    }
};
/**
 * Validates a value against a set of validations.
 * @param {object} val
 * @param {object} validations
 * @return {array} An array of errors. The array will be empty if no errors were found.
 */
function validateContent(val, validations = {}) {
    var errors = [];

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

/**
 * Schema cache.
 */
var schemas = {};

function validateProps(object, schema) {
    var props = {},
        valid = true;

    for (let prop in schema) {
        if (schema.hasOwnProperty(prop)) {
            let result = validateProp(prop, object[prop], schema);
            valid = valid && result.valid;

            props[prop] = result.errors;
        }
    }
    return { valid, props };
}

// TODO This probably doesn't work for items
// that aren't a basic type and aren't an array.
function validateProp(name, value, schema) {
    let errors = [],
        valid = true;

    let { type, validations } = schema[name];

    if (isBaseType(type)) {
        if (!validateType(value, type)) {
            errors.push(`${name} is not of type ${type}.`);
            valid = false;
        }

        let contentErrors = validateContent(value, validations);
        valid = valid && contentErrors.length === 0;
        errors = errors.concat(contentErrors);

        if (!isNullOrUndefined(value) && type.indexOf('<') !== -1) {
            let [, genericType] = genericExpr.exec(type);

            let arrayErrors = [];
            let isBase = isBaseType(genericType);

            for (let i = 0; i < value.length; i++) {
                let item = value[i];

                if (isBase) {
                    var isValidItemType = validateType(item, genericType);
                    arrayErrors.push([isValidItemType]);
                    valid = valid && isValidItemType;
                } else {
                    let result = validateProps(item, schemas[genericType]);
                    valid = valid && result.valid;
                    arrayErrors.push(result.props);
                }
            }
            errors.push(arrayErrors);
        }
    } else {
        let contentErrors = validateContent(value, validations);
        valid = valid && contentErrors.length === 0;

        errors = errors.concat(contentErrors);

        if (!isNullOrUndefined(value)) {
            let propResult = validateProps(value, schemas[type]);
            valid = valid && propResult.valid;
            errors = errors.concat(propResult.props);
        }

    }

    return {
        valid,
        errors
    };
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

            if (typeName.indexOf('<') !== -1) {
                additionalSchemasToLoad.push(genericExpr.exec(schema[prop].type)[1]);
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
function loadSchema(schemaName, done) {
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
function validate(obj, schema) {
    let result = {
        valid: true,
        validationResult: {}
    };

    let validation = validateProps(obj, schema);

    result.validationResult = validation.props;
    result.valid = validation.valid;

    return result;
}

(function () {
    let $ = function (query, context = document) { return context.querySelector(query); };

    var obj = {
        Name: 'André',
        Email: 'a@a.a',
        Age: 21,
        Pets: [
            {
                Name: 'Bobi'
            }
        ]
    };

    let objectBox = $('#object'),
        resultBox = $('#results');

    objectBox.value = JSON.stringify(obj, null, '  ');

    function doValidation() {
        try {
            obj = JSON.parse(objectBox.value);
            resultBox.innerText = "Loading...";

            loadSchema('Pet', (err) => {
                if (err) { throw err; }

                loadSchema('Person', (err, schema) => {
                    if (err) { throw err; }

                    resultBox.innerText = JSON.stringify(validate(obj, schema), null, '  ');
                });
            });

        } catch (e) {
            resultBox.innerText = e.toString();
        }

    }

    $('#run').addEventListener('click', doValidation);
}());
