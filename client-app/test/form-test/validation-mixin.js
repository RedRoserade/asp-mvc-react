'use strict';

import _ from 'underscore';

export let validationMixin = {
    isValidField(name) {
        let { modelState } = this.state || this.props;

        if (!modelState || !modelState[name]) {
            return true;
        }

        return modelState[name].valid;
    },

    validationMessageFor(name) {
        let { modelState/*, prefix*/ } = this.state || this.props;

        // prefix = prefix ? prefix + '.' : '';

        if (!modelState || !modelState[/*prefix + */name]) {
            return [];
        }

        let errors = modelState[/*prefix + */name];

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
