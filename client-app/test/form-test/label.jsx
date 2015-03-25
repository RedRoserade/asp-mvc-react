'use strict';
let React = window.React;

export let Label = React.createClass({
    render() {
        let { schema } = this.props;

        return <label>{this.props.prop(schema).label}</label>;
    }
});
