import { UNICODE_TO_SHORTNAME, SHORTNAME_TO_UNICODE } from '../../src/data/emoji';
import { VALID_EMOJIS } from '../mocks';

describe('data/emoji', () => {
  VALID_EMOJIS.forEach(([hexCode, unicode, shortName]) => {
    it(`maps unicode to shortname: ${shortName}`, () => {
      expect(UNICODE_TO_SHORTNAME[unicode]).toBe(shortName);
    });

    it(`maps shortname to unicode: ${shortName}`, () => {
      expect(SHORTNAME_TO_UNICODE[shortName]).toBe(unicode);
    });
  });
});
