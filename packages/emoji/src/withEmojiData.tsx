/* eslint-disable promise/always-return */

import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { fetchFromCDN, Emoji } from 'emojibase';
import EmojiDataManager from './EmojiDataManager';
import { CanonicalEmoji, Source } from './types';

export interface WithEmojiDataOptions {
  /** Always render the underlying component, even when the dataset is empty, or a fetch failed. Provided by `withEmojiData`. */
  alwaysRender?: boolean;
  /** Load compact emoji dataset instead of full dataset. Provided by `withEmojiData`. */
  compact?: boolean;
  /** List of emojis to manually use to avoid fetch. Provided by `withEmojiData`. */
  emojis?: Emoji[];
  /** Throw errors that occurred during a fetch. Defaults to `true`. Provided by `withEmojiData`. */
  throwErrors?: boolean;
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
const loaded: Set<string> = new Set();
const promise: Map<string, Promise<void>> = new Map();

export function resetLoaded() {
  if (__DEV__) {
    loaded.clear();
    promise.clear();
  }
}

const EMOJIBASE_LATEST_VERSION = require('emojibase/package.json').version;

export default function withEmojiData(options: WithEmojiDataOptions = {}) /* infer */ {
  const { alwaysRender = false, compact = false, emojis = [], throwErrors = true } = options;

  return function withEmojiDataFactory<Props extends object = {}>(
    Component: React.ComponentType<Props & WithEmojiDataProps>,
  ): React.ComponentType<Props & WithEmojiDataWrapperProps> {
    const baseName = Component.displayName || Component.name;

    class WithEmojiData extends React.PureComponent<
      Props & WithEmojiDataWrapperProps,
      WithEmojiDataState
    > {
      static displayName = `withEmojiData(${baseName})`;

      static defaultProps: any = {
        locale: 'en',
        version: EMOJIBASE_LATEST_VERSION,
      };

      mounted = false;

      state: WithEmojiDataState = {
        emojis: [],
        source: {
          compact: false,
          locale: 'en',
          version: EMOJIBASE_LATEST_VERSION,
        },
      };

      componentDidMount() {
        console.log('componentDidMount');
        this.mounted = true;
        this.loadEmojis();
      }

      componentDidUpdate(prevProps: Props & WithEmojiDataWrapperProps) {
        console.log('componentDidUpdate');
        const { locale, version } = this.props;

        if (prevProps.locale !== locale || prevProps.version !== version) {
          // this.loadEmojis();
        }
      }

      componentWillUnmount() {
        console.log('componentWillUnmount');
        this.mounted = false;
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
        if (!this.mounted) {
          return;
        }

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
        if (loaded.has(key) || emojis.length > 0) {
          console.log('loadEmojis', 'LOADED', emojis);
          this.setEmojis(emojis);

          return promise.get(key)!;
        }

        // Or hook into the promise if we're loading
        if (promise.has(key)) {
          console.log('loadEmojis', 'PROMISE');
          return promise.get(key)!.then(() => {
            this.setEmojis();
          });
        }

        console.log('loadEmojis', 'FETCH', key);

        // Otherwise, start loading emoji data from the CDN
        const request = fetchFromCDN<Emoji>(`${locale}/${set}.json`, version)
          .then(response => {
            loaded.add(key);

            console.log({ response });

            this.getDataInstance().parseEmojiData(response);
            this.setEmojis();
          })
          .catch(error => {
            loaded.add(key);

            console.log({ error });

            if (throwErrors) {
              throw error;
            }
          });

        promise.set(key, request);

        return request;
      }

      render() {
        const { locale, version, ...props } = this.props;

        if (!this.mounted || (this.state.emojis.length === 0 && !alwaysRender)) {
          return null;
        }

        console.log('render', this.state);

        return (
          <Component
            {...(props as Props)}
            emojis={this.state.emojis}
            emojiData={this.getDataInstance()}
            emojiSource={this.state.source}
          />
        );
      }
    }

    hoistNonReactStatics(WithEmojiData, Component);

    return WithEmojiData;
  };
}
