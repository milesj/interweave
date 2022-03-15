import React from 'react';
import {
	createMatcher,
	MatcherFactory,
	MatcherFactoryData,
	Node,
	OnMatch,
	InterweaveProps,
} from 'interweave';
import { Emoji } from './Emoji';
import { EmojiConfig, EmojiMatch } from './types';

function factory({
	config,
	params,
	props: { emojiSource },
}: MatcherFactoryData<EmojiMatch, InterweaveProps, EmojiConfig>) {
	return <Emoji {...config} {...params} source={emojiSource} />;
}

function onBeforeParse(content: string, { emojiSource }: InterweaveProps): string {
	if (__DEV__ && !emojiSource) {
		throw new Error(
			'Missing emoji source data. Have you loaded with the `useEmojiData` hook and passed the `emojiSource` prop?',
		);
	}

	return content;
}

function onAfterParse(node: Node, { emojiEnlargeThreshold = 1 }: InterweaveProps): Node {
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
		if (!React.isValidElement(item)) {
			return item;
		}

		return React.cloneElement(item, {
			...item.props,
			enlarge: true,
		});
	});
}

export function createEmojiMatcher(
	pattern: RegExp,
	onMatch: OnMatch<EmojiMatch, InterweaveProps>,
	customFactory: MatcherFactory<EmojiMatch, InterweaveProps, EmojiConfig> = factory,
) {
	return createMatcher<EmojiMatch, InterweaveProps, EmojiConfig>(pattern, customFactory, {
		config: {
			largeSize: '3em',
			renderUnicode: false,
			size: '1em',
		},
		greedy: true,
		onAfterParse,
		onBeforeParse,
		onMatch,
		tagName: 'img',
		void: true,
	});
}
