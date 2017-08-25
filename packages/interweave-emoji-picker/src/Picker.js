/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiLoader from 'interweave/lib/loaders/EmojiLoader';
import EmojiList from './EmojiList';
import SearchBar from './SearchBar';

export default class Picker extends React.Component {
  static propTypes = {
    emojiPath: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    locale: PropTypes.string,
    version: PropTypes.string,
    onSearch: PropTypes.func,
    onSelectEmoji: PropTypes.func,
    onSelectGroup: PropTypes.func,
  };

  static defaultProps = {
    emojiPath: '',
    locale: 'en',
    version: 'latest',
    onSearch() {},
    onSelectGroup() {},
    onSelectEmoji() {},
  };

  state = {
    activeGroup: 0,
    emojis: [],
    searchQuery: '',
  };

  handleLoad = (emojis) => {
    this.setState({
      emojis,
    });
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
    const { emojiPath, locale, version } = this.props;
    const { activeGroup, emojis, searchQuery } = this.state;

    console.log(this.state);

    return (
      <EmojiLoader locale={locale} version={version} onLoad={this.handleLoad}>
        <div className="iep__picker">
          <SearchBar
            query={searchQuery}
            onChange={this.handleSearch}
          />

          <EmojiList
            emojis={emojis}
            emojiPath={emojiPath}
            group={activeGroup}
            query={searchQuery}
            onSelect={this.handleSelectEmoji}
          />
        </div>
      </EmojiLoader>
    );
  }
}
