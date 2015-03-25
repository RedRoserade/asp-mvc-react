'use strict';

var path = require('path');

module.exports = {
    entry: './lib/validator.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'validator.js'
    },
    module: {
        loaders: [
            { test: /\.js/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    }
};
