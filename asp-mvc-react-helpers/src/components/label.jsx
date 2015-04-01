'use strict';

import React from 'react';

import { SchemaHelperMixin } from '../mixins/index';

let Label = React.createClass({
    mixins: [SchemaHelperMixin],
    render() {
        let { name } = this.props;

        return (
            <label
                className={this.props.className}
                htmlFor={this.idFor(name)}>
                {this.labelFor(name)}
            </label>
        );
    }
});
export default Label;
