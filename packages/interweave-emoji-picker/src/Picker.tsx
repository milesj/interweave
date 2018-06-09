/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

/* eslint-disable no-magic-numbers */

import React from 'react';
import PropTypes from 'prop-types';
import {
  CanonicalEmoji,
  withEmojiData,
  EmojiDataProps,
  EmojiShape,
  Path,
  PathShape,
  Source,
  SourceShape,
} from 'interweave-emoji';
import { Hexcode, Unicode } from 'emojibase';
import { Context } from './Context';
import EmojiList from './EmojiList';
import EmojiVirtualList from './EmojiVirtualList';
import SkinTonePalette from './SkinTonePalette';
import GroupTabs from './GroupTabs';
import PreviewBar from './PreviewBar';
import SearchBar from './SearchBar';
import {
  GROUP_KEY_COMMONLY_USED,
  GROUP_KEY_SMILEYS_PEOPLE,
  GROUP_KEY_ANIMALS_NATURE,
  GROUP_KEY_FOOD_DRINK,
  GROUP_KEY_TRAVEL_PLACES,
  GROUP_KEY_ACTIVITIES,
  GROUP_KEY_OBJECTS,
  GROUP_KEY_SYMBOLS,
  GROUP_KEY_FLAGS,
  GROUP_KEY_SEARCH_RESULTS,
  GROUP_KEY_NONE,
  SKIN_TONES,
  SKIN_KEY_NONE,
  SKIN_KEY_LIGHT,
  SKIN_KEY_MEDIUM_LIGHT,
  SKIN_KEY_MEDIUM,
  SKIN_KEY_MEDIUM_DARK,
  SKIN_KEY_DARK,
  KEY_COMMONLY_USED,
  KEY_SKIN_TONE,
  COMMON_MODE_RECENT,
  COMMON_MODE_FREQUENT,
  CONTEXT_CLASSNAMES,
  CONTEXT_MESSAGES,
} from './constants';
import { CommonEmoji, CommonMode, Context as EmojiContext, GroupKey, SkinToneKey } from './types';

export interface BlackWhiteMap {
  [hexcode: string]: boolean;
}

