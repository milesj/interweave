import { loadEmojiData, loadShortcodes } from 'emojibase-test-utils';
import { EmojiDataManager } from 'interweave-emoji';
import EmojiDataSourceManager from '../packages/emoji/src/EmojiDataManager';

const data = loadEmojiData([loadShortcodes()]);

// Bootstrap our emoji data using the official en dataset
EmojiDataSourceManager.getInstance('en').parseEmojiData(data);
EmojiDataManager.getInstance('en').parseEmojiData(data);
