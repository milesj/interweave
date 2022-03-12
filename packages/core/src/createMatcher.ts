import { CommonInternals, Node, OnAfterParse, OnBeforeParse, TagName } from './types';

export type OnMatch<Match, Props, Options = {}> = (
	result: MatchResult,
	props: Props,
	options: Partial<Options>,
) => Match | null;

export interface MatchResult {
	index: number;
	length: number;
	match: string;
	matches: string[];
	valid: boolean;
	value: string;
	void: boolean;
}

export type MatchHandler<Match, Props> = (
	value: string,
	props: Props,
) => (MatchResult & { params: Match }) | null;

export interface MatcherOptions<Match, Props, Options = {}> {
	greedy?: boolean;
	tagName: TagName;
	void?: boolean;
	options?: Options;
	onAfterParse?: OnAfterParse<Props>;
	onBeforeParse?: OnBeforeParse<Props>;
	onMatch: OnMatch<Match, Props, Options>;
}

export type MatcherFactory<Match, Props> = (
	match: Match,
	props: Props,
	content: Node,
) => React.ReactElement;

export interface Matcher<Match, Props, Options = {}> extends CommonInternals<Props, Options> {
	extend: (
		factory?: MatcherFactory<Match, Props> | null,
		options?: Partial<MatcherOptions<Match, Props, Options>>,
	) => Matcher<Match, Props, Options>;
	factory: MatcherFactory<Match, Props>;
	greedy: boolean;
	match: MatchHandler<Match, Props>;
	tagName: TagName;
}

export function createMatcher<Match, Props = {}, Options = {}>(
	pattern: RegExp | string,
	factory: MatcherFactory<Match, Props>,
	options: MatcherOptions<Match, Props, Options>,
): Matcher<Match, Props, Options> {
	return {
		extend(customFactory, customOptions) {
			return createMatcher(pattern, customFactory ?? factory, {
				...options,
				...customOptions,
			});
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

			const params = options.onMatch(result, props, options.options ?? {});

			// Allow callback to intercept the result
			if (params === null) {
				return null;
			}

			return {
				params,
				...result,
			};
		},
		onAfterParse: options.onAfterParse,
		onBeforeParse: options.onBeforeParse,
		options: options.options ?? {},
		tagName: options.tagName,
	};
}
