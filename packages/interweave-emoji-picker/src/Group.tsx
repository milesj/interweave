/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Group as GroupType } from './types';

export interface GroupProps {
  activeGroup: GroupType;
  children: React.ReactNode;
  group: GroupType;
  onSelect: (group: GroupType, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default class Group extends React.PureComponent<GroupProps> {
  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
    messages: PropTypes.objectOf(PropTypes.node),
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
  private handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    this.props.onSelect(this.props.group, e);
  };

  render() {
    const { activeGroup, children, group } = this.props;
    const { classNames, messages } = this.context;
    const className = [classNames.group];

    if (group === activeGroup) {
      className.push(classNames.groupActive);
    }

    return (
      <button
        aria-label={messages[group]}
        className={className.join(' ')}
        type="button"
        onClick={this.handleClick}
      >
        {children}
      </button>
    );
  }
}
