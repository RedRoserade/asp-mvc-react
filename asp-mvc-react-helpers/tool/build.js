'use strict';

import buildNpm from './lib';

var result = Promise.all([
    buildNpm()
]);

result
    .then(() => console.log('Build successful.'))
    .catch(err => {
        console.error(err.toString());
        throw err;
    });
