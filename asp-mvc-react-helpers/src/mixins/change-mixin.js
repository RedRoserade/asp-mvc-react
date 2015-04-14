'use strict';

import React from 'react/addons';
let { update } = React.addons;

let ChangeMixin = {
    bindChange(name) {
        return function (value) {
            const updatedModel = update(this.props.model, {
                $merge: {
                    [name]: value
                }
            });

            this.props.onChange(updatedModel);
        }.bind(this); // I don't know why a => doesn't work here
    }
};
export default ChangeMixin;
