/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import withEmoji from 'interweave/lib/loaders/withEmoji';
import EmojiList from './EmojiList';
import SearchBar from './SearchBar';

class Picker extends React.Component {
  static propTypes = {
    emojiPath: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    emojiSize: PropTypes.number,
    showSearch: PropTypes.bool,
    onSearch: PropTypes.func,
    onSelectEmoji: PropTypes.func,
    onSelectGroup: PropTypes.func,
  };

  static defaultProps = {
    emojiPath: '',
    emojiSize: 1,
    showSearch: true,
    onSearch() {},
    onSelectGroup() {},
    onSelectEmoji() {},
  };

  state = {
    activeGroup: 0,
    searchQuery: '',
  };

  handleSearch = (query) => {
    this.setState({
      searchQuery: query,
    });

    this.props.onSearch(query);
  };

  handleSelectEmoji = (emoji) => {
    this.props.onSelectEmoji(emoji);
  };

  render() {
    const { emojiPath, emojiSize, showSearch } = this.props;
    const { activeGroup, searchQuery } = this.state;

    return (
      <div className="iep__picker">
        {showSearch && (
          <SearchBar onChange={this.handleSearch} />
        )}

        <EmojiList
          emojiPath={emojiPath}
          emojiSize={emojiSize}
          group={activeGroup}
          query={searchQuery}
          onSelect={this.handleSelectEmoji}
        />
      </div>
    );
  }
}

export default withEmoji(Picker);
