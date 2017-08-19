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

import type { EmojiLoaderProps, EmojiLoaderState } from '../types';

let promise;

export default class EmojiLoader extends React.Component<EmojiLoaderProps, EmojiLoaderState> {
  static propTypes = {
    children: PropTypes.node.isRequired,
    locale: PropTypes.oneOf(SUPPORTED_LOCALES),
  };

  static defaultProps = {
    locale: 'en',
  };

  state = {
    loaded: false,
  };

  componentWillMount() {
    const { locale } = this.props;
    const { loaded } = this.state;

    // If currently loading, re-render when complete
    if (!loaded && promise) {
      promise
        .then(() => {
          this.forceUpdate();
        })
        .catch((error) => {
          throw error;
        });

    // Start loading emoji data from the CDN as soon as possible
    } else if (!loaded) {
      promise = fetchFromCDN(`${locale}/compact.json`)
        .then((data) => {
          // Parse the emoji data and make it available to Interweave
          parseEmojiData(data);

          // Render making the new data available
          this.setState({
            loaded: true,
          });
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
