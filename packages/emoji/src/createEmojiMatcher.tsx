import React from 'react';
import { createMatcher, MatcherFactory, Node, OnMatch } from 'interweave';
import { Emoji } from './Emoji';
import { EmojiMatch, EmojiProps, InterweaveEmojiProps } from './types';

function factory(match: EmojiMatch, { emojiSource }: InterweaveEmojiProps) {
	return <Emoji {...match} emojiSource={emojiSource} />;
}

function onBeforeParse(content: string, { emojiSource }: InterweaveEmojiProps): string {
	if (__DEV__ && !emojiSource) {
		throw new Error(
			'Missing emoji source data. Have you loaded with the `useEmojiData` hook and passed the `emojiSource` prop?',
		);
	}

	return content;
}

function onAfterParse(node: Node, { emojiEnlargeThreshold = 1 }: InterweaveEmojiProps): Node {
	const content = React.Children.toArray(node);

	if (content.length === 0) {
		return content;
	}

	let valid = false;
	let count = 0;

	// Use a for-loop, as it's much cleaner than some()
	for (const item of content) {
		if (typeof item === 'string') {
			// Allow whitespace but disallow strings
			if (!item.match(/^\s+$/)) {
				valid = false;
				break;
			}
		} else if (React.isValidElement(item)) {
			// Only count towards emojis
			if (item && item.type === Emoji) {
				count += 1;
				valid = true;

				if (count > emojiEnlargeThreshold) {
					valid = false;
					break;
				}

				// Abort early for non-emoji components
			} else {
				valid = false;
				break;
			}
		} else {
			valid = false;
			break;
		}
	}

	if (!valid) {
		return content;
	}

	return content.map((item) => {
		if (!React.isValidElement<EmojiProps>(item)) {
			return item;
		}

		return React.cloneElement(item, {
			...item.props,
			emojiEnlarged: true,
		});
	});
}

export function createEmojiMatcher(
	pattern: RegExp,
	onMatch: OnMatch<EmojiMatch, InterweaveEmojiProps>,
	customFactory: MatcherFactory<EmojiMatch, InterweaveEmojiProps> = factory,
) {
	return createMatcher<EmojiMatch, InterweaveEmojiProps>(
		pattern,
		{
			greedy: true,
			onAfterParse,
			onBeforeParse,
			onMatch,
			tagName: 'img',
			void: true,
		},
		customFactory,
	);
}
