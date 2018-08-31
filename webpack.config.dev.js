const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: ['babel-polyfill', './_src/assets/es/main.js'],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '_dev/assets/js')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
};
