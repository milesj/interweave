/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

type SearchBarProps = {
  onChange: (query: string) => void,
};

type SearchBarState = {
  query: string,
};

const THROTTLE_DELAY: number = 150;

export default class SearchBar extends React.PureComponent<SearchBarProps, SearchBarState> {
  timeout: number;

  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  state = {
    query: '',
  };

  handleChange = (e: SyntheticInputEvent<*>) => {
    const query = e.target.value;

    // Update the input field immediately
    this.setState({
      query,
    });

    // But defer filtering in the picker
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.props.onChange(query);
    }, THROTTLE_DELAY);
  };

  render() {
    const { classNames, messages } = this.context;

    return (
      <div className={classNames.search}>
        <input
          type="text"
          className={classNames.searchInput}
          placeholder={messages.search}
          value={this.state.query}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
