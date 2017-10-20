/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

/* eslint-disable react/no-did-update-set-state */

import React from 'react';
import PropTypes from 'prop-types';
import {
  withEmojiData,
  EmojiData,
  EmojiShape,
  EmojiPathShape,
  EmojiSourceShape,
} from 'interweave-emoji';
import EmojiList from './EmojiList';
import EmojiVirtualList from './EmojiVirtualList';
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
  COMMON_MODE_RECENT,
  COMMON_MODE_FREQUENT,
  CONTEXT_CLASSNAMES,
  CONTEXT_MESSAGES,
} from './constants';

import type { Emoji, EmojiPath, EmojiSource } from 'interweave-emoji'; // eslint-disable-line

type CommonEmoji = {
  count: number,
  unicode: string,
};

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
  emojiLargeSize: number,
  emojiPadding: number,
  emojiPath: EmojiPath,
  emojis: Emoji[],
  emojiSize: number,
  emojiSource: EmojiSource,
  exclude: string[],
  hideEmoticon: boolean,
  hideShortcodes: boolean,
  icons: { [key: string]: React$Node },
  maxCommonlyUsed: number,
  maxEmojiVersion: number,
  messages: { [key: string]: string },
  onHoverEmoji: (emoji: Emoji, e: *) => void,
  onScroll: (e: *) => void,
  onScrollGroup: (group: string, e: *) => void,
  onSearch: (query: string, e: *) => void,
  onSelectEmoji: (emoji: Emoji, e: *) => void,
  onSelectGroup: (group: string, e: *) => void,
  onSelectSkinTone: (skinTone: string, e: *) => void,
  rowCount: number,
  virtual: boolean,
};

type PickerState = {
  activeEmoji: ?Emoji, // Emoji to display in the preview
  activeEmojiIndex: number, // Index for the highlighted emoji within search results
  activeGroup: string, // Currently selected group tab
  activeSkinTone: string, // Currently selected skin ton
  commonEmojis: Emoji[], // List of emoji unicodes most commonly used
  emojis: Emoji[], // List of all emojis with search filtering applied
  excluded: ExcludeMap, // Map of excluded emoji hexcodes
  scrollToGroup: string, // Group to scroll to on render
  searchQuery: string, // Current search query
};

class Picker extends React.Component<PickerProps, PickerState> {
  mounted: boolean;

