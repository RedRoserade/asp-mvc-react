'use strict';

import React from 'react/addons';

import { components } from '../../src';

const { update } = React.addons;

const {
    Editor,
    Form
} = components;

class Pet {
    constructor() {
        this.name = '';
        this.children = [];
    }
}

let somePerson = {
    name: 'André',
    age: 5,
    pets: []
};

const PetEditor = React.createClass({
    render() {
        return (
            <div>

            </div>
        );
    }
});

const BasicForm = React.createClass({
    getInitialState() {
        return {
            model: somePerson
        };
    },
    handleChange(model) {
        this.setState({ model });
    },
    addPet() {
        const updatedModel = update(this.state.model, {
            pets: {
                $push: [new Pet()]
            }
        });

        this.setState({
            model: updatedModel
        });
    },
    render() {
        const { model } = this.state;
        return (
            <Form onChange={this.handleChange} model={model}>
                <Editor name="name" />
                <Editor name="age" />
                {model.pets.map((p, i) => <PetEditor key={i} pet={p} />)}
                <button type="button" onClick={this.addPet}>Add pet</button>
            </Form>
        );
    }
});

React.render(
    React.createElement(BasicForm),
    document.getElementById('app')
);
