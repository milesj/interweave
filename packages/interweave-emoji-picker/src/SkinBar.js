/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import Skin from './Skin';
import { SKINS } from './constants';

type SkinBarProps = {
  activeSkinTone: string,
  onSelect: (skin: string) => void,
};

export default class SkinBar extends React.PureComponent<SkinBarProps> {
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
      <div className={classNames.skins}>
        {SKINS.map(skin => (
          <Skin
            key={skin}
            activeSkinTone={activeSkinTone}
            skinTone={skin}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  }
}
