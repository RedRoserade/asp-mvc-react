'use strict';

import { validate, validateAsync, loadSchema } from 'data-annotations-schema-validator';

export function SchemaLoaderMixin(schemaName) {
    return {
        componentWillMount() {
            if (!this.schema) {
                if (!schemaName && !this.props.schema) {
                    throw new Error('No schema name specified.');
                }

                loadSchema(schemaName, (err, schema) => {
                    if (err) { throw err; }

                    this.setState({ schema });
                });
            }
        },
        validate(cb) {
            let result = validate(this.state.model, this.state.schema);

            this.setState({
                modelState: result.modelState,
                valid: result.valid
            }, cb);
        },
        setStateAndValidate(stateChange, cb) {
            this.setState(stateChange, this.validate.bind(this, cb));
        }
    };
}

export let SchemaHelperMixin = {
    /**
     * Returns the label text for a prop.
     * @param {string} name The name of the prop.
     */
    labelFor(name) {
        var { schema } = this.state || this.props;

        if (!schema || !schema[name]) {
            return name;
        }

        return schema[name].label;
    },
    generateId(name) {
        return name.replace(/\s+/g, '_');
    },

    nameFor(name) {
        let { prefix } = this.props;

        prefix = prefix ? prefix + '.' : '';

        return prefix + name;
    },

    idFor(name) {
        let { prefix } = this.props;

        prefix = prefix ? prefix + '.' : '';

        return this.generateId(prefix + name);
    },

    placeholderFor(name) {
        var { schema } = this.state || this.props;

        if (!schema || !schema[name] || !schema[name].placeholder) {
            return '';
        }

        return schema[name].placeholder;
    },
    joinPrefixes(...prefixes) {
        return prefixes.join('.');
    },
    fieldTypeFor(name) {
        var { schema } = this.state || this.props;

        if (!schema || !schema[name] || !schema[name].type) {
            return '';
        }

        return schema[name].type;
    },
    getEnumValues(name) {
        var { schema } = this.state || this.props;

        if (!schema || !schema[name] || !schema[name].enumValues) {
            return [];
        }

        return schema[name].enumValues;
    }
};
