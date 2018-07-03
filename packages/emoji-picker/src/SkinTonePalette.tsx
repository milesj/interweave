/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import SkinTone from './SkinTone';
import withContext, { WithContextProps } from './withContext';
import { SKIN_TONES } from './constants';
import { ContextShape } from './shapes';
import { SkinToneKey } from './types';

export interface SkinTonePaletteProps {
  activeSkinTone: SkinToneKey;
  icons: { [key: string]: React.ReactNode };
  onSelect: (skinTone: SkinToneKey, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export class SkinTonePalette extends React.PureComponent<SkinTonePaletteProps & WithContextProps> {
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
      <nav className={classNames.skinTones}>
        <ul className={classNames.skinTonesList}>
          {SKIN_TONES.map(skinTone => (
            <li key={skinTone}>
              <SkinTone
                active={activeSkinTone === skinTone}
                skinTone={skinTone}
                onSelect={onSelect}
              >
                {icons[skinTone] || icons[camelCase(skinTone)] || null}
              </SkinTone>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default withContext(SkinTonePalette);
