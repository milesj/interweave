/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import Matcher from '../Matcher';
import Emoji from '../components/Emoji';
import { /* EMOJI_PATTERN, */ EMOJI_SHORTNAME_PATTERN } from '../constants';

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
    }

    /* const response = this.doMatch(string, EMOJI_PATTERN, (matches) => ({
      unicode: matches[0],
    }));

    if (response) {
      return response;
    } */

    return response;
  }
}
