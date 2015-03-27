'use strict';

let React = window.React;
let { Children } = React;

// function findChildren(children, name) {
//     let result = [];
//
//     Children.forEach(children, (child) {
//
//     });
// }

export let Fieldset = React.createClass({
    getDefaultProps() {
        return {
            prefix: ''
        };
    },
    render() {
        let children = Children.map(this.props.children, (child) => {
            var newProps = {};

            if (this.props.prefix) {
                newProps.prefix = this.props.prefix;
            }

            if (this.props.schema) {
                newProps.schema = this.props.schema;
            }

            return React.addons.cloneWithProps(child, newProps);
        });

        return (
            <div>{children}</div>
        );
    }
});
