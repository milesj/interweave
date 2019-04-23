import { loadEmojiData } from 'emojibase-test-utils';
import { EmojiDataManager } from 'interweave-emoji';
import EmojiDataSourceManager from '../packages/emoji/src/EmojiDataManager';

const data = loadEmojiData();

// Bootstrap our emoji data using the official en dataset
EmojiDataSourceManager.getInstance('en').parseEmojiData(data);
EmojiDataManager.getInstance('en').parseEmojiData(data);

// @ts-ignore
global.regeneratorRuntime = require('regenerator-runtime');
