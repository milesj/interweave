import { CommonInternals, Node, OnAfterParse, OnBeforeParse, TagName } from './types';

// Result from the match process
export interface MatchResult {
	index: number;
	length: number;
	match: string;
	matches: string[];
	valid: boolean;
	value: string;
	void: boolean;
}

// Params returned from `onMatch` that are passed to the factory
export interface MatchParams {
	[key: string]: unknown;
	match?: string;
}

export type OnMatch<Match extends MatchParams> = <Props extends object>(
	result: MatchResult,
	props: Props,
) => Match | null;

export interface MatcherOptions<Match extends MatchParams> {
	greedy?: boolean;
	tagName: TagName;
	void?: boolean;
	onAfterParse?: OnAfterParse;
	onBeforeParse?: OnBeforeParse;
	onMatch: OnMatch<Match>;
}

export type MatcherFactory<Match extends MatchParams> = <Props extends object>(
	params: Match,
	props: Props,
	children: Node | null,
	key: number,
) => React.ReactElement;

export interface Matcher<Match extends MatchParams> extends CommonInternals {
	extend: (
		factory?: MatcherFactory<Match> | null,
		options?: Partial<MatcherOptions<Match>>,
	) => Matcher<Match>;
	factory: MatcherFactory<Match>;
	greedy: boolean;
	match: <Props extends object>(
		value: string,
		props: Props,
	) => (MatchResult & { params: Match }) | null;
	tagName: TagName;
}

export function createMatcher<Match extends MatchParams>(
	pattern: RegExp | string,
	options: MatcherOptions<Match>,
	factory: MatcherFactory<Match>,
): Matcher<Match> {
	return {
		extend(customFactory, customOptions) {
			return createMatcher(
				pattern,
				{
					...options,
					...customOptions,
				},
				customFactory ?? factory,
			);
		},
		factory,
		greedy: options.greedy ?? false,
		match(value, props) {
			const matches = value.match(pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i'));

			if (!matches) {
				return null;
			}

			const result: MatchResult = {
				index: matches.index!,
				length: matches[0].length,
				match: matches[0],
				matches,
				valid: true,
				value,
				void: options.void ?? false,
			};

			const params = options.onMatch(result, props);

			// Allow callback to intercept the result
			if (params === null) {
				return null;
			}

			// Allow callback to replace the matched content
			if ('match' in params && params.match) {
				result.match = params.match;
			}

			return {
				params,
				...result,
			};
		},
		onAfterParse: options.onAfterParse,
		onBeforeParse: options.onBeforeParse,
		tagName: options.tagName,
	};
}
