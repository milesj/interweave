/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

type SearchBarProps = {
  autoFocus: boolean,
  onChange: (query: string) => void,
  query: string,
};

type SearchBarState = {
  query: string,
};

const THROTTLE_DELAY: number = 150;

export default class SearchBar extends React.PureComponent<SearchBarProps, SearchBarState> {
  input: ?HTMLInputElement;
  timeout: number;

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

  componentDidMount() {
    if (this.props.autoFocus && this.input) {
      this.input.focus();
    }
  }

  componentWillReceiveProps({ query }: SearchBarProps) {
    // When the parent picker query is reset, also reset the input here
    if (query === '') {
      this.setState({
        query,
      });
    }
  }

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
    }, THROTTLE_DELAY);
  };

  handleRef = (ref: ?HTMLInputElement) => {
    this.input = ref;
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
          ref={this.handleRef}
        />
      </div>
    );
  }
}
