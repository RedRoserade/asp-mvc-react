'use strict';

import { schemaHelperMixin } from './schema-mixin';
import { validationMixin } from './validation-mixin';
let React = window.React;


export let Editor = React.createClass({
    mixins: [schemaHelperMixin, validationMixin],
    render() {
        let { name, model } = this.props;

        return (
            <input
                defaultValue={model[name]}
                type="text"
                id={this.idFor(name)}
                aria-invalid={!this.isValidField(name)}
                placeholder={this.placeholderFor(name)}
                name={this.nameFor(name)} />
        );
    }
});
