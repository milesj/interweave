/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import withContext, { ContextProps } from './Context';
import { SEARCH_THROTTLE } from './constants';
import { ContextShape } from './shapes';

export interface SearchBarProps {
  autoFocus: boolean;
  onChange: (query: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  searchQuery: string;
}

export interface SearchBarState {
  query: string;
}

export class SearchBar extends React.PureComponent<SearchBarProps & ContextProps, SearchBarState> {
  static propTypes = {
    autoFocus: PropTypes.bool.isRequired,
    context: ContextShape.isRequired,
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
  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();

    // Update the input field immediately
    this.setState({
      query: event.currentTarget.value,
    });

    // But defer filtering in the picker
    this.handleChangeDebounced(event);
  };

  /**
   * A change handler that is debounced for performance.
   */
  private handleChangeDebounced = debounce(event => {
    // console.log(this.inputRef.current, event.target.value, event.currentTarget.value);
    // Check if were still mounted
    if (this.inputRef.current) {
      this.props.onChange(event.currentTarget.value.trim(), event);
    }
  }, SEARCH_THROTTLE);

  render() {
    const { classNames, messages } = this.props.context;
    const { onKeyUp } = this.props;

    return (
      <div className={classNames.search}>
        <input
          aria-label={messages.searchA11y}
          className={classNames.searchInput}
          placeholder={messages.search}
          ref={this.inputRef}
          type="search"
          value={this.state.query}
          onChange={this.handleChange}
          onKeyUp={onKeyUp}
        />
      </div>
    );
  }
}

export default withContext(SearchBar);
