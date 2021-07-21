import React from 'react';
import { Presentation } from 'emojibase';
import { EmojiDataManager } from 'interweave-emoji';
import { CONTEXT_CLASSNAMES, CONTEXT_MESSAGES } from '../src/constants';
import { Context as EmojiContext } from '../src/Context';
import { Context } from '../src/types';

export const CAT_EMOJI = {
	annotation: 'cat',
	canonical_shortcodes: [':cat:'],
	emoji: '🐈',
	group: 0,
	hexcode: '1F408',
	name: 'CAT',
	order: 0,
	primary_shortcode: ':cat:',
	shortcodes: ['cat'],
	subgroup: 0,
	tags: ['cat'],
	text: '',
	type: 1 as Presentation,
	unicode: '',
	version: 1,
};

export function ContextWrapper({
	children,
	classNames = {},
	messages = {},
}: Partial<Context> & { children?: React.ReactNode }) {
	return (
		<EmojiContext.Provider
			// eslint-disable-next-line react/jsx-no-constructed-context-values, react-perf/jsx-no-new-object-as-prop
			value={{
				classNames: { ...CONTEXT_CLASSNAMES, ...classNames },
				emojiData: EmojiDataManager.getInstance('en'),
				emojiLargeSize: 72,
				emojiPadding: 5,
				emojiPath: '{{hexcode}}',
				emojiSize: 24,
				emojiSource: {
					compact: false,
					locale: 'en',
					version: 'latest',
				},
				messages: { ...CONTEXT_MESSAGES, ...messages },
			}}
		>
			{children}
		</EmojiContext.Provider>
	);
}
