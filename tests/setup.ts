import { loadEmojiData } from 'emojibase-test-utils';
import EmojiDataManager from '../packages/emoji/src/EmojiDataManager';

// Bootstrap our emoji data using the official en dataset
EmojiDataManager.getInstance('en').parseEmojiData(loadEmojiData());
