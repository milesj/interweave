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
let promise = null;

export default class EmojiLoader extends React.Component<EmojiLoaderProps> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    locale: PropTypes.oneOf(SUPPORTED_LOCALES),
    version: PropTypes.string,
  };

  static defaultProps = {
    locale: 'en',
    version: 'latest',
  };

  componentWillMount() {
    const { locale, version } = this.props;

    // Abort as we've already loaded data
    if (loaded) {
      return;
    }

    // Or hook into the promise if we're loading
    if (promise) {
      promise
        .then(() => {
          this.forceUpdate();
        })
        .catch((error) => {
          throw error;
        });

    // Otherwise, start loading emoji data from the CDN
    } else {
      promise = fetchFromCDN(`${locale}/compact.json`, version)
        .then((data) => {
          loaded = true;

          // Parse emoji emoji data and make it available to Interweave
          parseEmojiData(data);

          this.forceUpdate();
        })
        .catch((error) => {
          throw error;
        });
    }
  }

  /**
   * Clone the element so that it re-renders itself.
   */
  render() {
    const { children, locale, ...props } = this.props;

    return React.cloneElement(React.Children.only(children), props);
  }
}
