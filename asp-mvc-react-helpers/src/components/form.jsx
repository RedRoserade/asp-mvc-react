'use strict';

import React from 'react';

let Form = React.createClass({
    render() {
        return (
            <form>
                {this.props.children}
            </form>
        );
    }
});
export default Form;
