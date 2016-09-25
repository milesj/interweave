import { expect } from 'chai';
import {
  convertToUnicode,
  UNICODE_TO_SHORTNAME,
  SHORTNAME_TO_UNICODE,
  SHORTNAME_TO_CODEPOINT,
} from '../../lib/data/emoji';
import { VALID_EMOJIS } from '../mocks';

describe('data/emoji', () => {
  VALID_EMOJIS.forEach(([codePoint, unicode, shortName]) => {
    it(`converts codepoints to unicode: ${codePoint}`, () => {
      expect(convertToUnicode(codePoint)).to.equal(unicode);
    });

    it(`maps unicode to shortname: ${shortName}`, () => {
      expect(UNICODE_TO_SHORTNAME[unicode]).to.equal(shortName);
    });

    it(`maps shortname to unicode: ${shortName}`, () => {
      expect(SHORTNAME_TO_UNICODE[shortName]).to.equal(unicode);
    });

    it(`maps shortname to codepoint: ${codePoint}`, () => {
      expect(SHORTNAME_TO_CODEPOINT[shortName]).to.equal(codePoint);
    });
  });
});
