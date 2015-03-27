'use strict';

import { schemaHelperMixin } from './schema-mixin';

let React = window.React;

export let Label = React.createClass({
    mixins: [schemaHelperMixin],
    render() {
        let { name } = this.props;

        return (
            <label htmlFor={this.idFor(name)}>
                {this.labelFor(name)}
            </label>
        );
    }
});
