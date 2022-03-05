import React from 'react';
import { EmojiDataManager, LATEST_DATASET_VERSION } from 'interweave-emoji';
import { CONTEXT_CLASSNAMES, CONTEXT_MESSAGES } from './constants';
import { Context as ContextType } from './types';

const version = process.env.NODE_ENV === 'test' ? '0.0.0' : LATEST_DATASET_VERSION;

export const Context = React.createContext<ContextType>({
	classNames: CONTEXT_CLASSNAMES,
	emojiData: EmojiDataManager.getInstance('en', version),
	emojiLargeSize: 0,
	emojiPadding: 0,
	emojiPath: '{{hexcode}}',
	emojiSize: 0,
	emojiSource: {
		compact: false,
		locale: 'en',
		version,
	},
	messages: CONTEXT_MESSAGES,
});
