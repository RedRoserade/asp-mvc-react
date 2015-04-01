'use strict';

import _ from 'underscore';

let ValidationMixin = {
    isValidField(name) {
        let { modelState } = this.state || this.props;

        if (!modelState || !modelState[name]) {
            return true;
        }

        return modelState[name].valid;
    },

    validationMessageFor(name) {
        let { modelState } = this.state || this.props;

        if (!modelState || !modelState[name]) {
            return [];
        }

        let errors = modelState[name];

        return _.union(errors.typeErrors, errors.validationErrors);
    },
    /**
     * Returns the model state of a prop.
     * @param {string} name The name of the prop.
     * @returns {object}
     */
    getModelState(name) {
        let { modelState } = this.state || this.props;

        if (!modelState || !modelState[name]) { return {}; }

        return modelState[name].itemErrors || modelState[name].propertyErrors;
    }
};
export default ValidationMixin;
