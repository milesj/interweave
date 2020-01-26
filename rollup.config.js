import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const packages = ['autolink', 'core', 'emoji', 'emoji-picker'];

const plugins = [
  resolve({ extensions }),
  babel({
    exclude: 'node_modules/**',
    extensions,
  }),
];

const external = [
  'emojibase-regex',
  'emojibase',
  'escape-html',
  'interweave',
  'lodash',
  'prop-types',
  'react-window',
  'react',
];

export default packages.map(pkg => ({
  external,
  input: `packages/${pkg}/src/index.ts`,
  output: [
    {
      file: `packages/${pkg}/lib/index.js`,
      format: 'cjs',
    },
    {
      file: `packages/${pkg}/esm/index.js`,
      format: 'esm',
    },
  ],
  plugins,
}));
