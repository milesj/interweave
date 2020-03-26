import { Matcher, MatcherOptions, MatcherFactory, MatchResult } from './types';

export default function createMatcher<Match, Props, Options = {}>(
  pattern: string | RegExp,
  factory: MatcherFactory<Match, Props>,
  options: MatcherOptions<Match, Props, Options>,
): Matcher<Match, Props, Options> {
  return {
    extend(customFactory, customOptions) {
      return createMatcher(pattern, customFactory, {
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

      const params = options.onMatch(result, props, options.options || {});

      // Allow callback to intercept the result
      if (params === null) {
        return null;
      }

      return {
        params,
        ...result,
      };
    },
    options: options.options || {},
    tagName: options.tagName,
  };
}
