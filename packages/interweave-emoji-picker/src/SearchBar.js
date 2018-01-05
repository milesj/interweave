/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { SEARCH_THROTTLE } from './constants';

type SearchBarProps = {
  autoFocus: boolean,
  onChange: (query: string, e: *) => void,
  onKeyUp: (e: *) => void,
  searchQuery: string,
};

type SearchBarState = {
  query: string,
};

export default class SearchBar extends React.PureComponent<SearchBarProps, SearchBarState> {
  input: ?HTMLInputElement;

  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.node),
  };

  static propTypes = {
    autoFocus: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onKeyUp: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
  };

  constructor({ searchQuery }: SearchBarProps) {
    super();

    this.state = {
      query: searchQuery,
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
  componentWillReceiveProps({ searchQuery }: SearchBarProps) {
    if (searchQuery === '' && this.props.searchQuery) {
      this.setState({
        query: searchQuery,
      });
    }
  }

  /**
   * Triggered when the input field value changes.
   */
  handleChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.persist();

    // Update the input field immediately
    this.setState({
      query: e.target.value,
    });

    // But defer filtering in the picker
    this.handleChangeDebounced(e);
  };

  /**
   * A change handler that is debounced for performance.
   */
  handleChangeDebounced = debounce((e) => {
    // Check if were still mounted
    if (this.input) {
      this.props.onChange(e.target.value.trim(), e);
    }
  }, SEARCH_THROTTLE);

  /**
   * Set input field as reference.
   */
  handleRef = (ref: ?HTMLInputElement) => {
    this.input = ref;
  };

  render(): React$Node {
    const { classNames, messages } = this.context;
    const { onKeyUp } = this.props;

    return (
      <div className={classNames.search}>
        <input
          aria-label={messages.searchA11y}
          className={classNames.searchInput}
          placeholder={messages.search}
          ref={this.handleRef}
          type="text"
          value={this.state.query}
          onChange={this.handleChange}
          onKeyUp={onKeyUp}
        />
      </div>
    );
  }
}
