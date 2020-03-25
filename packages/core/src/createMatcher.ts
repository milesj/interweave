import React from 'react';

export type ElementFactory<Match, Props> = (
  content: NonNullable<React.ReactNode>,
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

export type MatchHandler<Match> = (value: string) => (MatchResult & { params: Match }) | null;

export interface Matcher<Match, Props> {
  factory: ElementFactory<Match, Props>;
  greedy: boolean;
  match: MatchHandler<Match>;
}

export type OnMatch<T> = (result: MatchResult) => T | null;

export interface MatcherOptions<Match> {
  greedy?: boolean;
  tagName: string;
  void?: boolean;
  // onAfterParse?: (content: Node[], props: Props) => Node[];
  // onBeforeParse?: (content: string, props: Props) => string;
  onMatch: OnMatch<Match>;
}

export default function createMatcher<Match, Props>(
  pattern: string | RegExp,
  options: MatcherOptions<Match>,
  factory: ElementFactory<Match, Props>,
): Matcher<Match, Props> {
  return {
    factory,
    greedy: options.greedy ?? false,
    match(value) {
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
      const params = options.onMatch(result);

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
