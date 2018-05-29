/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import React from 'react';
import PropTypes from 'prop-types';
import withContext, { ContextShape, EmojiContext } from './Context';
import {
  GROUP_COMMONLY_USED,
  GROUP_SEARCH_RESULTS,
  GROUP_SMILEYS_PEOPLE,
  GROUP_NONE,
} from './constants';
import { CommonMode, Group } from './types';

export interface GroupListHeaderProps {
  commonMode: CommonMode;
  context: EmojiContext;
  group: Group;
  skinTonePalette?: React.ReactNode;
}

export class GroupListHeader extends React.PureComponent<GroupListHeaderProps> {
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
    const { commonMode, group, skinTonePalette } = this.props;
    const { classNames, messages } = this.props.context;
    const showPalette =
      skinTonePalette &&
      (group === GROUP_SMILEYS_PEOPLE || group === GROUP_SEARCH_RESULTS || group === GROUP_NONE);

    return (
      <header className={classNames.emojisHeader}>
        {showPalette && skinTonePalette}

        {group === GROUP_COMMONLY_USED ? messages[commonMode] : messages[group]}
      </header>
    );
  }
}

export default withContext(GroupListHeader);
