/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { EMOJIS } from 'interweave/lib/data/emoji';
import withEmojiData from 'interweave/lib/loaders/withEmojiData';
import EmojiList from './EmojiList';
import SkinBar from './SkinBar';
import GroupBar from './GroupBar';
import PreviewBar from './PreviewBar';
import SearchBar from './SearchBar';
import { EmojiShape, EmojiPathShape } from './shapes';
import {
  GROUP_RECENTLY_USED,
  GROUP_SMILEYS_PEOPLE,
  GROUP_ANIMALS_NATURE,
  GROUP_FOOD_DRINK,
  GROUP_TRAVEL_PLACES,
  GROUP_ACTIVITIES,
  GROUP_OBJECTS,
  GROUP_SYMBOLS,
  GROUP_FLAGS,
  SKIN_NONE,
  SKIN_LIGHT,
  SKIN_MEDIUM_LIGHT,
  SKIN_MEDIUM,
  SKIN_MEDIUM_DARK,
  SKIN_DARK,
  KEY_RECENTLY_USED,
  KEY_SKIN_TONE,
} from './constants';

import type { Emoji, EmojiPath } from './types';

type PickerProps = {
  autoFocus: boolean,
  classNames: { [key: string]: string },
  defaultGroup: string,
  defaultSearchQuery: string,
  defaultSkinTone: string,
  disablePreview: boolean,
  disableRecentlyUsed: boolean,
  disableSearch: boolean,
  disableSkinTones: boolean,
  displayOrder: string[],
  emojiPath: EmojiPath,
  emojis: Emoji[],
  exclude: string[],
  hideEmoticon: boolean,
  hideShortcodes: boolean,
  icons: { [key: string]: React$Node },
  loadBuffer: number,
  maxRecentlyUsed: number,
  messages: { [key: string]: string },
  onHoverEmoji: (emoji: Emoji) => void,
  onSearch: (query: string) => void,
  onSelectEmoji: (emoji: Emoji) => void,
  onSelectGroup: (group: string) => void,
  onSelectSkinTone: (skinTone: string) => void,
};

