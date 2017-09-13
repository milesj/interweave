/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';

import type { EmojiPath } from 'interweave'; // eslint-disable-line

type GroupProps = {
  activeGroup: string,
  children: React$Node,
  group: string,
  onSelect: (group: string, reset?: boolean) => void,
};

export default class Group extends React.PureComponent<GroupProps> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    activeGroup: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    group: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  /**
   * Triggered when the button is clicked.
   */
  handleSelect = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    this.props.onSelect(this.props.group, true);
  };

  render() {
    const { activeGroup, children, group } = this.props;
    const { classNames } = this.context;
    const className = [classNames.group];

    if (group === activeGroup) {
      className.push(classNames.groupActive);
    }

    return (
      <button
        className={className.join(' ')}
        type="button"
        onClick={this.handleSelect}
      >
        {children}
      </button>
    );
  }
}
