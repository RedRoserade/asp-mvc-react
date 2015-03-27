'use strict';

import { schemaHelperMixin } from './schema-mixin';
import { validationMixin } from './validation-mixin';
import _ from 'underscore';

let React = window.React;

export let ValidationMessage = React.createClass({
    mixins: [schemaHelperMixin, validationMixin],
    render() {
        let { name } = this.props;

        return (
            <ul aria-hidden={this.isValidField(name)}>
                {_.map(this.validationMessageFor(name), e => <li key={e}>{e}</li>)}
            </ul>
        );
    }
});
