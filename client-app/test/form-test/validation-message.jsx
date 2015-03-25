'use strict';
let React = window.React;

export let ValidationMessage = React.createClass({
    render() {
        let validationResult = this.props.prop(this.props.modelState);

        return (
            <ul>
                {validationResult.validationErrors.map(e => <li key={e}>{e}</li>)}
            </ul>
        );
    }
});
