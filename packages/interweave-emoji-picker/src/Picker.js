/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { EMOJIS, getEmojiData } from 'interweave/lib/data/emoji';
import withEmojiData from 'interweave/lib/loaders/withEmojiData';
import EmojiList from './EmojiList';
import GroupBar from './GroupBar';
import PreviewBar from './PreviewBar';
import SearchBar from './SearchBar';
import { KEY_RECENTLY_USED } from './constants';

import type { Emoji, EmojiPath } from './types';

type PickerProps = {
  autoFocus: boolean,
  classNames: { [key: string]: string },
  defaultGroup: string,
  defaultSearchQuery: string,
  displayOrder: string[],
  emojiPath: EmojiPath,
  enableRecentlyUsed: boolean,
  exclude: string[],
  hideEmoticon: boolean,
  hidePreview: boolean,
  hideSearch: boolean,
  hideShortcodes: boolean,
  icons: { [key: string]: React$Node },
  loadBuffer: number,
  maxRecentlyUsed: number,
  messages: { [key: string]: string },
  onHoverEmoji: (emoji: Emoji) => void,
  onSearch: (query: string) => void,
  onSelectEmoji: (emoji: Emoji) => void,
  onSelectGroup: (group: string) => void,
};

type PickerState = {
  activeEmoji: ?Emoji,
  activeGroup: string,
  defaultGroup: string,
  recentEmojis: string[],
  searchQuery: string,
};

