'use strict';

/**
 * Returns the union of all the arrays.
 * @param {array} arrays
 * @returns {array}
 */
function arrayUnion(...arrays) {
    let result = [];

    for (let i = 0; i < arrays.length; i++) {
        result = result.concat(arrays[i] || []);
    }

    return result;
}

let ValidationMixin = {
    isValidField(name) {
        let { modelState } = this.state || this.props;

        if (!modelState || !modelState[name]) {
            return true;
        }

        return modelState[name].valid;
    },
    /**
     * Returns all the validation messages
     * for the prop with the given name.
     * @param {string} name
     * @returns {array}
     */
    validationMessageFor(name) {
        let { modelState } = this.state || this.props;

        if (!modelState || !modelState[name]) {
            return [];
        }

        let errors = modelState[name];

        return arrayUnion(errors.typeErrors, errors.validationErrors);
    },
    /**
     * Returns the model state of a prop, or an empty object
     * If nothing was found.
     *
     * @param {string} name The name of the prop.
     * @returns {object}
     */
    getModelState(name) {
        let { modelState } = this.state || this.props;

        if (!modelState || !modelState[name]) { return {}; }

        return modelState[name].itemErrors || modelState[name].propertyErrors || {};
    }
};
export default ValidationMixin;
