/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable promise/always-return */

import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { fetchFromCDN, Emoji, SUPPORTED_LOCALES } from 'emojibase';
import EmojiDataManager from './EmojiDataManager';
import { CanonicalEmoji, Source } from './types';

export interface WithEmojiDataOptions {
  /** Load compact emoji dataset instead of full dataset. Provided by `withEmojiData`. */
  compact?: boolean;
  /** List of emojis to manually use to avoid fetch. Provided by `withEmojiData`. */
  emojis?: Emoji[];
}

export interface WithEmojiDataWrapperProps {
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
  emojis: CanonicalEmoji[];
  source: Source;
}

// Share between all instances
let loaded: { [locale: string]: boolean } = {};
let promise: { [locale: string]: Promise<void> } = {};

export function resetLoaded() {
  if (process.env.NODE_ENV !== 'production') {
    loaded = {};
    promise = {};
  }
}

export default function withEmojiData(
  options: WithEmojiDataOptions = {},
): <Props extends {} = {}>(
  Component: React.ComponentType<Props & WithEmojiDataProps>,
) => React.ComponentType<Props & WithEmojiDataWrapperProps> {
  const { compact = false, emojis = [] } = options;

  return Component => {
    class WithEmojiData extends React.PureComponent<WithEmojiDataWrapperProps, WithEmojiDataState> {
      static propTypes = {
        locale: PropTypes.oneOf(SUPPORTED_LOCALES),
        version: PropTypes.string,
      };

      static defaultProps = {
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
        const { locale, version } = this.props;

        if (prevProps.locale !== locale || prevProps.version !== version) {
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
      setEmojis(nextEmojis: Emoji[] = []) {
        const { locale, version } = this.props as Required<WithEmojiDataWrapperProps>;

        this.setState({
          emojis:
            nextEmojis.length > 0
              ? (nextEmojis as CanonicalEmoji[])
              : this.getDataInstance().getData(),
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
      loadEmojis(): Promise<void> {
        const { locale, version } = this.props;
        const set = compact ? 'compact' : 'data';
        const key = `${locale}:${version}:${set}`;

        // Abort as we've already loaded data
        if (loaded[key] || emojis.length > 0) {
          this.setEmojis(emojis);

          return Promise.resolve();
        }

        // Or hook into the promise if we're loading
        if (promise[key]) {
          return promise[key]
            .then(() => {
              this.setEmojis();
            })
            .catch(error => {
              throw error;
            });
        }

        // Otherwise, start loading emoji data from the CDN
        const request = fetchFromCDN<Emoji>(`${locale}/${set}.json`, version)
          .then(response => {
            loaded[key] = true;

            this.getDataInstance().parseEmojiData(response);
            this.setEmojis();
          })
          .catch(error => {
            throw error;
          });

        promise[key] = request;

        return request;
      }

      render() {
        const { locale, version, ...props } = this.props;

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
    }

    return hoistNonReactStatics<any, WithEmojiDataProps>(WithEmojiData, Component);
  };
}
