'use strict';

var path = require('path');

module.exports = {
    entry: {
        basicTests: './basic-tests',
        formTests: './form-test/form-tests'
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].build.js'
    },
    module: {
        loaders: [
            { test: /\.js/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
    },
    resolve: {
        alias: {
            validator: path.join(__dirname, '../lib', 'validator.js')
        }
    }
};