export interface PickerProps {
  autoFocus?: boolean;
  blacklist?: Hexcode[];
  classNames?: { [key: string]: string };
  columnCount?: number;
  commonMode?: CommonMode;
  defaultGroup?: GroupKey;
  defaultSkinTone?: SkinToneKey;
  disableCommonlyUsed?: boolean;
  disableGroups?: boolean;
  disablePreview?: boolean;
  disableSearch?: boolean;
  disableSkinTones?: boolean;
  displayOrder?: string[];
  emojiLargeSize: number;
  emojiPadding?: number;
  emojiPath: Path;
  emojiSize: number;
  groupIcons?: { [key: string]: React.ReactNode };
  hideEmoticon?: boolean;
  hideGroupHeaders?: boolean;
  hideShortcodes?: boolean;
  maxCommonlyUsed?: number;
  maxEmojiVersion?: number;
  messages?: { [key: string]: string };
  onHoverEmoji?: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  onScroll?: () => void;
  onScrollGroup?: (group: GroupKey) => void;
  onSearch?: (query: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectEmoji?: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  onSelectGroup?: (group: GroupKey, event: React.MouseEvent<HTMLButtonElement>) => void;
  onSelectSkinTone?: (skinTone: SkinToneKey, event: React.MouseEvent<HTMLButtonElement>) => void;
  rowCount?: number;
  skinIcons?: { [key: string]: React.ReactNode };
  virtual?: boolean;
  whitelist?: Hexcode[];
}

export interface PickerState {
  activeEmoji: CanonicalEmoji | null; // Emoji to display in the preview
  activeEmojiIndex: number; // Index for the highlighted emoji within search results
  activeGroup: GroupKey; // Currently selected group tab
  activeSkinTone: SkinToneKey; // Currently selected skin ton
  blacklisted: BlackWhiteMap; // Map of blacklisted emoji hexcodes (without skin modifier)
  commonEmojis: CanonicalEmoji[]; // List of emoji hexcodes most commonly used
  context: EmojiContext;
  emojis: CanonicalEmoji[]; // List of all emojis with search filtering applied
  scrollToGroup: GroupKey | ''; // Group to scroll to on render
  searchQuery: string; // Current search query
  whitelisted: BlackWhiteMap; // Map of whitelisted emoji hexcodes (without skin modifier)
}

export type PickerUnifiedProps = PickerProps & EmojiDataProps;

const SKIN_MODIFIER_PATTERN: RegExp = /1F3FB|1F3FC|1F3FD|1F3FE|1F3FF/g;

export class Picker extends React.Component<PickerUnifiedProps, PickerState> {
  static propTypes = {
    autoFocus: PropTypes.bool,
    blacklist: PropTypes.arrayOf(PropTypes.string),
    classNames: PropTypes.objectOf(PropTypes.string),
    columnCount: PropTypes.number,
    commonMode: PropTypes.oneOf([COMMON_MODE_RECENT, COMMON_MODE_FREQUENT]),
    defaultGroup: PropTypes.oneOf([
      GROUP_KEY_COMMONLY_USED,
      GROUP_KEY_SMILEYS_PEOPLE,
      GROUP_KEY_ANIMALS_NATURE,
      GROUP_KEY_FOOD_DRINK,
      GROUP_KEY_TRAVEL_PLACES,
      GROUP_KEY_ACTIVITIES,
      GROUP_KEY_OBJECTS,
      GROUP_KEY_SYMBOLS,
      GROUP_KEY_FLAGS,
    ]),
    defaultSkinTone: PropTypes.oneOf([
      SKIN_KEY_NONE,
      SKIN_KEY_LIGHT,
      SKIN_KEY_MEDIUM_LIGHT,
      SKIN_KEY_MEDIUM,
      SKIN_KEY_MEDIUM_DARK,
      SKIN_KEY_DARK,
    ]),
    disableCommonlyUsed: PropTypes.bool,
    disableGroups: PropTypes.bool,
    disablePreview: PropTypes.bool,
    disableSearch: PropTypes.bool,
    disableSkinTones: PropTypes.bool,
    displayOrder: PropTypes.arrayOf(PropTypes.string),
    // eslint-disable-next-line react/forbid-prop-types
    emojiData: PropTypes.object.isRequired,
    emojiLargeSize: PropTypes.number.isRequired,
    emojiPadding: PropTypes.number,
    emojiPath: PathShape.isRequired,
    emojis: PropTypes.arrayOf(EmojiShape).isRequired,
    emojiSize: PropTypes.number.isRequired,
    emojiSource: SourceShape.isRequired,
    groupIcons: PropTypes.objectOf(PropTypes.node),
    hideEmoticon: PropTypes.bool,
    hideGroupHeaders: PropTypes.bool,
    hideShortcodes: PropTypes.bool,
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
    skinIcons: PropTypes.objectOf(PropTypes.node),
    virtual: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        columnPadding: PropTypes.number,
        rowPadding: PropTypes.number,
      }),
    ]),
    whitelist: PropTypes.arrayOf(PropTypes.string),
  };

  static defaultProps = {
    autoFocus: false,
    blacklist: [],
    classNames: {},
    columnCount: 10,
    commonMode: COMMON_MODE_RECENT as CommonMode,
    defaultGroup: GROUP_KEY_COMMONLY_USED as GroupKey,
    defaultSkinTone: SKIN_KEY_NONE as SkinToneKey,
    disableCommonlyUsed: false,
    disableGroups: false,
    disablePreview: false,
    disableSearch: false,
    disableSkinTones: false,
    displayOrder: ['preview', 'emojis', 'groups', 'search'],
    emojiPadding: 0,
    groupIcons: {},
    hideEmoticon: false,
    hideGroupHeaders: false,
    hideShortcodes: false,
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
    skinIcons: {},
    virtual: false,
    whitelist: [],
  };

  constructor(props: PickerUnifiedProps) {
    super(props);

    const {
      blacklist,
      classNames,
      defaultGroup,
      defaultSkinTone,
      emojis,
      messages,
      whitelist,
    } = props as Required<PickerUnifiedProps>;

    this.state = {
      activeEmoji: null,
      activeEmojiIndex: -1,
      activeGroup: defaultGroup,
      activeSkinTone: this.getSkinToneFromStorage() || defaultSkinTone,
      blacklisted: this.generateBlackWhiteMap(blacklist),
      commonEmojis: [],
      context: {
        classNames: {
          ...CONTEXT_CLASSNAMES,
          ...classNames,
        },
        messages: {
          ...CONTEXT_MESSAGES,
          ...messages,
        },
      },
      emojis,
      scrollToGroup: '',
      searchQuery: '',
      whitelisted: this.generateBlackWhiteMap(whitelist),
    };
  }

  componentDidMount() {
    // Emoji data has already been loaded
    if (this.props.emojis.length !== 0) {
      this.setInitialEmojis();
    }
  }

  componentDidUpdate(prevProps: PickerUnifiedProps) {
    // Emoji data has loaded via the `withEmojiData` HOC
    if (this.props.emojis.length !== 0 && prevProps.emojis.length === 0) {
      this.setInitialEmojis();
    }
  }

  /**
   * Add a common emoji to local storage and update the current state.
   */
  addCommonEmoji(emoji: CanonicalEmoji) {
    const { commonMode, disableCommonlyUsed, maxCommonlyUsed } = this.props;
    const { hexcode } = emoji;

    if (disableCommonlyUsed) {
      return;
    }

    const commonEmojis = this.getCommonEmojisFromStorage();
    const currentIndex = commonEmojis.findIndex(common => common.hexcode === hexcode);

    // Add to the front of the list if it doesnt exist
    if (currentIndex === -1) {
      commonEmojis.unshift({
        count: 1,
        hexcode,
      });
    }

    // Move to the front of the list and increase count
    if (commonMode === COMMON_MODE_RECENT) {
      if (currentIndex >= 1) {
        const [common] = commonEmojis.splice(currentIndex, 1);

        commonEmojis.unshift({
          count: common.count + 1,
          hexcode,
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
  // eslint-disable-next-line complexity
  filterOrSearch(emoji: CanonicalEmoji, searchQuery: string): boolean {
    const { blacklist, maxEmojiVersion, whitelist } = this.props as Required<PickerUnifiedProps>;
    const { blacklisted, whitelisted } = this.state;

    // Remove blacklisted emojis and non-whitelisted emojis
    if (
      (blacklist.length > 0 && blacklisted[emoji.hexcode]) ||
      (whitelist.length > 0 && !whitelisted[emoji.hexcode])
    ) {
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
    return searchQuery
      .toLowerCase()
      .split(' ')
      .some(needle => haystack.indexOf(needle) >= 0);
  }

  /**
   * Return the list of emojis filtered with the search query if applicable,
   * and with skin tone applied if set.
   */
  generateEmojis(
    emojis: CanonicalEmoji[],
    searchQuery: string,
    skinTone: SkinToneKey,
  ): CanonicalEmoji[] {
    return emojis
      .filter(emoji => this.filterOrSearch(emoji, searchQuery))
      .map(emoji => this.getSkinnedEmoji(emoji, skinTone));
  }

  /**
   * Convert the `blacklist` or `whitelist` prop to a map for quicker lookups.
   */
  generateBlackWhiteMap(list: string[]): BlackWhiteMap {
    const map: BlackWhiteMap = {};

    list.forEach(hexcode => {
      if (process.env.NODE_ENV !== 'production') {
        if (hexcode.match(SKIN_MODIFIER_PATTERN)) {
          // eslint-disable-next-line no-console
          console.warn(
            `Hexcode with a skin modifier has been detected: ${hexcode}`,
            'Emojis without skin modifiers are required for blacklist/whitelist.',
          );
        }
      }

      map[hexcode] = true;
    });

    return map;
  }

  /**
   * We only store the hexcode character for commonly used emojis,
   * so we need to rebuild the list with full emoji objects.
   */
  generateCommonEmojis(commonEmojis: CommonEmoji[]): CanonicalEmoji[] {
    if (this.props.disableCommonlyUsed) {
      return [];
    }

    const data = this.props.emojiData;

    return commonEmojis.map(emoji => data.EMOJIS[emoji.hexcode]).filter(Boolean);
  }

  /**
   * Return the default group while handling commonly used scenarios.
   */
  getDefaultGroup(): GroupKey {
    const { defaultGroup, disableGroups } = this.props;
    let group = defaultGroup!;

    // Allow commonly used before "none" groups
    if (group === GROUP_KEY_COMMONLY_USED) {
      if (this.state.commonEmojis.length > 0) {
        return GROUP_KEY_COMMONLY_USED;
      }

      group = GROUP_KEY_SMILEYS_PEOPLE;
    }

    return disableGroups ? GROUP_KEY_NONE : group;
  }

  /**
   * Return the commonly used emojis from local storage.
   */
  getCommonEmojisFromStorage(): CommonEmoji[] {
    if (this.props.disableCommonlyUsed) {
      return [];
    }

    const rawCommon = localStorage.getItem(KEY_COMMONLY_USED);
    const common: CommonEmoji[] = rawCommon ? JSON.parse(rawCommon) : [];
    const data = this.props.emojiData;

    // Previous versions stored the unicode character,
    // while newer ones store a hexcode. We should support both.
    return common.map(row => {
      if (row.unicode) {
        return {
          count: row.count,
          hexcode: data.UNICODE_TO_HEXCODE[row.unicode],
        };
      }

      return row;
    });
  }

  /**
   * Return an emoji with skin tone if the active skin tone is set,
   * otherwise return the default skin tone (yellow).
   */
  getSkinnedEmoji(emoji: CanonicalEmoji, skinTone: SkinToneKey): CanonicalEmoji {
    if (skinTone === SKIN_KEY_NONE || !emoji.skins) {
      return emoji;
    }

    const toneIndex = SKIN_TONES.findIndex(tone => tone === skinTone);
    const skinnedEmoji = (emoji.skins || []).find(skin => !!skin.tone && skin.tone === toneIndex);

    return (skinnedEmoji || emoji) as CanonicalEmoji;
  }

  /**
   * Return the user's favorite skin tone from local storage.
   */
  getSkinToneFromStorage(): SkinToneKey | null {
    const tone = localStorage.getItem(KEY_SKIN_TONE);

    if (tone) {
      return tone as SkinToneKey;
    }

    return null;
  }

  /**
   * Triggered when the mouse hovers an emoji.
   */
  private handleEnterEmoji = (
    emoji: CanonicalEmoji,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    this.setState({
      activeEmoji: emoji,
    });

    this.props.onHoverEmoji!(emoji, event);
  };

  /**
   * Triggered when keyboard changes occur.
   */
  private handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { columnCount = 10 } = this.props;
    const { activeEmoji, activeEmojiIndex, emojis, searchQuery } = this.state;

    // Keyboard functionality is only available while searching
    if (!searchQuery) {
      return;
    }

    // Reset search
    if (event.key === 'Escape') {
      event.preventDefault();

      // @ts-ignore Allow other event
      this.handleSearch('', event);

      // Select active emoji
    } else if (event.key === 'Enter') {
      event.preventDefault();

      if (activeEmoji) {
        // @ts-ignore Allow other event
        this.handleSelectEmoji(activeEmoji, event);
      }

      // Cycle search results
    } else {
      event.preventDefault();

      let nextIndex = -1;

      switch (event.key) {
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

        // @ts-ignore Allow other event
        this.handleEnterEmoji(emojis[nextIndex], event);
      }
    }
  };

  /**
   * Triggered when the mouse no longer hovers an emoji.
   */
  private handleLeaveEmoji = () => {
    this.setState({
      activeEmoji: null,
    });
  };

  /**
   * Triggered when a group is scrolled into view.
   */
  private handleScrollGroup = (group: GroupKey) => {
    this.setState({
      activeGroup: group,
      scrollToGroup: '',
    });

    this.props.onScrollGroup!(group);
  };

  /**
   * Triggered when the search input field value changes.
   */
  private handleSearch = (query: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const defaultGroup = this.getDefaultGroup();

    this.setUpdatedEmojis(query, this.state.activeSkinTone);

    this.setState({
      activeGroup: query ? GROUP_KEY_SEARCH_RESULTS : defaultGroup,
      scrollToGroup: query ? GROUP_KEY_SEARCH_RESULTS : defaultGroup,
      searchQuery: query,
    });

    this.props.onSearch!(query, event);
  };

  /**
   * Triggered when an emoji is clicked.
   */
  private handleSelectEmoji = (
    emoji: CanonicalEmoji,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    this.addCommonEmoji(emoji);

    this.props.onSelectEmoji!(emoji, event);
  };

  /**
   * Triggered when a group tab is clicked. We should reset search and scroll position.
   */
  private handleSelectGroup = (group: GroupKey, event: React.MouseEvent<HTMLButtonElement>) => {
    // Search is being reset, so rebuild emojis
    if (this.state.searchQuery !== '') {
      this.setUpdatedEmojis('', this.state.activeSkinTone);
    }

    this.setState({
      activeGroup: group,
      scrollToGroup: group,
      searchQuery: '',
    });

    this.props.onSelectGroup!(group, event);
  };

  /**
   * Triggered when a skin tone is clicked.
   */
  private handleSelectSkinTone = (
    skinTone: SkinToneKey,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    this.setUpdatedEmojis(this.state.searchQuery, skinTone);
    this.setSkinTone(skinTone);

    this.setState({
      activeSkinTone: skinTone,
    });

    this.props.onSelectSkinTone!(skinTone, event);
  };

  /**
   * Set the initial emoji state once emoji data has loaded.
   */
  setInitialEmojis() {
    const defaultGroup = this.getDefaultGroup();
    const { emojis } = this.props;

    this.setState(prevState => ({
      activeGroup: defaultGroup,
      commonEmojis: this.generateCommonEmojis(this.getCommonEmojisFromStorage()),
      emojis: this.generateEmojis(emojis, '', prevState.activeSkinTone),
      scrollToGroup: defaultGroup,
    }));
  }

  /**
   * Set the users favorite skin tone into local storage.
   */
  setSkinTone(skinTone: SkinToneKey) {
    try {
      localStorage.setItem(KEY_SKIN_TONE, skinTone);
    } catch (error) {
      // Do nothing
    }
  }

  /**
   * When the skin tone or search query changes, update the emoji list.
   */
  setUpdatedEmojis(searchQuery: string, skinTone: SkinToneKey) {
    const emojis = this.generateEmojis(this.props.emojis, searchQuery, skinTone);
    const hasResults = searchQuery && emojis.length > 0;

    this.setState({
      activeEmoji: hasResults ? emojis[0] : null,
      activeEmojiIndex: hasResults ? 0 : -1,
      emojis,
    });
  }

  render() {
    const {
      autoFocus,
      columnCount,
      commonMode,
      disableGroups,
      disablePreview,
      disableSearch,
      disableSkinTones,
      displayOrder,
      emojiLargeSize,
      emojiPadding,
      emojiPath,
      emojiSize,
      emojiSource,
      groupIcons,
      hideEmoticon,
      hideGroupHeaders,
      hideShortcodes,
      rowCount,
      skinIcons,
      virtual,
      onScroll,
    } = this.props as Required<PickerUnifiedProps>;
    const {
      activeEmoji,
      activeGroup,
      activeSkinTone,
      commonEmojis,
      context,
      emojis,
      scrollToGroup,
      searchQuery,
    } = this.state;
    const List = virtual ? EmojiVirtualList : EmojiList;
    const skinTones = disableSkinTones ? null : (
      <SkinTonePalette
        key="skins"
        activeSkinTone={activeSkinTone}
        icons={skinIcons}
        onSelect={this.handleSelectSkinTone}
      />
    );
    const components: { [name: string]: React.ReactElement<any> | null } = {
      emojis: (
        <List
          key="emojis"
          {...(typeof virtual === 'object' ? virtual : {})}
          activeEmoji={activeEmoji}
          activeGroup={activeGroup}
          columnCount={columnCount}
          commonEmojis={commonEmojis}
          commonMode={commonMode}
          disableGroups={disableGroups}
          emojiPadding={emojiPadding}
          emojiPath={emojiPath}
          emojis={emojis}
          emojiSize={emojiSize}
          emojiSource={emojiSource}
          hideGroupHeaders={hideGroupHeaders}
          rowCount={rowCount}
          scrollToGroup={scrollToGroup}
          searchQuery={searchQuery}
          skinTonePalette={displayOrder.includes('skin-tones') ? null : skinTones}
          onEnterEmoji={this.handleEnterEmoji}
          onLeaveEmoji={this.handleLeaveEmoji}
          onScroll={onScroll}
          onScrollGroup={this.handleScrollGroup}
          onSelectEmoji={this.handleSelectEmoji}
        />
      ),
      groups: disableGroups ? null : (
        <GroupTabs
          key="groups"
          activeGroup={activeGroup}
          commonEmojis={commonEmojis}
          icons={groupIcons}
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
      'skin-tones': skinTones,
    };
    const classes = [context.classNames.picker];

    if (virtual) {
      classes.push(context.classNames.pickerVirtual);
    }

    return (
      <Context.Provider value={context}>
        <div className={classes.join(' ')}>{displayOrder.map(key => components[key])}</div>
      </Context.Provider>
    );
  }
}

export default withEmojiData(Picker);
