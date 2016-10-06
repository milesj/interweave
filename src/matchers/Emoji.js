/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import Matcher from '../Matcher';
import Emoji from '../components/Emoji';
import { SHORTNAME_TO_UNICODE, EMOJI_SHORTNAME_PATTERN } from '../data/emoji';

import type { MatchResponse, EmojiProps } from '../types';

export default class EmojiMatcher extends Matcher {
  /**
   * {@inheritDoc}
   */
  factory(match: string, props: Object = {}): React.Element<EmojiProps> {
    return (
      <Emoji {...props} />
    );
  }

  /**
   * @{inheritDoc}
   */
  getTagName(): string {
    return 'span';
  }

  /**
   * {@inheritDoc}
   */
  match(string: string): ?MatchResponse {
    let response = null;

    // Let's first check to see if a colon exists in the string,
    // before doing any unnecessary shortname regex matching.
    if (string.indexOf(':') >= 0) {
      response = this.doMatch(string, EMOJI_SHORTNAME_PATTERN, matches => ({
        shortName: matches[0].toLowerCase(),
      }));

      // Only trigger a match if a valid shortname
      if (response && !SHORTNAME_TO_UNICODE[response.shortName]) {
        response = null;
      }
    }

    return response;
  }
}
