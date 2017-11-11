import { loadEmojiData } from 'emojibase-test-utils';
import EmojiData from '../packages/interweave-emoji/src/EmojiData';

const emojis = loadEmojiData();

// Bootstrap our emoji data using the official en dataset
EmojiData.getInstance('en').parseEmojiData(emojis);

// Mock our fetch and return our bootstrapped data
global.fetch = () => Promise.resolve({
  json: () => emojis,
  ok: true,
});
