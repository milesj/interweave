import React from 'react';
import { createMatcher, createTransformer, Element, TagConfig, TAGS } from '.';

export const TOKEN_LOCATIONS = [
	'no tokens',
	'{token}',
	' {token} ',
	'{token} pattern at beginning',
	'pattern at end {token}',
	'pattern in {token} middle',
	'{token} pattern at beginning and end {token}',
	'{token} pattern on {token} all sides {token}',
	'pattern {token} used {token} multiple {token} times',
	'tokens next {token} {token} {token} to each other',
	'token next to {token}, a comma',
	'token by a period {token}.',
	'token after a colon: {token}',
	'token after a\n{token} new line',
	'token before a {token}\n new line',
	'token surrounded by ({token}) parenthesis',
	// 'tokens without {token}{token}{token} spaces',
];

export const SOURCE_PROP = {
	compact: false,
	locale: 'en',
	version: 'latest',
} as const;

export const VALID_EMOJIS = [
	['1F621', '😡', ':enraged:', '>:/'],
	['1F468-200D-1F469-200D-1F467-200D-1F466', '👨‍👩‍👧‍👦', ':family_mwgb:'],
	['1F1FA-1F1F8', '🇺🇸', ':flag_us:'],
	['1F63A', '😺', ':smiling_cat:'],
	['1F3EF', '🏯', ':japanese_castle:'],
	['1F681', '🚁', ':helicopter:'],
	['1F469-200D-2764-FE0F-200D-1F468', '👩‍❤️‍👨', ':couple_mw:'],
	['1F1E7-1F1F4', '🇧🇴', ':flag_bo:'],
	['1F468-200D-1F468-200D-1F466', '👨‍👨‍👦', ':family_mmb:'],
	['1F3C0', '🏀', ':basketball:'],
];

export function createExpectedToken<T>(
	value: T,
	factory: (value: T, count: number) => React.ReactNode,
	index: number,
	join: boolean = false,
): React.ReactNode {
	if (index === 0) {
		return TOKEN_LOCATIONS[0];
	}

	let count = -1;
	const tokens = TOKEN_LOCATIONS[index]
		.split(/({token})/)
		.map((row) => {
			if (row === '{token}') {
				count += 1;

				return factory(value, count);
			}

			return row;
		})
		.filter(Boolean);

	return join ? tokens.join('') : tokens;
}

export const MOCK_MARKUP = `<main role="main">
  Main content
  <div>
    <a href="#">Link</a>
    <span class="foo">String</span>
  </div>
</main>
<aside id="sidebar">
  Sidebar content
</aside>`;

export const MOCK_INVALID_MARKUP = `<div bgcolor="black">
  <font color="red">Outdated font.</font>
  <script type="text/javascript"></script>
  <p align="center">More text <strike>with outdated stuff</strike>.</p>
</div>`;

export const parentConfig: TagConfig = {
	children: [],
	content: 0,
	invalid: [],
	parent: [],
	self: true,
	tagName: 'div',
	type: 0,
	void: false,
	...TAGS.div,
};

export const codeFooMatcher = createMatcher(
	/\[foo]/,
	{
		onMatch: () => ({
			match: 'foo',
			customprop: 'foo',
		}),
		tagName: 'span',
	},
	(params, props, children, key) => (
		<Element key={key} customprop={params.customprop} tagName="span">
			{String(children).toUpperCase()}
		</Element>
	),
);

export const codeBarMatcher = createMatcher(
	/\[bar]/,
	{
		onMatch: () => ({
			match: 'bar',
			customprop: 'bar',
		}),
		tagName: 'span',
	},
	(params, props, children, key) => (
		<Element key={key} customprop={params.customprop} tagName="span">
			{String(children).toUpperCase()}
		</Element>
	),
);

export const codeBazMatcher = createMatcher(
	/\[baz]/,
	{
		onMatch: () => ({
			match: 'baz',
			customprop: 'baz',
		}),
		tagName: 'span',
	},
	(params, props, children, key) => (
		<Element key={key} customprop={params.customprop} tagName="span">
			{String(children).toUpperCase()}
		</Element>
	),
);

export const mdBoldMatcher = createMatcher(
	/\*\*([^*]+)\*\*/u,
	{
		onMatch: ({ matches }) => ({
			match: matches[1],
		}),
		tagName: 'b',
	},
	(params, props, children, key) => <b key={key}>{children}</b>,
);

export const mdItalicMatcher = createMatcher(
	/_([^_]+)_/u,
	{
		onMatch: ({ matches }) => ({
			match: matches[1],
		}),
		tagName: 'i',
	},
	(params, props, children, key) => <i key={key}>{children}</i>,
);

export const mockMatcher = createMatcher(
	/div/,
	{
		onMatch: () => null,
		tagName: 'div',
	},
	(params, props, children, key) => (
		<div {...props} key={key}>
			{children}
		</div>
	),
);

export const linkTransformer = createTransformer('a', (element) => {
	element.setAttribute('target', '_blank');

	const href = element.getAttribute('href');

	if (href) {
		element.setAttribute('href', href.replace('foo.com', 'bar.net') || '');
	}
});

export const mockTransformer = createTransformer('*', () => {});
