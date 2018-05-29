/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable promise/always-return, promise/catch-or-return */

import React from 'react';
import PropTypes from 'prop-types';
import { fetchFromCDN, Emoji } from 'emojibase';
import { SUPPORTED_LOCALES } from 'emojibase/lib/constants';
import EmojiData from './EmojiData';
import { EmojiShape } from './shapes';
import { CanonicalEmoji, Source } from './types';

export interface EmojiDataLoaderProps {
  compact?: boolean;
  emojis?: Emoji[];
  locale?: string;
  version?: string;
}

export interface EmojiDataLoaderInjectedProps {
  emojis: CanonicalEmoji[];
  emojiSource: Source;
}

export interface EmojiDataLoaderState {
  emojis: Emoji[];
}

// Share between all instances
let loaded: { [locale: string]: boolean } = {};
let promise: { [locale: string]: Promise<Emoji[]> } = {};

export function resetLoaded() {
  if (process.env.NODE_ENV !== 'production') {
    loaded = {};
    promise = {};
  }
}

export default function withEmojiData<T extends {}>(
  Component: React.ComponentType<T & EmojiDataLoaderInjectedProps>,
) {
  return class EmojiDataLoader extends React.PureComponent<
    T & EmojiDataLoaderProps,
    EmojiDataLoaderState
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

    componentDidMount() {
      this.loadEmojis();
    }

    componentDidUpdate(prevProps: EmojiDataLoaderProps) {
      const { compact, emojis, locale, version } = this.props;

      if (
        prevProps.compact !== compact ||
        prevProps.emojis !== emojis ||
        prevProps.locale !== locale ||
        prevProps.version !== version
      ) {
        this.loadEmojis();
      }
    }

    /**
     * Create or return the data instance.
     */
    getDataInstance(): EmojiData {
      return EmojiData.getInstance(this.props.locale);
    }

    /**
     * Set a list of emojis. If a list of custom emoji data has been passed,
     * use it instead of the parsed data.
     */
    setEmojis(emojis: Emoji[] = []) {
      this.setState({
        emojis: emojis.length > 0 ? emojis : this.getDataInstance().getData(),
      });
    }

    /**
     * Load and parse emoji data from the CDN or use the provided dataset.
     */
    loadEmojis() {
      const { compact, emojis, locale, version } = this.props as Required<EmojiDataLoaderProps>;

      // Abort as we've already loaded data
      if (loaded[locale]) {
        this.setEmojis(emojis);

        // Or hook into the promise if we're loading
      } else if (promise[locale]) {
        promise[locale]
          .then(() => {
            this.setEmojis(emojis);
          })
          .catch(error => {
            throw error;
          });

        // Otherwise, start loading emoji data from the CDN
      } else {
        promise[locale] = fetchFromCDN(`${locale}/${compact ? 'compact' : 'data'}.json`, version)
          .then(response => {
            loaded[locale] = true;

            // Parse the data and make it available through our data layer.
            // We should do this first so that the custom emojis can hook into it.
            this.getDataInstance().parseEmojiData(response);
            this.setEmojis(emojis);

            return response;
          })
          .catch(error => {
            throw error;
          });
      }
    }

    /**
     * Clone the element so that it re-renders itself.
     */
    render() {
      // @ts-ignore
      const { compact, emojis, locale, version, ...props } = this.props;

      return (
        <Component
          {...props}
          emojis={this.state.emojis}
          emojiSource={{
            compact,
            locale,
            version,
          }}
        />
      );
    }
  };
}
