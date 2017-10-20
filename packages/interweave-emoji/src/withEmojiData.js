/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable promise/always-return, promise/catch-or-return */

import React from 'react';
import PropTypes from 'prop-types';
import { fetchFromCDN } from 'emojibase';
import { SUPPORTED_LOCALES } from 'emojibase/lib/constants';
import EmojiData from './EmojiData';
import { EmojiShape } from './shapes';

import type { Emoji } from 'emojibase'; // eslint-disable-line

type EmojiDataLoaderProps = {
  compact: boolean,
  emojis: Emoji[],
  locale: string,
  version: string,
};

type EmojiDataLoaderState = {
  emojis: Emoji[],
};

// Share between all instances
let loaded: { [locale: string]: boolean } = {};
let promise: { [locale: string]: Promise<*> } = {};

export function resetLoaded() {
  if (__DEV__) {
    loaded = {};
    promise = {};
  }
}

export default function withEmojiData(
  Component: React$ComponentType<*>,
): React$ComponentType<EmojiDataLoaderProps> {
  return class EmojiDataLoader extends React.PureComponent<
    EmojiDataLoaderProps,
    EmojiDataLoaderState,
  > {
    static propTypes = {
      compact: PropTypes.bool,
      emojis: PropTypes.arrayOf(EmojiShape),
      locale: PropTypes.oneOf(SUPPORTED_LOCALES),
      version: PropTypes.string,
    };

    static defaultProps = {
      compact: false,
      emojis: [],
      locale: 'en',
      version: 'latest',
    };

    state = {
      emojis: [],
    };

    componentWillMount() {
      this.loadEmojis(this.props);
    }

    componentWillReceiveProps(nextProps: EmojiDataLoaderProps) {
      const {
        compact,
        emojis,
        locale,
        version,
      } = this.props;

      if (
        nextProps.compact !== compact ||
        nextProps.emojis !== emojis ||
        nextProps.locale !== locale ||
        nextProps.version !== version
      ) {
        this.loadEmojis(nextProps);
      }
    }

    /**
     * Create or return the data instance.
     */
    getDataInstance(): EmojiData {
      return EmojiData.getInstance(this.props.locale);
    }

    /**
     * Load and parse emoji data from the CDN or use the provided dataset.
     */
    loadEmojis(props: EmojiDataLoaderProps) {
      const { compact, locale, version } = props;

      // Abort as we've already loaded data
      if (loaded[locale]) {
        this.setEmojis(props.emojis);

      // Or hook into the promise if we're loading
      } else if (promise[locale]) {
        promise[locale]
          .then(() => {
            this.setEmojis(props.emojis);
          })
          .catch((error) => {
            throw error;
          });

      // Otherwise, start loading emoji data from the CDN
      } else {
        promise[locale] = fetchFromCDN(`${locale}/${compact ? 'compact' : 'data'}.json`, version)
          .then((response) => {
            loaded[locale] = true;

            // Parse the data and make it available through our data layer.
            // We should do this first so that the custom data can hook into it.
            this.getDataInstance().parseEmojiData(response);

            // If a list of custom emoji data has been passed,
            // use it instead of the parsed data.
            this.setEmojis(props.emojis);
          })
          .catch((error) => {
            throw error;
          });
      }
    }

    setEmojis(emojis: Emoji[]) {
      this.setState({
        emojis: (emojis.length > 0) ? emojis : this.getDataInstance().getData(),
      });
    }

    /**
     * Clone the element so that it re-renders itself.
     */
    render(): React$Node {
      const {
        compact,
        emojis,
        locale,
        version,
        ...props
      } = this.props;
      const emojiSource = {
        compact,
        locale,
        version,
      };

      return (
        <Component {...props} emojis={this.state.emojis} emojiSource={emojiSource} />
      );
    }
  };
}
