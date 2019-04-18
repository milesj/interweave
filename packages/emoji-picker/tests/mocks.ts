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
  canonical_shortcodes: [':cat:'],
  emoji: '🐈',
  group: 0,
  hexcode: '1F408',
  name: 'CAT',
  order: 0,
  primary_shortcode: ':cat:',
  shortcodes: ['cat'],
  subgroup: 0,
  tags: ['cat'],
  text: '',
  type: 1 as Presentation,
  unicode: '',
  version: 1,
};
