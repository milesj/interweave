import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const packages = ['autolink', 'core', 'emoji', 'emoji-picker', 'ssr'];

const plugins = [
  resolve({ extensions }),
  babel({
    exclude: 'node_modules/**',
    extensions,
  }),
];

const external = [
  'emojibase-regex',
  'emojibase-regex/emoticon',
  'emojibase-regex/shortcode',
  'emojibase',
  'escape-html',
  'interweave',
  'interweave-emoji',
  'lodash',
  'lodash/camelCase',
  'lodash/chunk',
  'lodash/debounce',
  'lodash/upperFirst',
  'parse5',
  'parse5/lib/tree-adapters/default',
  'prop-types',
  'react-window',
  'react',
  'style-parser',
];

export default packages
  .map(pkg => ({
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
  }))
  .concat({
    external: external.concat('./index'),
    input: `packages/core/src/testing.tsx`,
    output: [
      {
        file: `packages/core/lib/testing.js`,
        format: 'cjs',
      },
      {
        file: `packages/core/esm/testing.js`,
        format: 'esm',
      },
    ],
    plugins,
  });
