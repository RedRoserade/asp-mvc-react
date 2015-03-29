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

let React = window.React;
let { update } = React.addons;

let SpeciesEditor = React.createClass({
    onChange(changedProp, e) {
        this.props.onChange(changedProp, e);
    },
    render() {
        return (
            <FormGroup {...this.props}
                onChange={this.onChange.bind(this, 'Name')}
                name="Name" />
        );
    }
});

let PetEditor = React.createClass({
    mixins: [schemaHelperMixin],
    handleChange(changedProp, evt) {

        this.props.onChange(changedProp, evt.target.value);

        evt.preventDefault();
        evt.stopPropagation();
    },
    handleSpeciesChange(changedProp, evt) {
        this.props.onChange('Species', { [changedProp]: evt.target.value });

        evt.preventDefault();
        evt.stopPropagation();
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
                        modelState={navigateSafely(() => this.props.modelState.Species.propertyErrors) || null}
                        model={this.props.model.Species}
                        prefix={this.joinPrefixes(this.props.prefix, 'Species')}
                        schema={schemas.Species} />
                </fieldset>
            </div>
        );
    }
});

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
            Pets: { $push: [{ Name: '', Species: { Name: 'Olá' } }] }
        });

        this.setState({
            model: updatedModel
        }, this.validate);
    },
    handleChange(e) {
        let name = e.target.name,
            value = e.target.value;

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
        let petModelState = navigateSafely(() => this.state.modelState.Pets.itemErrors) || [];

        return _.map(this.state.model.Pets, (p, i) =>
            <PetEditor
                modelState={petModelState[i]}
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
            <form noValidate onChange={this.handleChange} onSubmit={this.handleSubmit}>

                <FormGroup {...this.state} name="Name" />
                <FormGroup {...this.state} name="Email" />

                <fieldset>
                    {this.renderPets()}

                    <button type="button" onClick={this.addPet}>
                        Adicionar animal de estimação
                    </button>
                </fieldset>
                <button type="submit" disabled={!this.state.valid}>Submeter</button>
            </form>
        );
    }
});
