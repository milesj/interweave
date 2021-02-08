import { MatchCallback, MatchResponse } from './types';

/**
 * Trigger the actual pattern match and package the matched
 * response through a callback.
 */
export default function match<T>(
  string: string,
  pattern: RegExp | string,
  callback: MatchCallback<T>,
  isVoid: boolean = false,
): MatchResponse<T> | null {
  const matches = string.match(pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i'));

  if (!matches) {
    return null;
  }

  return {
    match: matches[0],
    void: isVoid,
    ...callback(matches),
    index: matches.index!,
    length: matches[0].length,
    valid: true,
  };
}
