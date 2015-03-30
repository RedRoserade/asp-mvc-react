/**
 * React-based enum drop-down list.
 */
'use strict';

import { schemaHelperMixin } from './schema-mixin';
import { validationMixin } from './validation-mixin';
import _ from 'underscore';
let React = window.React;

let EnumDropDownList = React.createClass({
    mixins: [schemaHelperMixin, validationMixin],
    handleChange(e) {
        this.props.onChange(e.target.value);
    },
    render() {
        let { name, model, schema } = this.props;

        return (
            <select
                value={model[name]}
                id={this.idFor(name)}
                aria-invalid={!this.isValidField(name)}
                onChange={this.handleChange}
                name={this.nameFor(name)}>
                {_.map(schema[name].enumValues, v =>
                    <option value={v.value} key={v.value}>
                        {v.text}
                    </option>)}
            </select>
        );
    }
});
export default EnumDropDownList;
