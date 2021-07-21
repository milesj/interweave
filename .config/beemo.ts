export default {
	module: '@beemo/dev',
	drivers: [
		['babel', { configStrategy: 'none' }],
		'eslint',
		'jest',
		'prettier',
		[
			'typescript',
			{
				buildFolder: 'dts',
				declarationOnly: true,
			},
		],
	],
	settings: {
		react: true,
	},
	// eslint: {
	//   extends: ['plugin:rut/recommended'],
	//   ignore: ['website/'],
	//   rules: {
	//     'no-use-before-define': 'off',
	//     'import/no-named-as-default': 'off',
	//     'require-unicode-regexp': 'off',
	//     'react/jsx-no-literals': 'off',
	//     'react/no-unused-prop-types': 'off',
	//     'react/default-props-match-prop-types': 'off',
	//     '@typescript-eslint/camelcase': 'off',
	//   },
	// },
	// jest: {
	//   setupFilesAfterEnv: ['jest-rut'],
	//   testEnvironment: 'jsdom',
	//   timers: 'real',
	// },
};
