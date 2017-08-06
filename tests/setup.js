/* eslint-disable no-undef */

import emojis from 'emojibase-data/en/data.json';
import { parseEmojiData } from '../src/data/emoji';

// Bootstrap our emoji data using the official en dataset
parseEmojiData(emojis);

// Mock our fetch and return our bootstrapped data
global.fetch = () => Promise.resolve({
  ok: true,
  json: () => emojis,
});
