/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { SEARCH_THROTTLE } from './constants';

type SearchBarProps = {
  autoFocus: boolean,
  onChange: (query: string) => void,
  onKeyUp: (event: *) => void,
  searchQuery: string,
};

type SearchBarState = {
  query: string,
};

export default class SearchBar extends React.PureComponent<SearchBarProps, SearchBarState> {
  input: ?HTMLInputElement;
  timeout: ?number;

  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.node),
  };

  static propTypes = {
    autoFocus: PropTypes.bool.isRequired,
    searchQuery: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func.isRequired,
  };

  state = {
    query: '',
  };

  /**
   * Focus the input field if `autoFocus` is true.
   */
  componentDidMount() {
    if (this.props.autoFocus && this.input) {
      this.input.focus();
    }
  }

  /**
   * When the parent `Picker` search query is reset, also reset the input field.
   */
  componentWillReceiveProps({ searchQuery }: SearchBarProps) {
    if (searchQuery === '') {
      clearTimeout(this.timeout);

      this.setState({
        query: '',
      });
    }
  }

  /**
   * Triggered when the input field value changes.
   */
  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;
    const trimmedQuery = query.trim();

    // Update the input field immediately
    this.setState({
      query,
    });

    // But defer filtering in the picker
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.props.onChange(trimmedQuery);
    }, SEARCH_THROTTLE);
  };

  /**
   * Set input field as reference.
   */
  handleRef = (ref: ?HTMLInputElement) => {
    this.input = ref;
  };

  render() {
    const { classNames, messages } = this.context;
    const { onKeyUp } = this.props;

    return (
      <div className={classNames.search}>
        <input
          aria-label={messages.searchAria}
          className={classNames.searchInput}
          placeholder={messages.search}
          ref={this.handleRef}
          type="search"
          value={this.state.query}
          onChange={this.handleChange}
          onKeyUp={onKeyUp}
        />
      </div>
    );
  }
}
