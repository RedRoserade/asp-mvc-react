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

let Editor = React.createClass({
    mixins: [SchemaHelperMixin, ValidationMixin],
    getDefaultProps() {
        return {
            onChange() { /* No-op */ }
        };
    },
    handleChange(e) {
        this.props.onChange(e.target.value);
    },
    render() {
        let { name, model } = this.props;

        return (
            <input
                className={this.props.className}
                value={model[name]}
                type={getInputType(this.fieldTypeFor(name))}
                onChange={this.handleChange}
                id={this.idFor(name)}
                aria-invalid={!this.isValidField(name)}
                placeholder={this.placeholderFor(name)}
                name={this.nameFor(name)} />
        );
    }
});
export default Editor;
