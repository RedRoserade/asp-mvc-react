/*global React, validateAsync, _*/

'use strict';

let update = React.addons.update;

var propValidationMixin = function() {
    function getValidationMessage(propName) {
        if (!this.props || this.props.validationState === null) {
            throw new Error(`No validationState prop defined on ${this.constructor.displayName}`);
        }

        return this.props.validationState[propName];
    }

    function getContentValidationState(propName) {
        let valState = this.props.validationState;
        let propState = valState[propName];

        return _.find(propState, (v) => _.isArray(v)) || propState;
    }

    return { getValidationMessage, getContentValidationState };
};

var validatingMixin = function (validatorFunction, schemaName) {

    var dirtyProps = {};

    function isPropPristine(propName) {
        return !dirtyProps[propName];
    }

    function setStateAndValidate(stateChange, cb = function () {}) {
        let newState = update(this.state, { $merge: stateChange });

        validatorFunction(newState, schemaName, (err, result) => {

            for (var prop in stateChange) {
                if (stateChange.hasOwnProperty(prop)) { dirtyProps[prop] = true; }
            }

            if (err) { cb(err, null); }

            let validatedState = update(newState, {
                isValid: { $set: result.valid },
                validationState: {
                    $set: result.validationResult
                }
            });

            console.log(validatedState);

            this.setState(validatedState, cb);
        });
    }

    function getValidationMessage(propName) {
        let s = this.state || {};

        if (!s.validationState || isPropPristine(propName)) { return []; }

        if (_.isArray(this.state[propName])) {
            return _.filter(this.state.validationState[propName], (v) => !_.isArray(v));
        }

        return this.state.validationState[propName];
    }

    function getContentValidationState(propName) {
        var valState = this.state.validationState || this.props.validationState;

        let propState = valState[propName];

        return _.find(propState, (v) => _.isArray(v));
    }

    return { getContentValidationState, isPropPristine, setStateAndValidate, getValidationMessage };
};

var PersonForm = React.createClass({
    mixins: [validatingMixin(validateAsync, 'Person')],
    getInitialState() {
        return {

        };
    },

    componentDidMount() {
        this.setStateAndValidate({});
    },

    onChange(prop, f, value) {
        this.setStateAndValidate({ [prop]: f(value) });
    },

    addPet() {
        var newPets = update(this.state.Pets || [], { $push: [{ Name: '', Species: { Name: '' } }] });

        this.setStateAndValidate({
            Pets: newPets
        });
    },

    removePet(pet) {
        this.setStateAndValidate({
            Pets: _.without(this.state.Pets, pet)
        });
    },

    onPetChanged(i, petChange) {
        let p = this.state.Pets[i];

        for (let changedProp in petChange) {
            if (petChange.hasOwnProperty(changedProp)) {
                p[changedProp] = petChange[changedProp];
            }
        }

        this.setStateAndValidate({
            Pets: this.state.Pets
        });
    },

    render() {
        return (
            <form noValidate="true">
                <div>
                    <input type="text" value={this.state.Name} placeholder="Nome"
                        onChange={this.onChange.bind(this, 'Name', (e) => e.target.value)} />
                    <p>{this.getValidationMessage('Name')}</p>
                </div>

                <div>
                    <input type="email" value={this.state.Email} placeholder="Email"
                        onChange={this.onChange.bind(this, 'Email', (e) => e.target.value)} />
                    <p>{this.getValidationMessage('Email')}</p>
                </div>

                <div>
                    <h4>Animais de estimação</h4>
                    <button type="button" onClick={this.addPet}>Add</button>

                    {_.map(this.state.Pets, (p, i) => {
                        return (
                            <PetForm pet={p} key={i} prefix={`Pets[${i}]`}
                                validationState={this.getContentValidationState('Pets')[i]}
                                onChange={this.onPetChanged.bind(this, i)}
                                onDelete={this.removePet.bind(this, p)} />
                        );
                    })}

                    <p>{this.getValidationMessage('Pets')}</p>
                </div>
            </form>
        );
    }
});

var PetForm = React.createClass({
    mixins: [propValidationMixin()],
    handleChange(propName, e) {
        this.props.onChange({ [propName]: e.target.value });
    },
    render() {
        return (
            <div>
                <div>
                    <input type="text" value={this.props.pet.Name} onChange={this.handleChange.bind(this, 'Name')} />
                    <p>{this.getValidationMessage('Name')}</p>
                </div>

                <PetForm.SpeciesForm
                    species={this.props.Species}
                    validationState={this.getContentValidationState('Species')}
                    onChange={this.handleChange.bind(this, 'Species')} />

                <button type="button" onClick={this.props.onDelete}>Remove</button>
            </div>
        );
    }
});
PersonForm.PetForm = PetForm;

var SpeciesForm = React.createClass({
    mixins: [propValidationMixin()],
    handleChange(propName, e) {
        this.props.onChange({ [propName]: e.target.value });
    },
    render() {
        return (
            <div>
                <input type="text"
                    placeholder="Espécie"
                    onChange={this.handleChange.bind(this, 'Name')} />
                {<p>{this.getValidationMessage('Name')}</p>}
            </div>
        );
    }
});
PetForm.SpeciesForm = SpeciesForm;

React.render(React.createElement(PersonForm), document.getElementById('app'));
