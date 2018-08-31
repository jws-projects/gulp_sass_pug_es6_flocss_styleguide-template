const path = require('path');

module.exports = {
  mode: 'production',
  entry: ['babel-polyfill', './_src/assets/es/main.js'],
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '_dist/assets/js')
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
