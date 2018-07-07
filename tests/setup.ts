import { loadEmojiData } from 'emojibase-test-utils';
import EmojiDataManager from '../packages/emoji/src/EmojiDataManager';

const emojis = loadEmojiData();

// Bootstrap our emoji data using the official en dataset
EmojiDataManager.getInstance('en').parseEmojiData(emojis);

// Mock our fetch and return our bootstrapped data
// @ts-ignore
global.fetch = () =>
  Promise.resolve({
    json: () => emojis,
    ok: true,
  });

// Provide helper to all packages
// @ts-ignore
global.loadEmojiData = loadEmojiData;
