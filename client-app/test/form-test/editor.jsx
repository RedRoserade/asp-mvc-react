'use strict';
let React = window.React;

export let Editor = React.createClass({
    render() {
        let { schema } = this.props;
        let propAttributes = this.props.prop(schema);
        // let validationResult = this.props.prop(this.props.model);

        return (
            <input type="text" placeholder={propAttributes.placeholder} />
        );
    }
});
