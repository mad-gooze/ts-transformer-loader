var path = require('path');
var webpack = require('webpack');
const ts = require('typescript');
require('ts-node/register');

var config = {
    context: __dirname, // Paths are relative to nengo_gui
    // Putting the entry point in a list is a workaround for this error:
    // Error: a dependency to an entry point is not allowed
    entry: {
        index: './index.ts',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        publicPath: '/dist/', // Fixes issue finding emitted files
    },
    resolve: {
        extensions: ['.js', '.json', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                use: [
                    'babel-loader',
                    {
                        loader: require.resolve('../src/index'),
                        options: {
                            getTransformers: require('./getTransformers'),
                            // pass a string if you are using thread-loader
                            // see https://github.com/s-panferov/awesome-typescript-loader/pull/531/files
                            // getTransformers: require('./getTransformers'),
                        },
                    },
                ],
            },
        ],
    },
    plugins: [],
    mode: 'development',
    devtool: 'source-map',
};

module.exports = env => {
    return config;
};
