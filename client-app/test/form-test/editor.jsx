'use strict';

import { schemaHelperMixin } from './schema-mixin';
import { validationMixin } from './validation-mixin';
let React = window.React;


export let Editor = React.createClass({
    mixins: [schemaHelperMixin, validationMixin],
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
                value={model[name]}
                type="text"
                onChange={this.handleChange}
                id={this.idFor(name)}
                aria-invalid={!this.isValidField(name)}
                placeholder={this.placeholderFor(name)}
                name={this.nameFor(name)} />
        );
    }
});
