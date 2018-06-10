/**
 * @copyright   2016-2018, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import camelCase from 'lodash/camelCase';
import withContext, { ContextProps } from './Context';
import {
  GROUP_KEY_COMMONLY_USED,
  GROUP_KEY_SEARCH_RESULTS,
  GROUP_KEY_SMILEYS_PEOPLE,
  GROUP_KEY_NONE,
} from './constants';
import { ContextShape } from './shapes';
import { CommonMode, GroupKey } from './types';

export interface GroupListHeaderProps {
  commonMode: CommonMode;
  group: GroupKey;
  skinTonePalette?: React.ReactNode;
}

export class GroupListHeader extends React.PureComponent<GroupListHeaderProps & ContextProps> {
  static propTypes = {
    commonMode: PropTypes.string.isRequired,
    context: ContextShape.isRequired,
    group: PropTypes.string.isRequired,
    skinTonePalette: PropTypes.node,
  };

  static defaultProps = {
    skinTonePalette: null,
  };

  render() {
    const {
      commonMode,
      context: { classNames, messages },
      group,
      skinTonePalette,
    } = this.props;
    const showPalette =
      skinTonePalette &&
      (group === GROUP_KEY_SMILEYS_PEOPLE ||
        group === GROUP_KEY_SEARCH_RESULTS ||
        group === GROUP_KEY_NONE);

    return (
      <header className={classNames.emojisHeader}>
        {showPalette && skinTonePalette}

        {group === GROUP_KEY_COMMONLY_USED
          ? messages[camelCase(commonMode)]
          : messages[camelCase(group)]}
      </header>
    );
  }
}

export default withContext(GroupListHeader);