class Picker extends React.Component<PickerProps, PickerState> {
  static childContextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    autoFocus: PropTypes.bool,
    classNames: PropTypes.objectOf(PropTypes.string),
    defaultGroup: PropTypes.string,
    defaultSearchQuery: PropTypes.string,
    displayOrder: PropTypes.arrayOf(PropTypes.string),
    emojiPath: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    enableRecentlyUsed: PropTypes.bool,
    exclude: PropTypes.arrayOf(PropTypes.string),
    hideEmoticon: PropTypes.bool,
    hidePreview: PropTypes.bool,
    hideSearch: PropTypes.bool,
    hideShortcodes: PropTypes.bool,
    icons: PropTypes.objectOf(PropTypes.node),
    loadBuffer: PropTypes.number,
    maxRecentlyUsed: PropTypes.number,
    messages: PropTypes.objectOf(PropTypes.string),
    onHoverEmoji: PropTypes.func,
    onSearch: PropTypes.func,
    onSelectEmoji: PropTypes.func,
    onSelectGroup: PropTypes.func,
  };

  static defaultProps = {
    autoFocus: false,
    classNames: {},
    defaultGroup: '',
    defaultSearchQuery: '',
    displayOrder: ['preview', 'emojis', 'groups', 'search'],
    enableRecentlyUsed: false,
    emojiPath: '',
    exclude: [],
    messages: {},
    hideEmoticon: false,
    hidePreview: false,
    hideSearch: false,
    hideShortcodes: false,
    icons: {},
    loadBuffer: 200,
    maxRecentlyUsed: 31,
    onHoverEmoji() {},
    onSearch() {},
    onSelectEmoji() {},
    onSelectGroup() {},
  };

  constructor({ defaultGroup, defaultSearchQuery, enableRecentlyUsed }: PickerProps) {
    super();

    const recentEmojis = this.getRecentEmojisFromStorage();
    const fallbackGroup = (enableRecentlyUsed && recentEmojis.length > 0)
      ? 'recentlyUsed'
      : 'smileysPeople';

    this.state = {
      recentEmojis,
      activeEmoji: null,
      activeGroup: defaultGroup || fallbackGroup,
      defaultGroup: defaultGroup || fallbackGroup,
      searchQuery: defaultSearchQuery,
    };
  }

  getChildContext() {
    const { classNames, messages } = this.props;

    return {
      classNames: {
        emoji: 'interweave-picker__emoji',
        emojiActive: 'interweave-picker__emoji--active',
        emojis: 'interweave-picker__emojis',
        emojisSection: 'interweave-picker__emojis-section',
        emojisHeader: 'interweave-picker__emojis-header',
        emojisBody: 'interweave-picker__emojis-body',
        group: 'interweave-picker__group',
        groupActive: 'interweave-picker__group--active',
        groups: 'interweave-picker__groups',
        groupsList: 'interweave-picker__groups-list',
        noResults: 'interweave-picker__no-results',
        preview: 'interweave-picker__preview',
        previewEmpty: 'interweave-picker__preview-empty',
        previewEmoji: 'interweave-picker__preview-emoji',
        previewContent: 'interweave-picker__preview-content',
        previewTitle: 'interweave-picker__preview-title',
        previewSubtitle: 'interweave-picker__preview-subtitle',
        search: 'interweave-picker__search',
        searchInput: 'interweave-picker__search-input',
        ...classNames,
      },
      messages: {
        // Emoji groups
        smileysPeople: 'Smileys & People',
        animalsNature: 'Animals & Nature',
        foodDrink: 'Food & Drink',
        travelPlaces: 'Travel & Places',
        activities: 'Activities',
        objects: 'Objects',
        symbols: 'Symbols',
        flags: 'Flags',
        // Custom groups
        recentlyUsed: 'Recently Used',
        searchResults: 'Search Results',
        // Miscellaneous
        search: 'Search…',
        searchAria: 'Search for emojis by keyword',
        noPreview: '',
        noResults: 'No results…',
        // Overrides
        ...messages,
      },
    };
  }

  /**
   * Add a recent emoji to local storage and update the current state.
   */
  addRecentEmoji(emoji: Emoji) {
    const { enableRecentlyUsed, maxRecentlyUsed } = this.props;

    if (!enableRecentlyUsed) {
      return;
    }

    const { recentEmojis } = this.state;

    // Add to the top of the list
    let emojis = [
      emoji.unicode,
      ...recentEmojis,
    ];

    // Trim to the max
    emojis = emojis.slice(0, maxRecentlyUsed);

    // Remove duplicates
    emojis = Array.from(new Set(emojis));

    try {
      localStorage.setItem(KEY_RECENTLY_USED, JSON.stringify(emojis));
    } catch (error) {
      // Do nothing
    }

    this.setState({
      recentEmojis: emojis,
    });
  }

  /**
   * Convert the `exclude` prop to a map for quicker lookups.
   */
  generateExcludeMap() {
    const map = {};

    this.props.exclude.forEach((hexcode) => {
      map[hexcode] = true;
    });

    return map;
  }

  /**
   * We only store the unicode character for recent emojis,
   * so we need to rebuild the recent list with the full emoji objects.
   */
  generateRecentEmojis() {
    return this.state.recentEmojis
      .map(unicode => EMOJIS[unicode])
      .filter(Boolean);
  }

  /**
   * Return the recently used emojis from local storage.
   */
  getRecentEmojisFromStorage() {
    const recent = localStorage.getItem(KEY_RECENTLY_USED);

    return recent ? JSON.parse(recent) : [];
  }

  /**
   * Triggered when the mouse hovers an emoji.
   */
  handleEnterEmoji = (emoji: Emoji) => {
    this.setState({
      activeEmoji: emoji,
    });

    this.props.onHoverEmoji(emoji);
  };

  /**
   * Triggered when the mouse no longer hovers an emoji.
   */
  handleLeaveEmoji = () => {
    this.setState({
      activeEmoji: null,
    });
  };

  /**
   * Triggered when the search input field value changes.
   */
  handleSearch = (query: string) => {
    this.setState({
      searchQuery: query,
      // Deactive group tabs
      activeGroup: query ? '' : this.state.defaultGroup,
    });

    this.props.onSearch(query);
  };

  /**
   * Triggered when an emoji is clicked.
   */
  handleSelectEmoji = (emoji: Emoji) => {
    this.props.onSelectEmoji(emoji);
    this.addRecentEmoji(emoji);
  };

  /**
   * Triggered when a group tab is clicked or scrolled to.
   */
  handleSelectGroup = (group: string, resetSearch: boolean = false) => {
    this.setState(prevState => ({
      activeGroup: group,
      // Reset previous search
      searchQuery: resetSearch ? '' : prevState.searchQuery,
    }));

    this.props.onSelectGroup(group);
  };

  render() {
    const {
      autoFocus,
      classNames,
      displayOrder,
      emojiPath,
      enableRecentlyUsed,
      hideEmoticon,
      hidePreview,
      hideSearch,
      hideShortcodes,
      icons,
      loadBuffer,
    } = this.props;
    const { activeEmoji, activeGroup, searchQuery } = this.state;
    const recentEmojis = this.generateRecentEmojis();
    const hasRecentlyUsed = (enableRecentlyUsed && recentEmojis.length > 0);
    const components = {
      preview: hidePreview ? null : (
        <PreviewBar
          emoji={activeEmoji}
          emojiPath={emojiPath}
          hideEmoticon={hideEmoticon}
          hideShortcodes={hideShortcodes}
        />
      ),
      emojis: (
        <EmojiList
          emojis={getEmojiData()}
          recentEmojis={recentEmojis}
          emojiPath={emojiPath}
          activeGroup={activeGroup}
          hasRecentlyUsed={hasRecentlyUsed}
          exclude={this.generateExcludeMap()}
          query={searchQuery}
          loadBuffer={loadBuffer}
          onEnter={this.handleEnterEmoji}
          onLeave={this.handleLeaveEmoji}
          onSelectEmoji={this.handleSelectEmoji}
          onSelectGroup={this.handleSelectGroup}
        />
      ),
      groups: (
        <GroupBar
          activeGroup={activeGroup}
          emojiPath={emojiPath}
          hasRecentlyUsed={hasRecentlyUsed}
          icons={icons}
          onSelect={this.handleSelectGroup}
        />
      ),
      search: hideSearch ? null : (
        <SearchBar
          autoFocus={autoFocus}
          query={searchQuery}
          onChange={this.handleSearch}
        />
      ),
    };

    return (
      <div className={classNames.picker || 'interweave-picker__picker'}>
        {displayOrder.map(key => components[key])}
      </div>
    );
  }
}

export default withEmojiData(Picker);
