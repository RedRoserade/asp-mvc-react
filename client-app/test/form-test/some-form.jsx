'use strict';

import { validate, validateAsync, loadSchema, schemas } from 'validator';
import { Label } from './label.jsx';
import { Fieldset } from './fieldset.jsx';
import { Editor } from './editor.jsx';
import { ValidationMessage } from './validation-message.jsx';
import request from 'browser-request';
import { schemaLoaderMixin } from './schema-mixin';
import _ from 'underscore';

let React = window.React;

export let SomeForm = React.createClass({
    mixins: [schemaLoaderMixin('Person')],
    getDefaultProps() {
        return {};
    },
    getInitialState() {
        return {
            schema: {},
            model: { Pets: [] },
            modelState: {}
        };
    },
    addPet() {
        let updatedModel = React.addons.update(this.state.model, {
            Pets: { $push: [{ Name: '' }] }
        });

        this.setState({
            model: updatedModel
        }, this.validate);
    },
    handleChange(e) {
        let name = e.target.name,
            value = e.target.value;

        console.log(this.state.model);

        let updatedModel = React.addons.update(this.state.model, {
            $merge: { [name]: value }
        });

        console.log(updatedModel);

        this.setState({
            model: updatedModel
        }, this.validate);
    },
    render() {
        return (
            <form noValidate onChange={this.handleChange}>
                <Fieldset>
                    <Label {...this.state} name="Name" />
                    <div>
                        <Editor {...this.state} name="Name" />
                        <ValidationMessage {...this.state} name="Name" />
                    </div>
                </Fieldset>

                <Fieldset>
                    <Label {...this.state} name="Email" />
                    <div>
                        <Editor {...this.state} name="Email" />
                        <ValidationMessage {...this.state} name="Email" />
                    </div>
                </Fieldset>

                {_.map(this.state.model.Pets, (p, i) =>
                    <Fieldset key={`Pets[${i}]`}
                        schema={schemas.Pet} prefix={`Pets[${i}]`}>
                        <Label {...this.state} name="Name" />
                        <Fieldset>
                            <Editor {...this.state} name="Name" />
                            <ValidationMessage {...this.state} name="Name" />
                        </Fieldset>
                    </Fieldset>
                )}

                <button type="button" onClick={this.addPet}>
                    Adicionar animal de estimação
                </button>
            </form>
        );
    }
});
