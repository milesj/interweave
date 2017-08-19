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

import type { EmojiLoaderProps } from '../types';

let loaded = false;
let promise;

export default class EmojiLoader extends React.PureComponent<EmojiLoaderProps> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    locale: PropTypes.oneOf(SUPPORTED_LOCALES),
  };

  static defaultProps = {
    locale: 'en',
  };

  constructor({ locale }: EmojiLoaderProps) {
    super();

    // Abort if data has already been loaded
    if (loaded) {
      // Nothing!

    // If currently loading, re-render when complete
    } else if (promise) {
      promise
        .then(() => {
          this.forceUpdate();
        })
        .catch((error) => {
          throw error;
        });

    // Start loading emoji data from the CDN as soon as possible
    } else {
      promise = fetchFromCDN(`${locale}/compact.json`)
        .then((data) => {
          loaded = true;

          // Parse the emoji data and make it available to Interweave
          parseEmojiData(data);

          // Re-render making the new data available
          this.forceUpdate();
        })
        .catch((error) => {
          throw error;
        });
    }
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
