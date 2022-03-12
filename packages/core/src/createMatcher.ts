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

export type OnMatch<
	Match extends MatchParams,
	Props extends object,
	Options extends object = {},
> = (result: MatchResult, props: Props, options: Partial<Options>) => Match | null;

export interface MatcherOptions<
	Match extends MatchParams,
	Props extends object,
	Options extends object = {},
> {
	greedy?: boolean;
	tagName: TagName;
	void?: boolean;
	options?: Options;
	onAfterParse?: OnAfterParse<Props>;
	onBeforeParse?: OnBeforeParse<Props>;
	onMatch: OnMatch<Match, Props, Options>;
}

export type MatcherFactory<Match extends MatchParams, Props extends object> = (
	params: Match,
	props: Props,
	children: Node | null,
	key: number,
) => React.ReactElement;

export interface Matcher<
	Match extends MatchParams,
	Props extends object,
	Options extends object = {},
> extends CommonInternals<Props, Options> {
	extend: (
		factory?: MatcherFactory<Match, Props> | null,
		options?: Partial<MatcherOptions<Match, Props, Options>>,
	) => Matcher<Match, Props, Options>;
	factory: MatcherFactory<Match, Props>;
	greedy: boolean;
	match: (value: string, props: Props) => (MatchResult & { params: Match }) | null;
	tagName: TagName;
}

export function createMatcher<
	Match extends MatchParams,
	Props extends object = {},
	Options extends object = {},
>(
	pattern: RegExp | string,
	options: MatcherOptions<Match, Props, Options>,
	factory: MatcherFactory<Match, Props>,
): Matcher<Match, Props, Options> {
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

			const params = options.onMatch(result, props, options.options ?? {});

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
		options: options.options ?? {},
		tagName: options.tagName,
	};
}
