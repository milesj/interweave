import { MatchCallback, MatchResponse } from './types';

/**
 * Trigger the actual pattern match and package the matched
 * response through a callback.
 */
export function match<T>(
	string: string,
	pattern: RegExp | string,
	process: MatchCallback<T>,
	isVoid: boolean = false,
): MatchResponse<T> | null {
	const matches = string.match(pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i'));

	if (!matches) {
		return null;
	}

	return {
		match: matches[0],
		void: isVoid,
		...process(matches),
		index: matches.index!,
		length: matches[0].length,
		valid: true,
	};
}
