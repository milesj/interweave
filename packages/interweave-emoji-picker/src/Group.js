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
  onSelect: (group: string, resetSearch: boolean) => void,
};

export default class Group extends React.Component<GroupProps> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
  };

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

  /**
   * Triggered when the button is clicked.
   */
  handleSelect = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    this.props.onSelect(this.props.group, true);
  };

  render() {
    const { children, group, activeGroup, emojiPath } = this.props;
    const { classNames } = this.context;
    const className = [classNames.group];

    if (group === activeGroup) {
      className.push(classNames.groupActive);
    }

    return (
      <button
        type="button"
        className={className.join(' ')}
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
