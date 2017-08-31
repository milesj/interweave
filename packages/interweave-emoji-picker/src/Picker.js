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
import PreviewBar from './PreviewBar';
import SearchBar from './SearchBar';

import type { Emoji, EmojiPath } from './types';

type PickerProps = {
  emojiPath: EmojiPath,
  emojiSize: number,
  messages: { [key: string]: string },
  onHoverEmoji: (emoji: Emoji) => void,
  onSearch: (query: string) => void,
  onSelectEmoji: (emoji: Emoji) => void,
  onSelectGroup: (group: string) => void,
  showPreview: boolean,
  showSearch: boolean,
  showShortcodes: boolean,
};

type PickerState = {
  activeEmoji: ?Emoji,
  activeGroup: string,
  searchQuery: string,
};

class Picker extends React.Component<PickerProps, PickerState> {
  static childContextTypes = {
    messages: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    emojiPath: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    emojiSize: PropTypes.number,
    messages: PropTypes.objectOf(PropTypes.string),
    showPreview: PropTypes.bool,
    showSearch: PropTypes.bool,
    showShortcodes: PropTypes.bool,
    onHoverEmoji: PropTypes.func,
    onSearch: PropTypes.func,
    onSelectEmoji: PropTypes.func,
    onSelectGroup: PropTypes.func,
  };

  static defaultProps = {
    emojiPath: '',
    emojiSize: 1,
    messages: {},
    showPreview: true,
    showSearch: true,
    showShortcodes: true,
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
    return {
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
        custom: 'Custom',
        // Misc
        search: 'Search…',
        'search-results': 'Search Results',
        'no-preview': '',
        // Overrides
        ...this.props.messages,
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
      searchQuery: query,
    });

    this.props.onSearch(query);
  };

  handleSelectEmoji = (emoji: Emoji) => {
    this.props.onSelectEmoji(emoji);
  };

  render() {
    const { emojiPath, emojiSize, showPreview, showSearch, showShortcodes } = this.props;
    const { activeEmoji, activeGroup, searchQuery } = this.state;

    return (
      <div className="iep__picker">
        <EmojiList
          emojis={getEmojiData()}
          emojiPath={emojiPath}
          emojiSize={emojiSize}
          group={activeGroup}
          query={searchQuery}
          onEnter={this.handleEnterEmoji}
          onLeave={this.handleLeaveEmoji}
          onSelect={this.handleSelectEmoji}
        />

        {showPreview && (
          <PreviewBar
            emoji={activeEmoji}
            emojiPath={emojiPath}
            showShortcodes={showShortcodes}
          />
        )}

        {showSearch && (
          <SearchBar onChange={this.handleSearch} />
        )}
      </div>
    );
  }
}

export default withEmoji(Picker);
