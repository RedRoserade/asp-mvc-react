'use strict';

import React from 'react';

import { SchemaHelperMixin, ValidationMixin } from '../mixins/index';

let ValidationMessage = React.createClass({
    mixins: [SchemaHelperMixin, ValidationMixin],
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
