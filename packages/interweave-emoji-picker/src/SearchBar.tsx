/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { SEARCH_THROTTLE } from './constants';

export interface SearchBarProps {
  autoFocus: boolean;
  onChange: (query: string, e: any) => void;
  onKeyUp: (e: any) => void;
  searchQuery: string;
}

export interface SearchBarState {
  query: string;
}

export default class SearchBar extends React.PureComponent<SearchBarProps, SearchBarState> {
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

  inputRef = React.createRef<HTMLInputElement>();

  state = {
    query: this.props.searchQuery,
  };

  /**
   * Focus the input field if `autoFocus` is true.
   */
  componentDidMount() {
    if (this.props.autoFocus && this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }

  /**
   * When the parent `Picker` search query is reset, also reset the input field.
   */
  componentDidUpdate(prevProps: SearchBarProps) {
    if (this.props.searchQuery === '' && prevProps.searchQuery) {
      this.setState({
        query: '',
      });
    }
  }

  /**
   * Triggered when the input field value changes.
   */
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  handleChangeDebounced = debounce(e => {
    // Check if were still mounted
    if (this.inputRef.current) {
      this.props.onChange(e.target.value.trim(), e);
    }
  }, SEARCH_THROTTLE);

  render(): React.ReactNode {
    const { classNames, messages } = this.context;
    const { onKeyUp } = this.props;

    return (
      <div className={classNames.search}>
        <input
          aria-label={messages.searchA11y}
          className={classNames.searchInput}
          placeholder={messages.search}
          ref={this.inputRef}
          type="text"
          value={this.state.query}
          onChange={this.handleChange}
          onKeyUp={onKeyUp}
        />
      </div>
    );
  }
}
