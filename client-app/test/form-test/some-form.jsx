'use strict';

import { validate, validateAsync, loadSchema, schemas, navigateSafely } from 'validator';
import { Label } from './label.jsx';
import { Fieldset } from './fieldset.jsx';
import { Editor } from './editor.jsx';
import { ValidationMessage } from './validation-message.jsx';
import request from 'browser-request';
import { schemaLoaderMixin, schemaHelperMixin } from './schema-mixin';
import _ from 'underscore';
import { FormGroup } from './form-group.jsx';
import { validationMixin } from './validation-mixin';
import EnumDropDownList from './enum-dropdown-list.jsx';

let React = window.React;
let { update } = React.addons;

let SpeciesEditor = React.createClass({
    onChange(changedProp, value) {
        this.props.onChange(changedProp, value);
    },
    render() {
        return (
            <div>
                <FormGroup {...this.props}
                    onChange={this.onChange.bind(this, 'Name')}
                    name="Name" />
                <EnumDropDownList {...this.props}
                    onChange={this.onChange.bind(this, 'Type')}
                    name="Type" />
            </div>
        );
    }
});

let PetEditor = React.createClass({
    mixins: [schemaHelperMixin, validationMixin],
    handleChange(changedProp, value) {
        this.props.onChange(changedProp, value);
    },
    handleSpeciesChange(changedProp, value) {
        this.props.onChange('Species', { [changedProp]: value });
    },
    render() {
        return (
            <div>
                <FormGroup {...this.props}
                    onChange={this.handleChange.bind(this, 'Name')}
                    name="Name" />
                <FormGroup {...this.props}
                    onChange={this.handleChange.bind(this, 'Age')}
                    name="Age" />
                <fieldset>
                    <SpeciesEditor {...this.props}
                        onChange={this.handleSpeciesChange}
                        modelState={this.getModelState('Species')}
                        model={this.props.model.Species}
                        prefix={this.joinPrefixes(this.props.prefix, 'Species')}
                        schema={schemas.Species} />
                </fieldset>
            </div>
        );
    }
});

export let SomeForm = React.createClass({
    mixins: [schemaLoaderMixin('Person'), validationMixin],
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
        let updatedModel = update(this.state.model, {
            Pets: { $push: [{ Name: '', Species: { Name: 'Olá' } }] }
        });

        this.setStateAndValidate({
            model: updatedModel
        });
    },
    handleChange(name, value) {
        let updatedModel = update(this.state.model, {
            $merge: { [name]: value }
        });

        this.setStateAndValidate({
            model: updatedModel
        });
    },
    handlePetChange(petIndex, changedProp, newValue) {

        let updatedModel = update(this.state.model, {
            Pets: {
                [petIndex]: {
                    $merge: { [changedProp]: newValue }
                }
            }
        });

        this.setStateAndValidate({
            model: updatedModel
        });
    },
    renderPets() {
        return _.map(this.state.model.Pets, (p, i) =>
            <PetEditor
                modelState={this.getModelState('Pets')[i]}
                model={p}
                onChange={this.handlePetChange.bind(this, i)}
                key={`Pets[${i}]`}
                prefix={`Pets[${i}]`}
                schema={schemas.Pet} />);
    },
    handleSubmit(e) {
        if (!this.state.valid) {
            e.preventDefault();
        }

        console.log(this.state.model);
    },
    render() {
        return (
            <form noValidate onSubmit={this.handleSubmit}>
                <fieldset>
                    <FormGroup {...this.state}
                        onChange={this.handleChange.bind(this, 'Name')}
                        name="Name" />
                    <FormGroup {...this.state}
                        onChange={this.handleChange.bind(this, 'Email')}
                        name="Email" />

                    <fieldset>
                        {this.renderPets()}

                        <button type="button" onClick={this.addPet}>
                            Adicionar animal de estimação
                        </button>
                    </fieldset>
                    <ValidationMessage {...this.state} name="Pets" />
                </fieldset>
                <button type="submit" disabled={!this.state.valid}>Submeter</button>
            </form>
        );
    }
});