  static childContextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.node),
  };

  static propTypes = {
    autoFocus: PropTypes.bool,
    classNames: PropTypes.objectOf(PropTypes.string),
    columnCount: PropTypes.number,
    commonMode: PropTypes.oneOf([
      COMMON_MODE_RECENT,
      COMMON_MODE_FREQUENT,
    ]),
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
    emojiLargeSize: PropTypes.number.isRequired,
    emojiPadding: PropTypes.number,
    emojiPath: EmojiPathShape.isRequired,
    emojis: PropTypes.arrayOf(EmojiShape).isRequired,
    emojiSize: PropTypes.number.isRequired,
    emojiSource: EmojiSourceShape.isRequired,
    exclude: PropTypes.arrayOf(PropTypes.string),
    hideEmoticon: PropTypes.bool,
    hideShortcodes: PropTypes.bool,
    icons: PropTypes.objectOf(PropTypes.node),
    maxCommonlyUsed: PropTypes.number,
    maxEmojiVersion: PropTypes.number,
    messages: PropTypes.objectOf(PropTypes.node),
    onHoverEmoji: PropTypes.func,
    onScroll: PropTypes.func,
    onScrollGroup: PropTypes.func,
    onSearch: PropTypes.func,
    onSelectEmoji: PropTypes.func,
    onSelectGroup: PropTypes.func,
    onSelectSkinTone: PropTypes.func,
    rowCount: PropTypes.number,
    virtual: PropTypes.bool,
  };

  static defaultProps = {
    autoFocus: false,
    classNames: {},
    columnCount: 10,
    commonMode: COMMON_MODE_RECENT,
    defaultGroup: GROUP_COMMONLY_USED,
    defaultSkinTone: SKIN_NONE,
    disableCommonlyUsed: false,
    disablePreview: false,
    disableSearch: false,
    disableSkinTones: false,
    displayOrder: ['preview', 'emojis', 'groups', 'search'],
    emojiPadding: 0,
    exclude: [],
    hideEmoticon: false,
    hideShortcodes: false,
    icons: {},
    maxCommonlyUsed: 30,
    maxEmojiVersion: 5,
    messages: {},
    onHoverEmoji() {},
    onScroll() {},
    onScrollGroup() {},
    onSearch() {},
    onSelectEmoji() {},
    onSelectGroup() {},
    onSelectSkinTone() {},
    rowCount: 8,
    virtual: false,
  };

  constructor(props: PickerProps) {
    super(props);

    const {
      defaultGroup,
      defaultSkinTone,
      emojis,
      exclude,
    } = props;

    this.state = {
      activeEmoji: null,
      activeEmojiIndex: -1,
      activeGroup: defaultGroup,
      activeSkinTone: this.getSkinToneFromStorage() || defaultSkinTone,
      commonEmojis: [],
      emojis,
      excluded: this.generateExcludeMap(exclude),
      scrollToGroup: '',
      searchQuery: '',
    };
  }

  getChildContext(): Object {
    const { classNames, messages } = this.props;

    return {
      classNames: {
        ...CONTEXT_CLASSNAMES,
        ...classNames,
      },
      messages: {
        ...CONTEXT_MESSAGES,
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

  /**
   * Add a common emoji to local storage and update the current state.
   */
  addCommonEmoji(emoji: Emoji) {
    const { commonMode, disableCommonlyUsed, maxCommonlyUsed } = this.props;
    const { unicode } = emoji;

    if (disableCommonlyUsed) {
      return;
    }

    const commonEmojis = this.getCommonEmojisFromStorage();
    const currentIndex = commonEmojis.findIndex(common => common.unicode === unicode);

    // Add to the front of the list if it doesnt exist
    if (currentIndex === -1) {
      commonEmojis.unshift({
        count: 1,
        unicode,
      });
    }

    // Move to the front of the list and increase count
    if (commonMode === COMMON_MODE_RECENT) {
      if (currentIndex >= 1) {
        const [common] = commonEmojis.splice(currentIndex, 1);

        commonEmojis.unshift({
          count: common.count + 1,
          unicode,
        });
      }

    // Increase count and sort by usage
    } else if (commonMode === COMMON_MODE_FREQUENT) {
      if (currentIndex >= 0) {
        commonEmojis[currentIndex].count += 1;
      }

      commonEmojis.sort((a, b) => b.count - a.count);
    }

    // Trim to the max and store locally
    try {
      localStorage.setItem(
        KEY_COMMONLY_USED,
        JSON.stringify(commonEmojis.slice(0, maxCommonlyUsed)),
      );
    } catch (error) {
      // Do nothing
    }

    this.setState({
      commonEmojis: this.generateCommonEmojis(commonEmojis),
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
    if (emoji.version && emoji.version > maxEmojiVersion) {
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

    const haystack = lookups.join(' ').toLowerCase();

    // Support multi-word and case-insensitive searches
    return searchQuery.toLowerCase().split(' ').some(needle => haystack.indexOf(needle) >= 0);
  }

  /**
   * Return the list of emojis filtered with the search query if applicable,
   * and with skin tone applied if set.
   */
  generateEmojis(emojis: Emoji[], searchQuery: string, skinTone: string): Emoji[] {
    return emojis
      .filter(emoji => this.filterOrSearch(emoji, searchQuery))
      .map(emoji => this.getSkinnedEmoji(emoji, skinTone));
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
  generateCommonEmojis(commonEmojis: CommonEmoji[]): Emoji[] {
    const data = EmojiData.getInstance(this.props.emojiSource.locale);

    return commonEmojis
      .map(emoji => data.EMOJIS[data.UNICODE_TO_HEXCODE[emoji.unicode]])
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
  getCommonEmojisFromStorage(): CommonEmoji[] {
    const common = localStorage.getItem(KEY_COMMONLY_USED);

    return common ? JSON.parse(common) : [];
  }

  /**
   * Return an emoji with skin tone if the active skin tone is set,
   * otherwise return the default skin tone (yellow).
   */
  getSkinnedEmoji(emoji: Emoji, skinTone: string): Emoji {
    if (skinTone === SKIN_NONE || !emoji.skins) {
      return emoji;
    }

    const toneIndex = SKIN_TONES.findIndex(tone => (tone === skinTone));
    const skinnedEmoji = (emoji.skins || []).find(skin => (skin.tone && skin.tone === toneIndex));

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
  handleEnterEmoji = (emoji: Emoji, e: SyntheticEvent<*>) => {
    this.setState({
      activeEmoji: emoji,
    });

    this.props.onHoverEmoji(emoji, e);
  };

  /**
   * Triggered when keyboard changes occur.
   */
  handleKeyUp = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    const { columnCount } = this.props;
    const {
      activeEmoji,
      activeEmojiIndex,
      emojis,
      searchQuery,
    } = this.state;

    // Keyboard functionality is only available while searching
    if (!searchQuery) {
      return;
    }

    // Reset search
    if (e.key === 'Escape') {
      e.preventDefault();

      this.handleSearch('', e);

    // Select active emoji
    } else if (e.key === 'Enter') {
      e.preventDefault();

      if (activeEmoji) {
        this.handleSelectEmoji(activeEmoji, e);
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

        this.handleEnterEmoji(emojis[nextIndex], e);
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
   * Triggered when a group is scrolled into view.
   */
  handleScrollGroup = (group: string, e: SyntheticEvent<*>) => {
    this.setState({
      activeGroup: group,
      scrollToGroup: '',
    });

    this.props.onScrollGroup(group, e);
  };

  /**
   * Triggered when the search input field value changes.
   */
  handleSearch = (query: string, e: SyntheticEvent<*>) => {
    const defaultGroup = this.getDefaultGroup();

    this.setUpdatedEmojis(query, this.state.activeSkinTone);

    this.setState({
      activeGroup: query ? GROUP_SEARCH_RESULTS : defaultGroup,
      scrollToGroup: query ? GROUP_SEARCH_RESULTS : defaultGroup,
      searchQuery: query,
    });

    this.props.onSearch(query, e);
  };

  /**
   * Triggered when an emoji is clicked.
   */
  handleSelectEmoji = (emoji: Emoji, e: SyntheticEvent<*>) => {
    this.addCommonEmoji(emoji);

    this.props.onSelectEmoji(emoji, e);
  };

  /**
   * Triggered when a group tab is clicked. We should reset search and scroll position.
   */
  handleSelectGroup = (group: string, e: SyntheticEvent<*>) => {
    // Search is being reset, so rebuild emojis
    if (this.state.searchQuery !== '') {
      this.setUpdatedEmojis('', this.state.activeSkinTone);
    }

    this.setState({
      activeGroup: group,
      scrollToGroup: group,
      searchQuery: '',
    });

    this.props.onSelectGroup(group, e);
  };

  /**
   * Triggered when a skin tone is clicked.
   */
  handleSelectSkinTone = (skinTone: string, e: SyntheticEvent<*>) => {
    this.setUpdatedEmojis(this.state.searchQuery, skinTone);
    this.setSkinTone(skinTone);

    this.setState({
      activeSkinTone: skinTone,
    });

    this.props.onSelectSkinTone(skinTone, e);
  };

  /**
   * Determine whether to show the commonly used group.
   */
  hasCommonlyUsed(): boolean {
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
      emojis: this.generateEmojis(emojis, '', this.state.activeSkinTone),
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

  /**
   * When the skin tone or search query changes, update the emoji list.
   */
  setUpdatedEmojis(searchQuery: string, skinTone: string) {
    const emojis = this.generateEmojis(this.props.emojis, searchQuery, skinTone);
    const hasResults = (searchQuery && emojis.length > 0);

    this.setState({
      activeEmoji: hasResults ? emojis[0] : null,
      activeEmojiIndex: hasResults ? 0 : -1,
      emojis,
    });
  }

  render(): React$Node {
    const {
      autoFocus,
      columnCount,
      commonMode,
      disablePreview,
      disableSearch,
      disableSkinTones,
      displayOrder,
      emojiLargeSize,
      emojiPadding,
      emojiPath,
      emojiSize,
      emojiSource,
      hideEmoticon,
      hideShortcodes,
      icons,
      rowCount,
      virtual,
      onScroll,
    } = this.props;
    const {
      activeEmoji,
      activeGroup,
      activeSkinTone,
      commonEmojis,
      emojis,
      scrollToGroup,
      searchQuery,
    } = this.state;
    const List = virtual ? EmojiVirtualList : EmojiList;
    const hasCommonlyUsed = this.hasCommonlyUsed();
    const components = {
      emojis: (
        <List
          key="emojis"
          activeEmoji={activeEmoji}
          activeGroup={activeGroup}
          columnCount={columnCount}
          commonEmojis={commonEmojis}
          commonMode={commonMode}
          emojiPadding={emojiPadding}
          emojiPath={emojiPath}
          emojis={emojis}
          emojiSize={emojiSize}
          emojiSource={emojiSource}
          hasCommonlyUsed={hasCommonlyUsed}
          rowCount={rowCount}
          scrollToGroup={scrollToGroup}
          searchQuery={searchQuery}
          skinTonePalette={disableSkinTones ? null : (
            <SkinTonePalette
              key="skins"
              activeSkinTone={activeSkinTone}
              onSelect={this.handleSelectSkinTone}
            />
          )}
          onEnterEmoji={this.handleEnterEmoji}
          onLeaveEmoji={this.handleLeaveEmoji}
          onScroll={onScroll}
          onScrollGroup={this.handleScrollGroup}
          onSelectEmoji={this.handleSelectEmoji}
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
      preview: disablePreview ? null : (
        <PreviewBar
          key="preview"
          emoji={activeEmoji}
          emojiLargeSize={emojiLargeSize}
          emojiPath={emojiPath}
          emojiSource={emojiSource}
          hideEmoticon={hideEmoticon}
          hideShortcodes={hideShortcodes}
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
    const { classNames } = this.getChildContext();
    const classes = [classNames.picker];

    if (virtual) {
      classes.push(classNames.pickerVirtual);
    }

    return (
      <div className={classes.join(' ')}>
        {displayOrder.map(key => components[key])}
      </div>
    );
  }
}

export default withEmojiData(Picker);
