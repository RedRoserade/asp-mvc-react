'use strict';

import React from 'react';

import { SchemaHelperMixin, ValidationMixin } from '../mixins/index';

function getInputType(name) {
    switch (name) {
        case 'string':
            return 'text';
        case 'integer':
        case 'number':
            return 'number';
        case 'date':
            return 'date';
        case 'datetime':
            return 'datetime';
    }

    return 'text';
}

function parseInputValue(type, value) {
    switch (type) {
        case 'integer':
            return parseInt(value, 10);
        case 'number':
            return parseFloat(value);
        case 'date':
        case 'datetime':
            // TODO Try to use moment.
            return new Date(value);
    }

    // Return the value as a string by default.
    return value;
}

let Editor = React.createClass({
    mixins: [SchemaHelperMixin, ValidationMixin],
    getValue() {
        return parseInputValue(
            getInputType(this.fieldTypeFor(name)), this.getDOMNode().value);
    },
    getDefaultProps() {
        return {};
    },
    handleChange(e) {
        if (typeof (this.props.onChange === 'function')) {
            this.props.onChange(e.target.value);
        }
    },
    render() {
        let { name, model } = this.props;

        return (
            <input
                className={this.props.className}
                value={this.props.value || model[name]}
                type={this.props.type || getInputType(this.fieldTypeFor(name))}
                onChange={this.handleChange}
                id={this.idFor(name)}
                aria-invalid={!this.isValidField(name)}
                placeholder={this.placeholderFor(name)}
                name={this.nameFor(name)} />
        );
    }
});
export default Editor;
