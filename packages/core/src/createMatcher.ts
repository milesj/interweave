import React from 'react';

export type Node = NonNullable<React.ReactNode>;

export type ElementFactory<Match, Props> = (
  content: Node,
  match: Match,
  props: Props,
) => React.ReactElement;

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

export interface Matcher<Match, Props> {
  factory: ElementFactory<Match, Props>;
  greedy: boolean;
  match: MatchHandler<Match, Props>;
}

export type OnMatch<Match, Props> = (result: MatchResult, props: Props) => Match | null;

export interface MatcherOptions<Match, Props> {
  greedy?: boolean;
  tagName: string;
  void?: boolean;
  onAfterParse?: (content: Node[], props: Props) => Node[];
  onBeforeParse?: (content: string, props: Props) => string;
  onMatch: OnMatch<Match, Props>;
}

export default function createMatcher<Match, Props>(
  pattern: string | RegExp,
  options: MatcherOptions<Match, Props>,
  factory: ElementFactory<Match, Props>,
): Matcher<Match, Props> {
  return {
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

      return {
        params,
        ...result,
      };
    },
  };
}
