/* eslint-disable no-magic-numbers */

import React from 'react';
import debounce from 'lodash/debounce';
import {
  useEmojiData,
  UseEmojiDataOptions,
  CanonicalEmoji,
  Path,
  Source,
  EmojiDataManager,
} from 'interweave-emoji';
import { Hexcode } from 'emojibase';
import EmojiList from './EmojiList';
import SkinTonePalette from './SkinTonePalette';
import GroupTabs from './GroupTabs';
import PreviewBar from './PreviewBar';
import SearchBar from './SearchBar';
import Context from './Context';
import {
  GROUPS,
  GROUP_KEY_COMMONLY_USED,
  GROUP_KEY_SMILEYS_PEOPLE,
  GROUP_KEY_SEARCH_RESULTS,
  GROUP_KEY_NONE,
  SKIN_TONES,
  SKIN_KEY_NONE,
  KEY_COMMONLY_USED,
  KEY_SKIN_TONE,
  COMMON_MODE_RECENT,
  COMMON_MODE_FREQUENT,
  CONTEXT_CLASSNAMES,
  CONTEXT_MESSAGES,
  SEARCH_THROTTLE,
} from './constants';
import {
  CommonEmoji,
  CommonMode,
  Context as EmojiContext,
  DisplayOrder,
  GroupKey,
  SkinToneKey,
  GroupEmojiMap,
} from './types';

export interface BlackWhiteMap {
  [hexcode: string]: boolean;
}

