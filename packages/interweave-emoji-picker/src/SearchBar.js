/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

export default class SearchBar extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
  };

  state = {
    query: '',
  };

  handleChange = (e) => {
    const query = e.target.value;

    // Update the input field immediately
    this.setState({
      query,
    });

    // But defer filtering in the picker
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.props.onChange(query);
    }, 100);
  };

  render() {
    return (
      <div className="iep__search">
        <input
          type="text"
          className="iep__search-input"
          placeholder="Search…"
          value={this.state.query}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
