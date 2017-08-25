/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

export default function SearchBar({ query, onChange }) {
  return (
    <div className="iep__search">
      <input
        type="text"
        className="iep__search__input"
        placeholder="Search…"
        value={query}
        onChange={onChange}
      />
    </div>
  );
}

SearchBar.propTypes = {
  query: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