export interface PickerProps {
  /** Focus the search bar on mount. */
  autoFocus?: boolean;
  /** List of emoji hexcodes to hide. */
  blacklist?: Hexcode[];
  /** Mapping of custom CSS class names. */
  classNames?: { [key: string]: string };
  /** Icon to display within the clear commonly used button. Omit the icon to hide the button. */
  clearIcon?: React.ReactNode;
  /** Number of emojis to display horizontally. */
  columnCount?: number;
  /** Type of commonly used mode. */
  commonMode?: CommonMode;
  /** Group to select by default. */
  defaultGroup?: GroupKey;
  /** Skin tone to select by default (if not found in local storage). */
  defaultSkinTone?: SkinToneKey;
  /** Disable commonly used functionality. */
  disableCommonlyUsed?: boolean;
  /** Disable and hide group tabs. */
  disableGroups?: boolean;
  /** Disable and hide preview bar. */
  disablePreview?: boolean;
  /** Disable and hide search bar. */
  disableSearch?: boolean;
  /** Disable and hide skin tone palette bar. */
  disableSkinTones?: boolean;
  /** Order to render components in. */
  displayOrder?: DisplayOrder[];
  /** Size of the emoji within the preview bar. */
  emojiLargeSize: number;
  /** Padding around each emoji. */
  emojiPadding?: number;
  /** Path to an SVG/PNG. Accepts a string or a callback that is passed the hexcode. */
  emojiPath: Path;
  /** Pixel size of emoji within the list. */
  emojiSize: number;
  /** Mapping of custom icons for each group tab. */
  groupIcons?: { [key: string]: React.ReactNode };
  /** Hide emoticons within the preview bar. */
  hideEmoticon?: boolean;
  /** Hide group headers within the list. */
  hideGroupHeaders?: boolean;
  /** Hide shortcodes within the preview bar. */
  hideShortcodes?: boolean;
  /** Max number of commonly used to store. */
  maxCommonlyUsed?: number;
  /** Max official emoji release version to support. */
  maxEmojiVersion?: number;
  /** Mapping of custom translation messages. */
  messages?: { [key: string]: string };
  /** Content to render by default in the preview bar. */
  noPreview?: React.ReactNode;
  /** Content to render when there are no search results. */
  noResults?: React.ReactNode;
  /** Callback fired when hovering an emoji. */
  onHoverEmoji?: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Callback fired when scrolling the emoji list. */
  onScroll?: () => void;
  /** Callback fired when a new group is scrolled into view. */
  onScrollGroup?: (group: GroupKey) => void;
  /** Callback fired when typing in the search field. */
  onSearch?: (query: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Callback fired when clicking on an emoji. */
  onSelectEmoji?: (emoji: CanonicalEmoji, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Callback fired when clicking a group tab. */
  onSelectGroup?: (group: GroupKey, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Callback fired when clicking a skin tone. */
  onSelectSkinTone?: (skinTone: SkinToneKey, event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Number of emoji rows to display vertically. */
  rowCount?: number;
  /** Mapping of custom icons for each skin tone. */
  skinIcons?: { [key: string]: React.ReactNode };
  /** Sticky the active group header to the top of the emoji list. */
  stickyGroupHeader?: boolean;
  /** Custom props to pass to react-virtualized list component. */
  virtual?: {
    columnPadding?: number;
    rowPadding?: number;
  };
  /** List of emoji hexcodes to only show. */
  whitelist?: Hexcode[];
}

export interface InternalPickerProps extends PickerProps {
  /** List of all emojis. */
  emojis: CanonicalEmoji[];
  /** Data manager instance. */
  emojiData: EmojiDataManager;
  /** Emoji data source metadata. */
  emojiSource: Source;
}

export interface InternalPickerState {
  /** Emoji to display in the preview. */
  activeEmoji: CanonicalEmoji | null;
  /** Index for the highlighted emoji within search results. */
  activeEmojiIndex: number;
  /** Currently selected group tab. */
  activeGroup: GroupKey;
  /** Currently selected skin tone. */
  activeSkinTone: SkinToneKey;
  /** List of emoji hexcodes most commonly used. */
  commonEmojis: CanonicalEmoji[];
  /** React context. */
  context: EmojiContext;
  /** List of all emojis with search filtering applied. */
  emojis: CanonicalEmoji[];
  /** Filtered emojis grouped by group number. */
  groupedEmojis: GroupEmojiMap;
  /** Group to scroll to on render. */
  scrollToGroup: GroupKey | '';
  /** Current search query. */
  searchQuery: string;
}

const SKIN_MODIFIER_PATTERN = /1F3FB|1F3FC|1F3FD|1F3FE|1F3FF/g;

export class InternalPicker extends React.PureComponent<InternalPickerProps, InternalPickerState> {
  static defaultProps: Partial<InternalPickerProps> = {
    autoFocus: false,
    blacklist: [],
    classNames: {},
    clearIcon: null,
    columnCount: 10,
    commonMode: COMMON_MODE_RECENT,
    defaultGroup: GROUP_KEY_COMMONLY_USED,
    defaultSkinTone: SKIN_KEY_NONE,
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
    noPreview: null,
    noResults: null,
    onHoverEmoji() {},
    onScroll() {},
    onScrollGroup() {},
    onSearch() {},
    onSelectEmoji() {},
    onSelectGroup() {},
    onSelectSkinTone() {},
    rowCount: 8,
    skinIcons: {},
    stickyGroupHeader: false,
    virtual: {},
    whitelist: [],
  };

  blacklist: BlackWhiteMap;

  whitelist: BlackWhiteMap;

  constructor(props: InternalPickerProps) {
    super(props);

    const { blacklist, classNames, defaultSkinTone, messages, whitelist } = props as Required<
      InternalPickerProps
    >;

    this.blacklist = this.generateBlackWhiteMap(blacklist);
    this.whitelist = this.generateBlackWhiteMap(whitelist);

    const searchQuery = '';
    const commonEmojis = this.generateCommonEmojis(this.getCommonEmojisFromStorage());
    const activeGroup = this.getActiveGroup(commonEmojis.length > 0);
    const activeSkinTone = this.getSkinToneFromStorage() || defaultSkinTone;
    const emojis = this.generateEmojis(activeSkinTone, searchQuery);
    const groupedEmojis = this.groupEmojis(emojis, commonEmojis, searchQuery);

    this.state = {
      activeEmoji: null,
      activeEmojiIndex: -1,
      activeGroup,
      activeSkinTone,
      commonEmojis,
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
      groupedEmojis,
      scrollToGroup: activeGroup,
      searchQuery,
    };
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

    this.setUpdatedState({
      commonEmojis: this.generateCommonEmojis(commonEmojis),
    });
  }

  /**
   * Filter the dataset with the search query against a set of emoji properties.
   */
  // eslint-disable-next-line complexity
  filterOrSearch(emoji: CanonicalEmoji, searchQuery: string): boolean {
    const { blacklist, maxEmojiVersion, whitelist } = this.props as Required<InternalPickerProps>;

    // Remove blacklisted emojis and non-whitelisted emojis
    if (
      (blacklist.length > 0 && this.blacklist[emoji.hexcode]) ||
      (whitelist.length > 0 && !this.whitelist[emoji.hexcode])
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
      .some(needle => haystack.includes(needle));
  }

  /**
   * Return the list of emojis filtered with the search query if applicable,
   * and with skin tone applied if set.
   */
  generateEmojis(skinTone: SkinToneKey, searchQuery: string): CanonicalEmoji[] {
    return this.props.emojis
      .filter(emoji => this.filterOrSearch(emoji, searchQuery))
      .map(emoji => this.getSkinnedEmoji(emoji, skinTone));
  }

  /**
   * Convert the `blacklist` or `whitelist` prop to a map for quicker lookups.
   */
  generateBlackWhiteMap(list: string[]): BlackWhiteMap {
    const map: BlackWhiteMap = {};

    list.forEach(hexcode => {
      if (__DEV__) {
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
  getActiveGroup(hasCommon: boolean): GroupKey {
    const { defaultGroup, disableGroups } = this.props;
    let group = defaultGroup!;

    // Allow commonly used before "none" groups
    if (group === GROUP_KEY_COMMONLY_USED) {
      if (hasCommon) {
        return group;
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

    const common = localStorage.getItem(KEY_COMMONLY_USED);

    return common ? JSON.parse(common) : [];
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
   * Partition the dataset into multiple arrays based on the group they belong to.
   */
  groupEmojis(
    emojis: CanonicalEmoji[],
    commonEmojis: CanonicalEmoji[],
    searchQuery: string,
  ): GroupEmojiMap {
    const { disableGroups } = this.props;
    const groups: GroupEmojiMap = {};

    // Add commonly used group if not searching
    if (!searchQuery && commonEmojis.length > 0) {
      groups[GROUP_KEY_COMMONLY_USED] = {
        emojis: commonEmojis,
        group: GROUP_KEY_COMMONLY_USED,
      };
    }

    // Partition emojis into separate groups
    emojis.forEach(emoji => {
      let group: GroupKey = GROUP_KEY_NONE;

      if (searchQuery) {
        group = GROUP_KEY_SEARCH_RESULTS;
      } else if (!disableGroups && typeof emoji.group !== 'undefined') {
        group = GROUPS[emoji.group];
      }

      if (!group) {
        return;
      }

      if (groups[group]) {
        groups[group].emojis.push(emoji);
      } else {
        groups[group] = {
          emojis: [emoji],
          group,
        };
      }
    });

    // Sort each group
    Object.keys(groups).forEach(group => {
      if (group !== GROUP_KEY_COMMONLY_USED) {
        groups[group].emojis.sort((a, b) => (a.order || 0) - (b.order || 0));
      }

      // Remove the group if no emojis
      if (groups[group].emojis.length === 0) {
        delete groups[group];
      }
    });

    return groups;
  }

  /**
   * Triggered when common emoji cache is cleared.
   */
  private handleClearCommonEmoji = () => {
    this.setUpdatedState({
      commonEmojis: [],
    });

    localStorage.removeItem(KEY_COMMONLY_USED);
  };

  /**
   * Triggered when the mouse hovers an emoji.
   */
  private handleEnterEmoji = (
    emoji: CanonicalEmoji,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    this.setUpdatedState({
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
        this.setUpdatedState({
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
    this.setUpdatedState({
      activeEmoji: null,
    });
  };

  /**
   * Triggered when a group is scrolled into view.
   */
  private handleScrollGroup = (group: GroupKey) => {
    this.setUpdatedState({
      activeGroup: group,
      scrollToGroup: '',
    });

    this.props.onScrollGroup!(group);
  };

  /**
   * Triggered when the search input field value changes.
   */
  private handleSearch = (query: string, event: React.ChangeEvent<HTMLInputElement>) => {
    // Bypass custom logic and set immediately
    this.setState({
      searchQuery: query,
    });

    this.handleSearchDebounced(query);

    this.props.onSearch!(query, event);
  };

  private handleSearchDebounced = debounce(query => {
    this.setUpdatedState({
      searchQuery: query,
    });
  }, SEARCH_THROTTLE);

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
    this.setUpdatedState({
      activeGroup: group,
      scrollToGroup: group,
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
    this.setUpdatedState({
      activeSkinTone: skinTone,
    });

    try {
      localStorage.setItem(KEY_SKIN_TONE, skinTone);
    } catch (error) {
      // Do nothing
    }

    this.props.onSelectSkinTone!(skinTone, event);
  };

  /**
   * Catch all method to easily update the state. Will automatically handle updates
   * and branching based on values being set.
   */
  setUpdatedState(nextState: Partial<InternalPickerState>) {
    // eslint-disable-next-line complexity
    this.setState(prevState => {
      const state = { ...prevState, ...nextState };
      const activeGroup = this.getActiveGroup(state.commonEmojis.length > 0);
      let rebuildEmojis = false;

      // Common emojis have changed
      if ('commonEmojis' in nextState) {
        rebuildEmojis = true;

        // Reset the active group
        if (state.commonEmojis.length === 0) {
          state.activeGroup = activeGroup;
        }
      }

      // Active group has changed
      if ('activeGroup' in nextState) {
        // Reset search query
        if (state.searchQuery) {
          state.searchQuery = '';
          rebuildEmojis = true;
        }
      }

      // Active skin tone has changed
      if ('activeSkinTone' in nextState) {
        rebuildEmojis = true;
      }

      // Search query has changed
      if ('searchQuery' in nextState) {
        rebuildEmojis = true;

        state.activeGroup = state.searchQuery ? GROUP_KEY_SEARCH_RESULTS : activeGroup;
        state.scrollToGroup = state.searchQuery ? GROUP_KEY_SEARCH_RESULTS : activeGroup;
      }

      // Rebuild the emoji datasets
      if (rebuildEmojis) {
        state.emojis = this.generateEmojis(state.activeSkinTone, state.searchQuery);
        state.groupedEmojis = this.groupEmojis(state.emojis, state.commonEmojis, state.searchQuery);

        const hasResults = state.searchQuery && state.emojis.length > 0;

        state.activeEmoji = hasResults ? state.emojis[0] : null;
        state.activeEmojiIndex = hasResults ? 0 : -1;
      }

      return state;
    });
  }

  render() {
    const {
      autoFocus,
      clearIcon,
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
      noPreview,
      noResults,
      rowCount,
      skinIcons,
      stickyGroupHeader,
      virtual,
      onScroll,
    } = this.props as Required<InternalPickerProps>;
    const {
      activeEmoji,
      activeGroup,
      activeSkinTone,
      commonEmojis,
      context,
      groupedEmojis,
      scrollToGroup,
      searchQuery,
    } = this.state;
    const skinTones = disableSkinTones ? null : (
      <SkinTonePalette
        key="skin-tones"
        activeSkinTone={activeSkinTone}
        icons={skinIcons}
        onSelect={this.handleSelectSkinTone}
      />
    );
    const components: { [name: string]: React.ReactElement<unknown> | null } = {
      emojis: (
        <EmojiList
          key="emojis"
          {...virtual}
          activeEmoji={activeEmoji}
          activeGroup={activeGroup}
          clearIcon={clearIcon}
          columnCount={columnCount}
          commonMode={commonMode}
          emojiPadding={emojiPadding}
          emojiPath={emojiPath}
          emojiSize={emojiSize}
          emojiSource={emojiSource}
          groupedEmojis={groupedEmojis}
          hideGroupHeaders={hideGroupHeaders}
          noResults={noResults}
          rowCount={rowCount}
          scrollToGroup={scrollToGroup}
          skinTonePalette={displayOrder.includes('skin-tones') ? null : skinTones}
          stickyGroupHeader={stickyGroupHeader}
          onClear={this.handleClearCommonEmoji}
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
          commonMode={commonMode}
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
          noPreview={noPreview}
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

    return (
      <Context.Provider value={context}>
        <div className={context.classNames.picker}>{displayOrder.map(key => components[key])}</div>
      </Context.Provider>
    );
  }
}

export default function Picker({
  compact,
  locale,
  throwErrors,
  version,
  ...props
}: PickerProps & UseEmojiDataOptions) {
  const [emojis, source, data] = useEmojiData({ compact, locale, throwErrors, version });

  return <InternalPicker {...props} emojis={emojis} emojiData={data} emojiSource={source} />;
}
