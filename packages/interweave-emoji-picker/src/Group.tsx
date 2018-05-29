/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import withContext, { ContextProps } from './Context';
import { ContextShape } from './shapes';
import { GroupKey } from './types';

export interface GroupProps {
  activeGroup: GroupKey;
  children: React.ReactNode;
  group: GroupKey;
  onSelect: (group: GroupKey, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export class Group extends React.PureComponent<GroupProps & ContextProps> {
  static propTypes = {
    activeGroup: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    context: ContextShape.isRequired,
    group: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  /**
   * Triggered when the button is clicked.
   */
  private handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    this.props.onSelect(this.props.group, event);
  };

  render() {
    const {
      activeGroup,
      children,
      context: { classNames, messages },
      group,
    } = this.props;
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

export default withContext(Group);
