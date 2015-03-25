'use strict';

import { SomeForm } from './some-form.jsx';

let React = window.React;

(function () {
    React.render(React.createElement(SomeForm), document.getElementById('app'));
}());
