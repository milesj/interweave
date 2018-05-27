/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import { SKIN_COLORS } from './constants';

export interface SkinToneProps {
  active: boolean;
  children?: React.ReactNode;
  onSelect: (skinTone: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  skinTone: string;
}

export default class SkinTone extends React.PureComponent<SkinToneProps> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    active: PropTypes.bool.isRequired,
    children: PropTypes.node,
    onSelect: PropTypes.func.isRequired,
    skinTone: PropTypes.string.isRequired,
  };

  static defaultProps = {
    children: null,
  };

  /**
   * Triggered when the button is clicked.
   */
  private handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    this.props.onSelect(this.props.skinTone, e);
  };

  render() {
    const { active, children, skinTone } = this.props;
    const { classNames } = this.context;
    const className = [classNames.skinTone];
    const color = SKIN_COLORS[skinTone];

    if (active) {
      className.push(classNames.skinToneActive);
    }

    return (
      <button
        className={className.join(' ')}
        style={{ backgroundColor: color, borderColor: color, color }}
        type="button"
        onClick={this.handleClick}
      >
        {children || ' '}
      </button>
    );
  }
}
