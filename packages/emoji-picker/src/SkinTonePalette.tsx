/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import SkinTone from './SkinTone';
import withContext, { ContextProps } from './Context';
import { SKIN_TONES } from './constants';
import { ContextShape } from './shapes';
import { Context, SkinToneKey } from './types';

export interface SkinTonePaletteProps {
  activeSkinTone: SkinToneKey;
  icons: { [key: string]: React.ReactNode };
  onSelect: (skinTone: SkinToneKey, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export class SkinTonePalette extends React.PureComponent<SkinTonePaletteProps & ContextProps> {
  static propTypes = {
    activeSkinTone: PropTypes.string.isRequired,
    context: ContextShape.isRequired,
    icons: PropTypes.objectOf(PropTypes.node).isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  render() {
    const {
      activeSkinTone,
      context: { classNames },
      icons,
      onSelect,
    } = this.props;

    return (
      <div className={classNames.skinTones}>
        {SKIN_TONES.map(skinTone => (
          <SkinTone
            key={skinTone}
            active={activeSkinTone === skinTone}
            skinTone={skinTone}
            onSelect={onSelect}
          >
            {icons[skinTone] || null}
          </SkinTone>
        ))}
      </div>
    );
  }
}

export default withContext(SkinTonePalette);
