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
    onSearch: PropTypes.func,
    onSelectEmoji: PropTypes.func,
    onSelectGroup: PropTypes.func,
  };

  static defaultProps = {
    emojiPath: '',
    emojiSize: 1,
    onSearch() {},
    onSelectGroup() {},
    onSelectEmoji() {},
  };

  state = {
    activeGroup: 0,
    searchQuery: '',
  };

  handleSearch = (e) => {
    const searchQuery = e.target.value;

    console.log(e, searchQuery);

    this.setState({
      searchQuery,
    });

    this.props.onSearch(searchQuery);
  };

  handleSelectEmoji = (emoji) => {
    this.props.onSelectEmoji(emoji);
  };

  render() {
    const { emojiPath, emojiSize } = this.props;
    const { activeGroup, searchQuery } = this.state;

    return (
      <div className="iep__picker">
        <SearchBar
          query={searchQuery}
          onChange={this.handleSearch}
        />

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
