/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import SkinTone from './SkinTone';
import { SKIN_TONES } from './constants';

type SkinTonePaletteProps = {
  activeSkinTone: string,
  onSelect: (skinTone: string) => void,
};

export default class SkinTonePalette extends React.PureComponent<SkinTonePaletteProps> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    activeSkinTone: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  render() {
    const { activeSkinTone, onSelect } = this.props;
    const { classNames } = this.context;

    return (
      <div className={classNames.skinTones}>
        {SKIN_TONES.map(skinTone => (
          <SkinTone
            key={skinTone}
            activeSkinTone={activeSkinTone}
            skinTone={skinTone}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  }
}
