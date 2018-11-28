/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import withContext, { WithContextProps } from './withContext';
import { SKIN_COLORS } from './constants';
import { ContextShape } from './shapes';
import { SkinToneKey } from './types';

export interface SkinToneProps {
  active: boolean;
  children?: React.ReactNode;
  onSelect: (skinTone: SkinToneKey, event: React.MouseEvent<HTMLButtonElement>) => void;
  skinTone: SkinToneKey;
}

export class SkinTone extends React.PureComponent<SkinToneProps & WithContextProps> {
  static propTypes = {
    context: ContextShape.isRequired,
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
    const {
      active,
      children,
      context: { classNames, messages },
      skinTone,
    } = this.props;
    const className = [classNames.skinTone];
    const color = SKIN_COLORS[skinTone];
    const key = camelCase(skinTone);

    if (active) {
      className.push(classNames.skinToneActive);
    }

    return (
      <button
        className={className.join(' ')}
        style={{ backgroundColor: color, borderColor: color, color }}
        title={messages[`skin${upperFirst(key)}`]}
        type="button"
        onClick={this.handleClick}
      >
        {children || ' '}
      </button>
    );
  }
}

export default withContext(SkinTone);
