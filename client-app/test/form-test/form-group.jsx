'use strict';

import { schemaHelperMixin } from './schema-mixin';
import { validationMixin } from './validation-mixin';
import { Label } from './label.jsx';
import { Editor } from './editor.jsx';
import { ValidationMessage } from './validation-message.jsx';

let React = window.React;

export let FormGroup = React.createClass({
    mixins: [schemaHelperMixin, validationMixin],
    getDefaultProps() {
        return {
            groupClassName: 'form-group',
            labelClassName: 'control-label',
            editorClassName: 'form-control',
            validationMessageClassName: ''
        };
    },
    render() {
        return (
            <div className="form-group">
                <Label {...this.props} className={this.props.labelClassName} />
                <div>
                    <Editor {...this.props} className={this.props.editorClassName} />
                    <ValidationMessage {...this.props} className={this.props.validationMessageClassName} />
                </div>
            </div>
        );
    }
});
