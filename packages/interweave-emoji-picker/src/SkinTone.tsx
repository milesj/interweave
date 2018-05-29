/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import withContext, { ContextShape, EmojiContext } from './Context';
import { SKIN_COLORS } from './constants';
import { SkinTone as SkinToneType } from './types';

export interface SkinToneProps {
  active: boolean;
  context: EmojiContext;
  children?: React.ReactNode;
  onSelect: (skinTone: SkinToneType, event: React.MouseEvent<HTMLButtonElement>) => void;
  skinTone: SkinToneType;
}

export class SkinTone extends React.PureComponent<SkinToneProps> {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    children: PropTypes.node,
    context: ContextShape.isRequired,
    onSelect: PropTypes.func.isRequired,
    skinTone: PropTypes.string.isRequired,
  };

  static defaultProps = {
    children: null,
  };

  /**
   * Triggered when the button is clicked.
   */
  private handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    this.props.onSelect(this.props.skinTone, event);
  };

  render() {
    const { active, children, skinTone } = this.props;
    const { classNames } = this.props.context;
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

export default withContext(SkinTone);
