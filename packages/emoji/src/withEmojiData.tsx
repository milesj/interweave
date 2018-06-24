/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable promise/always-return */

import React from 'react';
import PropTypes from 'prop-types';
import { fetchFromCDN, Emoji } from 'emojibase';
import { SUPPORTED_LOCALES } from 'emojibase/lib/constants';
import EmojiDataManager from './EmojiDataManager';
import { EmojiShape } from './shapes';
import { CanonicalEmoji, Source } from './types';

export interface WithEmojiDataWrapperProps {
  /** Load compact emoji dataset instead of full dataset. Provided by `withEmojiData`. */
  compact?: boolean;
  /** List of emojis to manually use. Provided by `withEmojiData`. */
  emojis?: Emoji[];
  /** Locale to load emoji annotations in. Provided by `withEmojiData`. */
  locale?: string;
  /** Emojibase dataset version to load. Provided by `withEmojiData`. */
  version?: string;
}

export interface WithEmojiDataProps {
  /** List of loaded emojis. Provided by `withEmojiData`. */
  emojis: CanonicalEmoji[];
  /** Emoji data manager and loader instance. Provided by `withEmojiData`. */
  emojiData: EmojiDataManager;
  /** Emoji datasource metadata. Provided by `withEmojiData`. */
  emojiSource: Source;
}

export interface WithEmojiDataState {
  emojis: Emoji[];
  source: Source;
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

export default function withEmojiData<Props extends {} = {}>(
  Component: React.ComponentType<Props & WithEmojiDataProps>,
) {
  return class WithEmojiData extends React.PureComponent<
    Props & WithEmojiDataWrapperProps,
    WithEmojiDataState
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
      source: {
        compact: false,
        locale: 'en',
        version: 'latest',
      },
    };

    componentDidMount() {
      this.loadEmojis();
    }

    componentDidUpdate(prevProps: WithEmojiDataWrapperProps) {
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
    getDataInstance(): EmojiDataManager {
      return EmojiDataManager.getInstance(this.props.locale);
    }

    /**
     * Set a list of emojis. If a list of custom emoji data has been passed,
     * use it instead of the parsed data.
     */
    setEmojis(emojis: Emoji[] = []) {
      const { compact, locale, version } = this.props as Required<WithEmojiDataWrapperProps>;

      this.setState({
        emojis: emojis.length > 0 ? emojis : this.getDataInstance().getData(),
        source: {
          compact,
          locale,
          version,
        },
      });
    }

    /**
     * Load and parse emoji data from the CDN or use the provided dataset.
     */
    loadEmojis() {
      const { compact, emojis, locale, version } = this.props as Required<
        WithEmojiDataWrapperProps
      >;

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
        promise[locale] = fetchFromCDN<Emoji>(
          `${locale}/${compact ? 'compact' : 'data'}.json`,
          version,
        )
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

      if (this.state.emojis.length === 0) {
        return null;
      }

      return (
        <Component
          {...props}
          emojis={this.state.emojis}
          emojiData={this.getDataInstance()}
          emojiSource={this.state.source}
        />
      );
    }
  };
}
