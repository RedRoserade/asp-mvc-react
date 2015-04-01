'use strict';

let React = window.React;
let { update } = React.addons;

let ChangeMixin = {
    bindChange(name) {
        return function (value) {
            let updatedModel = update(this.props.model, {
                $merge: {
                    [name]: value
                }
            });

            this.props.onChange(updatedModel);
        };
    }
};
export default ChangeMixin;
