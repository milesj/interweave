import { Presentation } from 'emojibase';
import { loadEmojiData } from 'emojibase-test-utils';
import EmojiDataManager from '../src/EmojiDataManager';

describe('EmojiDataManager', () => {
  let manager: EmojiDataManager;

  beforeEach(() => {
    manager = new EmojiDataManager('ja');
  });

  describe('getInstance()', () => {
    it('returns different instancs', () => {
      expect(EmojiDataManager.getInstance()).not.toBe(EmojiDataManager.getInstance('de'));
      expect(EmojiDataManager.getInstance('fr')).not.toBe(new EmojiDataManager());
    });
  });

  describe('parseEmojiData()', () => {
    it('sets normal and flat datasets', () => {
      expect(manager.getData()).toHaveLength(0);
      expect(manager.getFlatData()).toHaveLength(0);

      manager.parseEmojiData(loadEmojiData());

      expect(manager.getData()).toHaveLength(1847);
      expect(manager.getFlatData()).toHaveLength(3547);
    });
  });

  describe('packageEmoji()', () => {
    const cat = {
      annotation: 'cat',
      hexcode: '1F408',
      emoji: '🐈',
      shortcodes: ['cat'],
      group: 0,
      subgroup: 0,
      name: 'CAT',
      order: 0,
      tags: ['cat'],
      text: '',
      type: 1 as Presentation,
      version: 1,
    };

    it('creates a new emoji', () => {
      expect(manager.packageEmoji(cat)).toEqual({
        ...cat,
        canonical_shortcodes: [':cat:'],
        primary_shortcode: ':cat:',
        skins: [],
        unicode: '🐈',
      });
    });

    it('handles text variation', () => {
      expect(
        manager.packageEmoji({
          ...cat,
          type: 0,
          text: 'CAT',
        }),
      ).toEqual({
        ...cat,
        canonical_shortcodes: [':cat:'],
        primary_shortcode: ':cat:',
        skins: [],
        type: 0,
        text: 'CAT',
        unicode: 'CAT',
      });
    });

    it('maps hexcode to emoji', () => {
      manager.packageEmoji(cat);

      expect(manager.EMOJIS['1F408']).toEqual(expect.objectContaining(cat));
    });

    it('maps unicode to hexcode', () => {
      manager.packageEmoji(cat);

      expect(manager.UNICODE_TO_HEXCODE['🐈']).toBe('1F408');
    });

    it('maps emoticon if it exists', () => {
      manager.packageEmoji({
        ...cat,
        emoticon: ':3',
      });

      expect(manager.EMOTICON_TO_HEXCODE[':3']).toBe('1F408');
    });
  });
});
