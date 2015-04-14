'use strict';

import React from 'react/addons';
import { ChangeMixin } from '../mixins';

const { cloneWithProps } = React.addons;

let Form = React.createClass({
    mixins: [ChangeMixin],
    render() {
        const updatedChildren = React.Children.map(this.props.children, c => {
            return cloneWithProps(c, {
                model: this.props.model,
                onChange: c.props.onChange || this.bindChange(c.props.name),
                key: c.props.key
            });
        });

        return (
            <form>
                {updatedChildren}
            </form>
        );
    }
});
export default Form;
