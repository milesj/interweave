import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: './packages/autolink/src/index.ts',
  output: [
    {
      file: 'dist/cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/esm.js',
      format: 'es',
    },
  ],
  external: ['interweave', 'react'],
  plugins: [resolve({ extensions }), cjs(), json(), babel({ extensions })],
};
