# ts-transformer-loader

`ts-transformer-loader` applies custom typescript transformers in webpack.
It can be used with babel-loader with @babel/preset-typescript.

## Install
```shell
npm install -D ts-transformer-loader
```

## Configure
webpack.config.js:
```js
module: {
  rules: [
    {
      test: /\.(j|t)sx?$/,
      use: [
        'babel-loader',
        {
          loader: 'ts-transformer-loader',
          options: {
            getTransformers: require('./getTransformers'),
            // pass a string if you are using thread-loader
            // see https://github.com/s-panferov/awesome-typescript-loader/pull/531/files
            // getTransformers: require.resolve('./getTransformers'),
          },
        },
      ],
    },
  ],
  ...
}
```
See [example](/example).
