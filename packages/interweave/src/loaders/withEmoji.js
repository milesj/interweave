/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable promise/always-return */

import React from 'react';
import PropTypes from 'prop-types';
import { fetchFromCDN } from 'emojibase';
import { SUPPORTED_LOCALES } from 'emojibase/lib/constants';
import { parseEmojiData } from '../data/emoji';

import type { Emoji } from 'emojibase'; // eslint-disable-line
import type { EmojiLoaderProps, HOCComponent } from '../types';

// Share between all instances
let loaded = false;
let promise = null;

export default function withEmoji(Component: HOCComponent): HOCComponent {
  return class EmojiLoader extends React.Component<EmojiLoaderProps> {
    static propTypes = {
      compact: PropTypes.bool,
      emojis: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.object),
      ]),
      locale: PropTypes.oneOf(SUPPORTED_LOCALES),
      version: PropTypes.string,
    };

    static defaultProps = {
      compact: false,
      emojis: [],
      locale: 'en',
      version: 'latest',
    };

    componentWillMount() {
      const { compact, emojis, locale, version } = this.props;

      // Abort as we've already loaded data
      if (loaded) {
        return;
      }

      // Load data if it was manually passed
      if (emojis.length > 0) {
        this.loadData(emojis);

      // Or hook into the promise if we're loading
      } else if (promise) {
        promise
          .then(() => {
            this.forceUpdate();
          })
          .catch((error) => {
            throw error;
          });

      // Otherwise, start loading emoji data from the CDN
      } else {
        promise = fetchFromCDN(`${locale}/${compact ? 'compact' : 'data'}.json`, version)
          .then((response) => {
            this.loadData(response);
          })
          .catch((error) => {
            throw error;
          });
      }
    }

    /**
     * Parse emoji data and make it available to Interweave
     */
    loadData(data: string | Emoji[]) {
      parseEmojiData((typeof data === 'string') ? JSON.parse(data) : data);

      this.forceUpdate();

      loaded = true;
    }

    /**
     * Clone the element so that it re-renders itself.
     */
    render() {
      const { compact, emojis, locale, version, ...props } = this.props;

      return (
        <Component {...props} />
      );
    }
  };
}
