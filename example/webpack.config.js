var path = require("path");
var webpack = require("webpack");
// require('ts-node/register');
const minifyPrivatesTransformer = require('ts-transformer-minify-privates').default;

var config = {
    context: __dirname, // Paths are relative to nengo_gui
    // Putting the entry point in a list is a workaround for this error:
    // Error: a dependency to an entry point is not allowed
    entry: {
        index: "./index.ts",
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].js",
        publicPath: "/dist/" // Fixes issue finding emitted files
    },
    resolve: {
        extensions: [".js", ".json", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                use: [
                    {
                        loader: 'ts-loader', // or 'awesome-typescript-loader'
                        options: {
                            getCustomTransformers: program => {
                                // console.log('from ts-loader', program.getCompilerOptions());
                                return {};
                                // return {
                                //   before: [
                                //     minifyPrivatesTransformer(program)
                                //   ]
                                // }
                            }
                        }
                    },
                    {
                        loader: require.resolve('..'),
                        options: {
                            getTransformers(program) {
                                return [
                                    minifyPrivatesTransformer(program),
                                ]
                            }
                        }
                    }
                ],
            },
        ]
    },
    plugins: [],
    mode: 'development',
    devtool: false
}

module.exports = (env) => {
    return config;
}
