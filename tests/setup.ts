import { loadEmojiData, loadMeta, loadShortcodes } from 'emojibase-test-utils';
import { EmojiDataManager } from 'interweave-emoji';
import { EmojiDataManager as EmojiDataSourceManager } from '../packages/emoji/src/EmojiDataManager';

const data = loadEmojiData([loadShortcodes()]);
const messages = loadMeta();

// Bootstrap our emoji data using the official en dataset
EmojiDataSourceManager.getInstance('en').parseEmojiData(data);
EmojiDataSourceManager.getInstance('en').parseMessageData(messages);

EmojiDataManager.getInstance('en').parseEmojiData(data);
EmojiDataManager.getInstance('en').parseMessageData(messages);
