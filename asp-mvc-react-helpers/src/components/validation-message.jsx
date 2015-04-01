'use strict';

import React from 'react';

import schemaHelperMixin from './schema-mixin';
import validationMixin from './validation-mixin';

let ValidationMessage = React.createClass({
    mixins: [schemaHelperMixin, validationMixin],
    render() {
        let { name } = this.props;

        return (
            <ul className={this.props.className}
                aria-hidden={this.isValidField(name)}>
                {this.validationMessageFor(name).map(e =>
                    <li key={e}>{e}</li>)}
            </ul>
        );
    }
});
export default ValidationMessage;
