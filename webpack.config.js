const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './tests/bundle.tsx'),
  mode: 'development',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(t|j)sx?$/,
        use: 'babel-loader',
      },
    ],
  },
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'tests'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
};
