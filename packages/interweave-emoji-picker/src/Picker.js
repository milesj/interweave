/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable react/no-did-update-set-state */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiData from 'interweave/lib/data/EmojiData';
import withEmojiData from 'interweave/lib/loaders/withEmojiData';
import { EmojiShape, EmojiPathShape, EmojiContextShape } from 'interweave/lib/shapes';
import EmojiList from './EmojiList';
import SkinTonePalette from './SkinTonePalette';
import GroupTabs from './GroupTabs';
import PreviewBar from './PreviewBar';
import SearchBar from './SearchBar';
import {
  GROUP_COMMONLY_USED,
  GROUP_SMILEYS_PEOPLE,
  GROUP_ANIMALS_NATURE,
  GROUP_FOOD_DRINK,
  GROUP_TRAVEL_PLACES,
  GROUP_ACTIVITIES,
  GROUP_OBJECTS,
  GROUP_SYMBOLS,
  GROUP_FLAGS,
  GROUP_SEARCH_RESULTS,
  SKIN_TONES,
  SKIN_NONE,
  SKIN_LIGHT,
  SKIN_MEDIUM_LIGHT,
  SKIN_MEDIUM,
  SKIN_MEDIUM_DARK,
  SKIN_DARK,
  KEY_COMMONLY_USED,
  KEY_SKIN_TONE,
} from './constants';

import type { Emoji, EmojiPath } from 'interweave'; // eslint-disable-line

type ExcludeMap = { [hexcode: string]: boolean };

type PickerProps = {
  autoFocus: boolean,
  classNames: { [key: string]: string },
  columnCount: number,
  commonMode: string,
  defaultGroup: string,
  defaultSkinTone: string,
  disableCommonlyUsed: boolean,
  disablePreview: boolean,
  disableSearch: boolean,
  disableSkinTones: boolean,
  displayOrder: string[],
  emojiPath: EmojiPath,
  emojis: Emoji[],
  emojiSize: number,
  exclude: string[],
  hideEmoticon: boolean,
  hideShortcodes: boolean,
  icons: { [key: string]: React$Node },
  maxCommonlyUsed: number,
  maxEmojiVersion: number,
  messages: { [key: string]: string },
  onHoverEmoji: (emoji: Emoji) => void,
  onSearch: (query: string) => void,
  onSelectEmoji: (emoji: Emoji) => void,
  onSelectGroup: (group: string) => void,
  onSelectSkinTone: (skinTone: string) => void,
};

type PickerState = {
  activeEmoji: ?Emoji,        // Emoji to display in the preview
  activeEmojiIndex: number,   // Index for the highlighted emoji within search results
  activeGroup: string,        // Currently selected group tab
  activeSkinTone: string,     // Currently selected skin ton
  commonEmojis: Emoji[],      // List of emoji unicodes most commonly used
  emojis: Emoji[],            // List of all emojis with search filtering applied
  excluded: ExcludeMap,       // Map of excluded emoji hexcodes
  scrollToGroup: string,      // Group to scroll to on render
  searchQuery: string,        // Current search query
};

