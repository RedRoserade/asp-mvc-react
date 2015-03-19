'use strict';

function isNullOrUndefined(val) {
    return val === null || val === undefined;
}

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
    }
};
function validateType(val, type) {
    // Remove generics from the picture.
    type = type.split('<')[0];

    return typeValidators[type](val);
}

var contentValidations = {
    required(val, spec = { allowEmpty: false }) {
        if (val === null || val === undefined) { return false; }

        if (!spec.allowEmpty) {
            return val.length > 0;
        }

        return true;
    },
    minLength(val, spec) { return val.length >= spec.length; },
    maxLength(val, spec) { return val.length <= spec.length; },
    range(val, spec) { return val >= spec.minValue && val <= spec.maxValue; }
};
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

var schemas = {};

function validateProps(object, schema) {
    var props = {},
        valid = true;

    for (let prop in object) {
        if (object.hasOwnProperty(prop)) {
            let result = validateProp(prop, object[prop], schema);
            valid = valid && result.valid;

            props[prop] = result.errors;
        }
    }
    return { valid, props };
}

function validateProp(name, value, schema) {
    let errors = [],
        valid = true;

    let { type, validations } = schema[name];

    if (!validateType(value, type)) {
        errors.push(`${name} is not of type ${type}.`);
        valid = false;
    }

    let contentErrors = validateContent(value, validations);
    valid = valid && contentErrors.length === 0;

    errors = errors.concat(contentErrors);

    if (type.indexOf('<') !== -1) {
        let [, genericType] = (/array<(\w+)>/i).exec(type);

        let arrayErrors = [];

        for (let i = 0; i < value.length; i++) {
            let item = value[i];

            let result = validateProps(item, schemas[genericType]);
            valid = valid && result.valid;

            arrayErrors.push(result.props);
        }
        errors.push(arrayErrors);
    }

    return {
        valid,
        errors
    };
}

/**
 * Validates an object.
 * @param {object} obj The object to validate.
 * @param {schemaName} schema The name of the schema that is will be used
 * to validate [value].
 */
function validate(obj, schemaName) {
    var schema = schemas[schemaName];

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

    schemas.Pet = {
        name: {
            type: 'string',
            validations: {
                required: {
                    message: 'Tem que dar um nome ao seu animal de estimação.'
                }
            }
        }
    };

    schemas.Person = {
        name: {
            type: 'string',
            validations: {
                required: {
                    message: 'O nome é necessário.'
                },
                minLength: {
                    length: 5,
                    message: 'O nome tem que ter, pelo menos, 5 caracteres.'
                },
                maxLength: {
                    length: 6,
                    message: 'O nome tem que ter, no máximo, 6 caracteres.'
                }
            }
        },
        pets: {
            type: 'array<Pet>',
            validations: {
                required: {
                    message: 'Tem que ter pelo menos um animal de estimação.'
                },
                maxLength: {
                    length: 3,
                    message: 'Não pode ter mais do que 3 animais de estimação.'
                }
            }
        }
    };

    var obj = {
        name: 'André',
        pets: [
            {
                name: 'Bobi'
            },
            {
                name: 'Bobi'
            },
            {
                name: 'Bobi'
            },
            {
                name: 'Bobi'
            }
        ]
    };

    let result = validate(obj, 'Person');

    $('#results').innerText = JSON.stringify(result, null, '  ');
    $('#object').innerText = JSON.stringify(obj, null, '  ');
}());
