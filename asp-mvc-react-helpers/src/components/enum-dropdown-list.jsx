/**
 * React-based enum drop-down list.
 */
'use strict';

import React from 'react';

import { SchemaHelperMixin, ValidationMixin } from '../mixins/index';

let EnumDropdownList = React.createClass({
    mixins: [SchemaHelperMixin, ValidationMixin],
    handleChange(e) {
        this.props.onChange(e.target.value);
    },
    render() {
        let { name, model } = this.props;

        return (
            <select
                className={this.props.className}
                value={model[name]}
                id={this.idFor(name)}
                aria-invalid={!this.isValidField(name)}
                onChange={this.handleChange}
                name={this.nameFor(name)}>
                {this.getEnumValues(name).map(v =>
                    <option value={v.value} key={v.value}>
                        {v.text}
                    </option>)}
            </select>
        );
    }
});
export default EnumDropdownList;
