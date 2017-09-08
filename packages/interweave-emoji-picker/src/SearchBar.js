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
  query: string,
};

type SearchBarState = {
  query: string,
};

export default class SearchBar extends React.PureComponent<SearchBarProps, SearchBarState> {
  input: ?HTMLInputElement;
  timeout: ?number;

  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    autoFocus: PropTypes.bool.isRequired,
    query: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor({ query }: SearchBarProps) {
    super();

    this.state = {
      query,
    };
  }

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
  componentWillReceiveProps({ query }: SearchBarProps) {
    if (query === '') {
      this.setState({
        query,
      });
    }
  }

  /**
   * Triggered when the input field value changes.
   */
  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;

    // Update the input field immediately
    this.setState({
      query,
    });

    // But defer filtering in the picker
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.props.onChange(query);
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
        />
      </div>
    );
  }
}
