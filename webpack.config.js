const path = require('path');

module.exports = {
  entry: './tests/bundle.tsx',
  mode: 'development',
  module: {
    rules: [
      {
        exclude: /node_modules/u,
        test: /\.(t|j)sx?$/u,
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