class Picker extends React.Component<PickerProps, PickerState> {
  static childContextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.node),
  };

  static contextTypes = {
    emoji: EmojiContextShape.isRequired,
  };

  static propTypes = {
    autoFocus: PropTypes.bool,
    classNames: PropTypes.objectOf(PropTypes.string),
    columnCount: PropTypes.number,
    commonMode: PropTypes.oneOf(['recent', 'frequent']),
    defaultGroup: PropTypes.oneOf([
      GROUP_COMMONLY_USED,
      GROUP_SMILEYS_PEOPLE,
      GROUP_ANIMALS_NATURE,
      GROUP_FOOD_DRINK,
      GROUP_TRAVEL_PLACES,
      GROUP_ACTIVITIES,
      GROUP_OBJECTS,
      GROUP_SYMBOLS,
      GROUP_FLAGS,
    ]),
    defaultSkinTone: PropTypes.oneOf([
      SKIN_NONE,
      SKIN_LIGHT,
      SKIN_MEDIUM_LIGHT,
      SKIN_MEDIUM,
      SKIN_MEDIUM_DARK,
      SKIN_DARK,
    ]),
    disableCommonlyUsed: PropTypes.bool,
    disablePreview: PropTypes.bool,
    disableSearch: PropTypes.bool,
    disableSkinTones: PropTypes.bool,
    displayOrder: PropTypes.arrayOf(PropTypes.string),
    emojiPath: EmojiPathShape.isRequired,
    emojiSize: PropTypes.number.isRequired,
    emojis: PropTypes.arrayOf(EmojiShape).isRequired,
    exclude: PropTypes.arrayOf(PropTypes.string),
    hideEmoticon: PropTypes.bool,
    hideShortcodes: PropTypes.bool,
    icons: PropTypes.objectOf(PropTypes.node),
    maxCommonlyUsed: PropTypes.number,
    maxEmojiVersion: PropTypes.number,
    messages: PropTypes.objectOf(PropTypes.node),
    onHoverEmoji: PropTypes.func,
    onSearch: PropTypes.func,
    onSelectEmoji: PropTypes.func,
    onSelectGroup: PropTypes.func,
    onSelectSkinTone: PropTypes.func,
  };

  static defaultProps = {
    autoFocus: false,
    classNames: {},
    columnCount: 10,
    commonMode: 'recent',
    defaultGroup: GROUP_COMMONLY_USED,
    defaultSkinTone: SKIN_NONE,
    disableCommonlyUsed: false,
    disablePreview: false,
    disableSearch: false,
    disableSkinTones: false,
    displayOrder: ['preview', 'emojis', 'skins', 'groups', 'search'],
    exclude: [],
    messages: {},
    hideEmoticon: false,
    hideShortcodes: false,
    icons: {},
    maxCommonlyUsed: 30,
    maxEmojiVersion: 5,
    onHoverEmoji() {},
    onSearch() {},
    onSelectEmoji() {},
    onSelectGroup() {},
    onSelectSkinTone() {},
  };

  constructor(props: PickerProps, context: Object) {
    super(props, context);

    const {
      defaultGroup,
      defaultSkinTone,
      emojis,
      exclude,
    } = props;

    this.state = {
      emojis,
      activeEmoji: null,
      activeEmojiIndex: -1,
      activeGroup: defaultGroup,
      activeSkinTone: this.getSkinToneFromStorage() || defaultSkinTone,
      commonEmojis: [],
      excluded: this.generateExcludeMap(exclude),
      scrollToGroup: '',
      searchQuery: '',
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
        skinTone: 'interweave-picker__skin-tone',
        skinToneActive: 'interweave-picker__skin-tone--active',
        skinTones: 'interweave-picker__skin-tones',
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
        frequentlyUsed: 'Frequently Used',
        recentlyUsed: 'Recently Used',
        [GROUP_SMILEYS_PEOPLE]: 'Smileys & People',
        [GROUP_ANIMALS_NATURE]: 'Animals & Nature',
        [GROUP_FOOD_DRINK]: 'Food & Drink',
        [GROUP_TRAVEL_PLACES]: 'Travel & Places',
        [GROUP_ACTIVITIES]: 'Activities',
        [GROUP_OBJECTS]: 'Objects',
        [GROUP_SYMBOLS]: 'Symbols',
        [GROUP_FLAGS]: 'Flags',
        [GROUP_SEARCH_RESULTS]: 'Search Results',
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

  componentWillMount() {
    // Emoji data has already been loaded
    if (this.props.emojis.length !== 0) {
      this.setInitialEmojis(this.props.emojis);
    }
  }

  componentWillReceiveProps({ emojis }: PickerProps) {
    // Emoji data has loaded via the `withEmojiData` HOC
    if (emojis.length !== 0 && this.props.emojis.length === 0) {
      this.setInitialEmojis(emojis);
    }
  }

  componentDidUpdate(prevProps: PickerProps, prevState: PickerState) {
    const { activeSkinTone, searchQuery } = this.state;

    // Regenerate emoji list when:
    if (
      // Skin tone changes
      activeSkinTone !== prevState.activeSkinTone ||
      // Search query changes
      searchQuery !== prevState.searchQuery
    ) {
      const emojis = this.generateEmojis(prevProps.emojis, searchQuery);
      const hasResults = (searchQuery && emojis.length > 0);

      this.setState({
        emojis,
        activeEmoji: hasResults ? emojis[0] : null,
        activeEmojiIndex: hasResults ? 0 : -1,
      });
    }
  }

  /**
   * Add a common emoji to local storage and update the current state.
   */
  addCommonEmoji(emoji: Emoji) {
    const { disableCommonlyUsed, maxCommonlyUsed } = this.props;

    if (disableCommonlyUsed) {
      return;
    }

    let unicodes = this.state.commonEmojis.map(common => common.unicode);

    // Add to the top of the list
    unicodes.unshift(emoji.unicode);

    // Trim to the max
    unicodes = unicodes.slice(0, maxCommonlyUsed);

    // Remove duplicates
    unicodes = Array.from(new Set(unicodes));

    try {
      localStorage.setItem(KEY_COMMONLY_USED, JSON.stringify(unicodes));
    } catch (error) {
      // Do nothing
    }

    this.setState({
      commonEmojis: this.generateCommonEmojis(unicodes),
    });
  }

  /**
   * Filter the dataset with the search query against a set of emoji properties.
   */
  filterOrSearch(emoji: Emoji, searchQuery: string): boolean {
    const { maxEmojiVersion } = this.props;
    const { excluded } = this.state;

    // Remove excluded emojis
    if (excluded[emoji.hexcode]) {
      return false;
    }

    // Remove emojis released in newer versions (compact doesnt have a version)
    if ('version' in emoji && emoji.version > maxEmojiVersion) {
      return false;
    }

    // No query to filter with
    if (!searchQuery) {
      return true;
    }

    const lookups = [];

    if (emoji.canonical_shortcodes) {
      lookups.push(...emoji.canonical_shortcodes);
    }

    if (emoji.tags) {
      lookups.push(...emoji.tags);
    }

    if (emoji.annotation) {
      lookups.push(emoji.annotation);
    }

    if (emoji.emoticon) {
      lookups.push(emoji.emoticon);
    }

    const haystack = lookups.join(' ');

    // Support multi-word searches
    return searchQuery.split(' ').some(needle => haystack.indexOf(needle) >= 0);
  }

  /**
   * Return the list of emojis filtered with the search query if applicable,
   * and with skin tone applied if set.
   */
  generateEmojis(emojis: Emoji[], searchQuery: string = ''): Emoji[] {
    return emojis
      .filter(emoji => this.filterOrSearch(emoji, searchQuery))
      .map(emoji => this.getSkinnedEmoji(emoji));
  }

  /**
   * Convert the `exclude` prop to a map for quicker lookups.
   */
  generateExcludeMap(exclude: string[]): ExcludeMap {
    const map = {};

    exclude.forEach((hexcode) => {
      map[hexcode] = true;
    });

    return map;
  }

  /**
   * We only store the unicode character for commonly used emojis,
   * so we need to rebuild the list with full emoji objects.
   */
  generateCommonEmojis(unicodes: string[]): Emoji[] {
    const data = EmojiData.getInstance(this.context.emoji.locale);

    return unicodes
      .map(unicode => data.EMOJIS[unicode])
      .filter(Boolean);
  }

  /**
   * Return the default group while handling commonly used scenarios.
   */
  getDefaultGroup(): string {
    const { defaultGroup } = this.props;

    if (defaultGroup === GROUP_COMMONLY_USED && !this.hasCommonlyUsed()) {
      return GROUP_SMILEYS_PEOPLE;
    }

    return defaultGroup;
  }

  /**
   * Return the commonly used emojis from local storage.
   */
  getCommonEmojisFromStorage(): string[] {
    const common = localStorage.getItem(KEY_COMMONLY_USED);

    return common ? JSON.parse(common) : [];
  }

  /**
   * Return an emoji with skin tone if the active skin tone is set,
   * otherwise return the default skin tone (yellow).
   */
  getSkinnedEmoji(emoji: Emoji): Emoji {
    const { activeSkinTone } = this.state;

    if (activeSkinTone === SKIN_NONE || !emoji.skins) {
      return emoji;
    }

    const toneIndex = SKIN_TONES.findIndex(skinTone => (skinTone === activeSkinTone));
    const skinnedEmoji = (emoji.skins || []).find(skin => (skin.tone && skin.tone === toneIndex));

    // $FlowIgnore
    return skinnedEmoji || emoji;
  }

  /**
   * Return the user's favorite skin tone from local storage.
   */
  getSkinToneFromStorage(): ?string {
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
   * Triggered when keyboard changes occur.
   */
  handleKeyUp = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    const { columnCount } = this.props;
    const { activeEmoji, activeEmojiIndex, emojis, searchQuery } = this.state;

    // Keyboard functionality is only available while searching
    if (!searchQuery) {
      return;
    }

    // Reset search
    if (e.key === 'Escape') {
      e.preventDefault();

      this.handleSearch('');

    // Select active emoji
    } else if (e.key === 'Enter') {
      e.preventDefault();

      if (activeEmoji) {
        this.handleSelectEmoji(activeEmoji);
      }

    // Cycle search results
    } else {
      e.preventDefault();

      let nextIndex = -1;

      switch (e.key) {
        case 'ArrowLeft':
          nextIndex = activeEmojiIndex - 1;
          break;
        case 'ArrowRight':
          nextIndex = activeEmojiIndex + 1;
          break;
        case 'ArrowUp':
          nextIndex = activeEmojiIndex - columnCount;
          break;
        case 'ArrowDown':
          nextIndex = activeEmojiIndex + columnCount;
          break;
        default:
          return;
      }

      if (nextIndex >= 0 && nextIndex < emojis.length) {
        this.setState({
          activeEmojiIndex: nextIndex,
        });

        this.handleEnterEmoji(emojis[nextIndex]);
      }
    }
  }

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
    const defaultGroup = this.getDefaultGroup();

    this.setState({
      activeGroup: query ? '' : defaultGroup,
      scrollToGroup: query ? '' : defaultGroup,
      searchQuery: query,
    });

    this.props.onSearch(query);
  };

  /**
   * Triggered when an emoji is clicked.
   */
  handleSelectEmoji = (emoji: Emoji) => {
    this.addCommonEmoji(emoji);

    this.props.onSelectEmoji(emoji);
  };

  /**
   * Triggered when a group tab is clicked or scrolled to.
   *
   * When clicked via the tab, we should reset search and scroll position.
   */
  handleSelectGroup = (group: string, reset: boolean = false) => {
    this.setState(prevState => ({
      activeGroup: group,
      scrollToGroup: reset ? group : '',
      searchQuery: reset ? '' : prevState.searchQuery,
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
   * Determine whether to show the commonly used group.
   */
  hasCommonlyUsed() {
    return (!this.props.disableCommonlyUsed && this.getCommonEmojisFromStorage().length > 0);
  }

  /**
   * Set the initial emoji state once emoji data has loaded.
   */
  setInitialEmojis(emojis: Emoji[]) {
    const defaultGroup = this.getDefaultGroup();

    this.setState({
      activeGroup: defaultGroup,
      commonEmojis: this.generateCommonEmojis(this.getCommonEmojisFromStorage()),
      emojis: this.generateEmojis(emojis),
      scrollToGroup: defaultGroup,
    });
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
      commonMode,
      displayOrder,
      emojiPath,
      emojiSize,
      hideEmoticon,
      disablePreview,
      disableSearch,
      disableSkinTones,
      hideShortcodes,
      icons,
    } = this.props;
    const {
      activeEmoji,
      activeEmojiIndex,
      activeGroup,
      activeSkinTone,
      commonEmojis,
      emojis,
      scrollToGroup,
      searchQuery,
    } = this.state;
    const hasCommonlyUsed = this.hasCommonlyUsed();
    const components = {
      preview: disablePreview ? null : (
        <PreviewBar
          key="preview"
          emoji={activeEmoji}
          emojiPath={emojiPath}
          hideEmoticon={hideEmoticon}
          hideShortcodes={hideShortcodes}
        />
      ),
      emojis: (
        <EmojiList
          key="emojis"
          activeEmojiIndex={activeEmojiIndex}
          activeGroup={activeGroup}
          commonEmojis={commonEmojis}
          commonMode={commonMode}
          emojiPath={emojiPath}
          emojis={emojis}
          emojiSize={emojiSize}
          hasCommonlyUsed={hasCommonlyUsed}
          scrollToGroup={scrollToGroup}
          searchQuery={searchQuery}
          onEnterEmoji={this.handleEnterEmoji}
          onLeaveEmoji={this.handleLeaveEmoji}
          onSelectEmoji={this.handleSelectEmoji}
          onSelectGroup={this.handleSelectGroup}
        />
      ),
      skins: disableSkinTones ? null : (
        <SkinTonePalette
          key="skins"
          activeSkinTone={activeSkinTone}
          onSelect={this.handleSelectSkinTone}
        />
      ),
      groups: (
        <GroupTabs
          key="groups"
          activeGroup={activeGroup}
          emojiPath={emojiPath}
          hasCommonlyUsed={hasCommonlyUsed}
          icons={icons}
          onSelect={this.handleSelectGroup}
        />
      ),
      search: disableSearch ? null : (
        <SearchBar
          key="search"
          autoFocus={autoFocus}
          searchQuery={searchQuery}
          onChange={this.handleSearch}
          onKeyUp={this.handleKeyUp}
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
