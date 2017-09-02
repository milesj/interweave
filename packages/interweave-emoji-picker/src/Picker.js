/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { getEmojiData } from 'interweave/lib/data/emoji';
import withEmoji from 'interweave/lib/loaders/withEmoji';
import EmojiList from './EmojiList';
import GroupBar from './GroupBar';
import PreviewBar from './PreviewBar';
import SearchBar from './SearchBar';

import type { Emoji, EmojiPath } from './types';

type PickerProps = {
  classNames: { [key: string]: string },
  displayOrder: string[],
  emojiPath: EmojiPath,
  groupIcons: { [key: string]: React$Node },
  hideEmoticon: boolean,
  hidePreview: boolean,
  hideSearch: boolean,
  hideShortcodes: boolean,
  messages: { [key: string]: string },
  onHoverEmoji: (emoji: Emoji) => void,
  onSearch: (query: string) => void,
  onSelectEmoji: (emoji: Emoji) => void,
  onSelectGroup: (group: string) => void,
};

type PickerState = {
  activeEmoji: ?Emoji,
  activeGroup: string,
  searchQuery: string,
};

class Picker extends React.Component<PickerProps, PickerState> {
  static childContextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    displayOrder: PropTypes.arrayOf(PropTypes.string),
    emojiPath: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    groupIcons: PropTypes.objectOf(PropTypes.node),
    hideEmoticon: PropTypes.bool,
    hidePreview: PropTypes.bool,
    hideSearch: PropTypes.bool,
    hideShortcodes: PropTypes.bool,
    messages: PropTypes.objectOf(PropTypes.string),
    onHoverEmoji: PropTypes.func,
    onSearch: PropTypes.func,
    onSelectEmoji: PropTypes.func,
    onSelectGroup: PropTypes.func,
  };

  static defaultProps = {
    classNames: {},
    displayOrder: ['preview', 'emojis', 'groups', 'search'],
    emojiPath: '',
    groupIcons: {},
    messages: {},
    hideEmoticon: false,
    hidePreview: false,
    hideSearch: false,
    hideShortcodes: false,
    onHoverEmoji() {},
    onSearch() {},
    onSelectEmoji() {},
    onSelectGroup() {},
  };

  state = {
    activeEmoji: null,
    activeGroup: 'smileys-people',
    searchQuery: '',
  };

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
        'smileys-people': 'Smileys & People',
        'animals-nature': 'Animals & Nature',
        'food-drink': 'Food & Drink',
        'travel-places': 'Travel & Places',
        activities: 'Activities',
        objects: 'Objects',
        symbols: 'Symbols',
        flags: 'Flags',
        // Custom groups
        frequent: 'Frequently Used',
        'search-results': 'Search Results',
        custom: 'Custom',
        // Misc
        search: 'Search…',
        'no-preview': '',
        // Overrides
        ...messages,
      },
    };
  }

  handleEnterEmoji = (emoji: Emoji) => {
    this.setState({
      activeEmoji: emoji,
    });

    this.props.onHoverEmoji(emoji);
  };

  handleLeaveEmoji = (emoji: Emoji) => {
    this.setState({
      activeEmoji: null,
    });
  };

  handleSearch = (query: string) => {
    this.setState({
      activeGroup: query ? '' : 'smileys-people',
      searchQuery: query,
    });

    this.props.onSearch(query);
  };

  handleSelectEmoji = (emoji: Emoji) => {
    this.props.onSelectEmoji(emoji);
  };

  handleSelectGroup = (group: string) => {
    this.setState({
      activeGroup: group,
    });

    this.props.onSelectGroup(group);
  };

  render() {
    const {
      classNames,
      displayOrder,
      emojiPath,
      groupIcons,
      hideEmoticon,
      hidePreview,
      hideSearch,
      hideShortcodes,
    } = this.props;
    const { activeEmoji, activeGroup, searchQuery } = this.state;
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
          emojiPath={emojiPath}
          activeGroup={activeGroup}
          query={searchQuery}
          onEnter={this.handleEnterEmoji}
          onLeave={this.handleLeaveEmoji}
          onSelect={this.handleSelectEmoji}
        />
      ),
      groups: (
        <GroupBar
          activeGroup={activeGroup}
          emojiPath={emojiPath}
          groupIcons={groupIcons}
          onSelect={this.handleSelectGroup}
        />
      ),
      search: hideSearch ? null : (
        <SearchBar onChange={this.handleSearch} />
      ),
    };

    return (
      <div className={classNames.picker || 'interweave-picker__picker'}>
        {displayOrder.map(key => components[key])}
      </div>
    );
  }
}

export default withEmoji(Picker);
