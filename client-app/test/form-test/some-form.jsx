'use strict';

import { validate, validateAsync, loadSchema } from 'validator';
import { Label } from './label.jsx';
import { Editor } from './editor.jsx';
import { ValidationMessage } from './validation-message.jsx';

let React = window.React;

export let SomeForm = React.createClass({
    getDefaultProps() {
        return {
            schema: {
                Name: {
                    label: "Nome",
                    placeholder: "Introduza o seu nome"
                }
            },
            modelState: {
                Name: {
                    typeErrors: [],
                    validationErrors: [
                        "O nome é obrigatório."
                    ],
                    valid: false
                }
            }
        };
    },
    render() {
        let props = {
            schema: this.props.schema,
            modelState: this.props.modelState
        };

        return (
            <div>
                <Label {...props} prop={m => m.Name} />
                <Editor {...props} prop={m => m.Name} />
                <ValidationMessage {...props} prop={m => m.Name} />
            </div>
        );
    }
});
