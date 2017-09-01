/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiCharacter from 'interweave/lib/components/Emoji';
import { EmojiPathShape } from './shapes';
import { GROUP_ICONS } from './constants';

import type { EmojiPath } from './types';

type GroupProps = {
  activeGroup: string,
  children: React$Node,
  emojiPath: EmojiPath,
  group: string,
  onSelect: (group: string) => void,
};

export default class Group extends React.Component<GroupProps> {
  static propTypes = {
    activeGroup: PropTypes.string.isRequired,
    children: PropTypes.node,
    emojiPath: EmojiPathShape.isRequired,
    group: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: null,
  };

  handleSelect = (e: SyntheticMouseEvent<*>) => {
    e.stopPropagation();

    this.props.onSelect(this.props.group);
  };

  render() {
    const { children, group, activeGroup, emojiPath } = this.props;
    let className = 'iep__group';

    if (group === activeGroup) {
      className += ' iep__group--active';
    }

    return (
      <button
        type="button"
        className={className}
        onClick={this.handleSelect}
      >
        {children || (
          <EmojiCharacter
            unicode={GROUP_ICONS[group]}
            emojiPath={emojiPath}
            emojiSize={1}
          />
        )}
      </button>
    );
  }
}
