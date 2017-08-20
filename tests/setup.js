/* eslint-disable no-undef */

import { loadEmojiData } from 'emojibase-test-utils';
import { parseEmojiData } from '../src/data/emoji';

const emojis = loadEmojiData();

// Bootstrap our emoji data using the official en dataset
parseEmojiData(emojis);

// Mock our fetch and return our bootstrapped data
global.fetch = () => Promise.resolve({
  ok: true,
  json: () => emojis,
});
