import path from 'path';
import externals from 'rollup-plugin-node-externals';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

// Order is imporant!
const packages = ['core', 'autolink', 'emoji', 'emoji-picker', 'ssr'];

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const plugins = [
  resolve({ extensions }),
  babel({
    exclude: 'node_modules/**',
    extensions,
  }),
];

export default packages
  .map(pkg => ({
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
    plugins: [
      externals({
        deps: true,
        packagePath: path.resolve(`packages/${pkg}/package.json`),
      }),
      ...plugins,
    ],
  }))
  .concat({
    external: ['react', './index'],
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
