/* eslint-disable @typescript-eslint/camelcase */

import { Presentation } from 'emojibase';
import { CONTEXT_CLASSNAMES, CONTEXT_MESSAGES } from '../src/constants';

export const PICKER_CONTEXT = {
  classNames: CONTEXT_CLASSNAMES,
  messages: {
    ...CONTEXT_MESSAGES,
    noPreview: 'No emoji to display',
  },
};

export const CAT_EMOJI = {
  annotation: 'cat',
  hexcode: '1F408',
  emoji: '🐈',
  shortcodes: ['cat'],
  canonical_shortcodes: [':cat:'],
  primary_shortcode: ':cat:',
  group: 0,
  subgroup: 0,
  name: 'CAT',
  order: 0,
  tags: ['cat'],
  text: '',
  type: 1 as Presentation,
  version: 1,
  unicode: '',
};
