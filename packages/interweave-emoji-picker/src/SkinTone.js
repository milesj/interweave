/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { SKIN_COLORS } from './constants';

type SkinToneProps = {
  activeSkinTone: string,
  onSelect: (skinTone: string, e: *) => void,
  skinTone: string,
};

export default class SkinTone extends React.PureComponent<SkinToneProps> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    activeSkinTone: PropTypes.string.isRequired,
    skinTone: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  /**
   * Triggered when the button is clicked.
   */
  handleClick = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    this.props.onSelect(this.props.skinTone, e);
  };

  render() {
    const { activeSkinTone, skinTone } = this.props;
    const { classNames } = this.context;
    const className = [classNames.skinTone];
    const color = SKIN_COLORS[skinTone];

    if (skinTone === activeSkinTone) {
      className.push(classNames.skinToneActive);
    }

    return (
      <button
        className={className.join(' ')}
        style={{ backgroundColor: color, borderColor: color }}
        type="button"
        onClick={this.handleClick}
      >
        &nbsp;
      </button>
    );
  }
}
