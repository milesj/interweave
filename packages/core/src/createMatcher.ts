import {
	CommonInternals,
	Node,
	OnAfterParse,
	OnBeforeParse,
	PassthroughProps,
	TagName,
} from './types';

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

export type OnMatch<Match extends MatchParams, Props extends object> = (
	result: MatchResult,
	props: Props,
) => Match | null;

export interface MatcherOptions<
	Match extends MatchParams,
	Props extends object,
	Config extends object,
> extends CommonInternals<Props, Config> {
	greedy?: boolean;
	tagName: TagName;
	void?: boolean;
	onMatch: OnMatch<Match, Props>;
}

export type MatcherFactoryData<
	Match extends MatchParams,
	Props extends object,
	Config extends object,
> = {
	config: Config;
	params: Match;
	props: Props;
};

export type MatcherFactory<
	Match extends MatchParams,
	Props extends object,
	Config extends object,
> = (
	data: MatcherFactoryData<Match, Props, Config>,
	children: Node | null,
	key: number,
) => React.ReactElement;

export interface Matcher<Match extends MatchParams, Props extends object, Config extends object>
	extends CommonInternals<Props, Config> {
	extend: (
		config?: Partial<Config>,
		factory?: MatcherFactory<Match, Props, Config> | null,
	) => Matcher<Match, Props, Config>;
	factory: MatcherFactory<Match, Props, Config>;
	greedy: boolean;
	match: (value: string, props: Props) => (MatchResult & { params: Match }) | null;
	tagName: TagName;
}

export function createMatcher<
	Match extends MatchParams,
	Props extends object = PassthroughProps,
	Config extends object = {},
>(
	pattern: RegExp | string,
	factory: MatcherFactory<Match, Props, Config>,
	options: MatcherOptions<Match, Props, Config>,
): Matcher<Match, Props, Config> {
	return {
		config: options.config,
		extend(customConfig, customFactory) {
			return createMatcher(pattern, customFactory ?? factory, {
				...options,
				config: {
					...(options.config as Config),
					...customConfig,
				},
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
