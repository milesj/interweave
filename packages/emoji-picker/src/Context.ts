import React from 'react';
import { EmojiDataManager, LATEST_DATASET_VERSION } from 'interweave-emoji';
import { CONTEXT_CLASSNAMES, CONTEXT_MESSAGES } from './constants';
import { Context as ContextType } from './types';

export const Context = React.createContext<ContextType>({
	classNames: CONTEXT_CLASSNAMES,
	emojiData: EmojiDataManager.getInstance('en'),
	emojiLargeSize: 0,
	emojiPadding: 0,
	emojiPath: '{{hexcode}}',
	emojiSize: 0,
	emojiSource: {
		compact: false,
		locale: 'en',
		version: LATEST_DATASET_VERSION,
	},
	messages: CONTEXT_MESSAGES,
});
