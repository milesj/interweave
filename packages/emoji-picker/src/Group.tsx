/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import camelCase from 'lodash/camelCase';
import withContext, { WithContextProps } from './withContext';
import { GROUP_KEY_COMMONLY_USED } from './constants';
import { ContextShape } from './shapes';
import { CommonMode, GroupKey } from './types';

export interface GroupProps {
  active: boolean;
  children: React.ReactNode;
  commonMode: CommonMode;
  group: GroupKey;
  onSelect: (group: GroupKey, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export class Group extends React.PureComponent<GroupProps & WithContextProps> {
  static propTypes = {
    context: ContextShape.isRequired,
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
      active,
      children,
      commonMode,
      context: { classNames, messages },
      group,
    } = this.props;
    const key = camelCase(group === GROUP_KEY_COMMONLY_USED ? commonMode : group);
    const className = [classNames.group];

    if (active) {
      className.push(classNames.groupActive);
    }

    return (
      <button
        className={className.join(' ')}
        title={messages[key]}
        type="button"
        onClick={this.handleClick}
      >
        {children}
      </button>
    );
  }
}

export default withContext(Group);
