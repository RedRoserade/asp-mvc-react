module.exports = {
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel' },
            { test: /\.jsx$/, loader: 'babel' }
        ]
    }
};