type PickerState = {
  activeEmoji: ?Emoji,
  activeGroup: string,
  activeSkinTone: string,
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
    defaultGroup: PropTypes.oneOf([
      GROUP_RECENTLY_USED,
      GROUP_SMILEYS_PEOPLE,
      GROUP_ANIMALS_NATURE,
      GROUP_FOOD_DRINK,
      GROUP_TRAVEL_PLACES,
      GROUP_ACTIVITIES,
      GROUP_OBJECTS,
      GROUP_SYMBOLS,
      GROUP_FLAGS,
    ]),
    defaultSearchQuery: PropTypes.string,
    defaultSkinTone: PropTypes.oneOf([
      SKIN_NONE,
      SKIN_LIGHT,
      SKIN_MEDIUM_LIGHT,
      SKIN_MEDIUM,
      SKIN_MEDIUM_DARK,
      SKIN_DARK,
    ]),
    disablePreview: PropTypes.bool,
    disableRecentlyUsed: PropTypes.bool,
    disableSearch: PropTypes.bool,
    disableSkinTones: PropTypes.bool,
    displayOrder: PropTypes.arrayOf(PropTypes.string),
    emojiPath: EmojiPathShape.isRequired,
    emojis: EmojiShape.isRequired,
    exclude: PropTypes.arrayOf(PropTypes.string),
    hideEmoticon: PropTypes.bool,
    hideShortcodes: PropTypes.bool,
    icons: PropTypes.objectOf(PropTypes.node),
    loadBuffer: PropTypes.number,
    maxRecentlyUsed: PropTypes.number,
    messages: PropTypes.objectOf(PropTypes.string),
    onHoverEmoji: PropTypes.func,
    onSearch: PropTypes.func,
    onSelectEmoji: PropTypes.func,
    onSelectGroup: PropTypes.func,
    onSelectSkinTone: PropTypes.func,
  };

  static defaultProps = {
    autoFocus: false,
    classNames: {},
    defaultGroup: GROUP_RECENTLY_USED,
    defaultSearchQuery: '',
    defaultSkinTone: SKIN_NONE,
    disablePreview: false,
    disableRecentlyUsed: false,
    disableSearch: false,
    disableSkinTones: false,
    displayOrder: ['preview', 'emojis', 'skins', 'groups', 'search'],
    exclude: [],
    messages: {},
    hideEmoticon: false,
    hideShortcodes: false,
    icons: {},
    loadBuffer: 200,
    maxRecentlyUsed: 30,
    onHoverEmoji() {},
    onSearch() {},
    onSelectEmoji() {},
    onSelectGroup() {},
    onSelectSkinTone() {},
  };

  constructor({
    defaultGroup,
    defaultSearchQuery,
    defaultSkinTone,
    disableRecentlyUsed,
  }: PickerProps) {
    super();

    const recentEmojis = this.getRecentEmojisFromStorage();
    const skinTone = this.getSkinToneFromStorage();

    if (
      (disableRecentlyUsed && defaultGroup === GROUP_RECENTLY_USED) ||
      recentEmojis.length === 0
    ) {
      // eslint-disable-next-line no-param-reassign
      defaultGroup = GROUP_SMILEYS_PEOPLE;
    }

    this.state = {
      defaultGroup,
      recentEmojis,
      activeEmoji: null,
      activeGroup: defaultGroup,
      activeSkinTone: skinTone || defaultSkinTone,
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
        skin: 'interweave-picker__skin',
        skinActive: 'interweave-picker__skin--active',
        skins: 'interweave-picker__skins',
        noPreview: 'interweave-picker__no-preview',
        noResults: 'interweave-picker__no-results',
        preview: 'interweave-picker__preview',
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
        [GROUP_RECENTLY_USED]: 'Recently Used',
        [GROUP_SMILEYS_PEOPLE]: 'Smileys & People',
        [GROUP_ANIMALS_NATURE]: 'Animals & Nature',
        [GROUP_FOOD_DRINK]: 'Food & Drink',
        [GROUP_TRAVEL_PLACES]: 'Travel & Places',
        [GROUP_ACTIVITIES]: 'Activities',
        [GROUP_OBJECTS]: 'Objects',
        [GROUP_SYMBOLS]: 'Symbols',
        [GROUP_FLAGS]: 'Flags',
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
    const { disableRecentlyUsed, maxRecentlyUsed } = this.props;

    if (disableRecentlyUsed) {
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
   * Return the user's favorite skin tone from local storage.
   */
  getSkinToneFromStorage() {
    return localStorage.getItem(KEY_SKIN_TONE);
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
    this.addRecentEmoji(emoji);

    this.props.onSelectEmoji(emoji);
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

  /**
   * Triggered when a skin tone is clicked.
   */
  handleSelectSkinTone = (skinTone: string) => {
    this.setState({
      activeSkinTone: skinTone,
    });

    this.setSkinTone(skinTone);

    this.props.onSelectSkinTone(skinTone);
  };

  /**
   * Determine whether to show the recently used group.
   */
  hasRecentlyUsed() {
    return (!this.props.disableRecentlyUsed && this.state.recentEmojis.length > 0);
  }

  /**
   * Set the users favorite skin tone into local storage.
   */
  setSkinTone(skinTone: string) {
    try {
      localStorage.setItem(KEY_SKIN_TONE, skinTone);
    } catch (error) {
      // Do nothing
    }
  }

  render() {
    const {
      autoFocus,
      classNames,
      displayOrder,
      emojiPath,
      emojis,
      hideEmoticon,
      disablePreview,
      disableSearch,
      disableSkinTones,
      hideShortcodes,
      icons,
      loadBuffer,
    } = this.props;
    const { activeEmoji, activeGroup, activeSkinTone, searchQuery } = this.state;
    const recentEmojis = this.generateRecentEmojis();
    const components = {
      preview: disablePreview ? null : (
        <PreviewBar
          emoji={activeEmoji}
          emojiPath={emojiPath}
          hideEmoticon={hideEmoticon}
          hideShortcodes={hideShortcodes}
        />
      ),
      emojis: (
        <EmojiList
          activeGroup={activeGroup}
          activeSkinTone={activeSkinTone}
          emojiPath={emojiPath}
          emojis={emojis}
          exclude={this.generateExcludeMap()}
          hasRecentlyUsed={this.hasRecentlyUsed()}
          loadBuffer={loadBuffer}
          query={searchQuery}
          recentEmojis={recentEmojis}
          onEnter={this.handleEnterEmoji}
          onLeave={this.handleLeaveEmoji}
          onSelectEmoji={this.handleSelectEmoji}
          onSelectGroup={this.handleSelectGroup}
        />
      ),
      skins: disableSkinTones ? null : (
        <SkinBar
          activeSkinTone={activeSkinTone}
          onSelect={this.handleSelectSkinTone}
        />
      ),
      groups: (
        <GroupBar
          activeGroup={activeGroup}
          emojiPath={emojiPath}
          hasRecentlyUsed={this.hasRecentlyUsed()}
          icons={icons}
          onSelect={this.handleSelectGroup}
        />
      ),
      search: disableSearch ? null : (
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
