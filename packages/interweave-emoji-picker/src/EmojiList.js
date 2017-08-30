/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import Emoji from './Emoji';
import GroupName from './GroupName';
import { EmojiPathShape } from './shapes';

export default class EmojiList extends React.PureComponent {
  static propTypes = {
    emojiPath: EmojiPathShape.isRequired,
    emojiSize: PropTypes.number.isRequired,
    emojis: PropTypes.arrayOf(PropTypes.object).isRequired,
    group: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired,
    onEnter: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.scrollToGroup(this.props.group);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.group !== nextProps.group) {
      this.scrollToGroup(nextProps.group);
    }
  }

  groupList = (emojis: Object[]) => {
    const groups = {};

    // Partition into each group
    emojis.forEach((emoji) => {
      const { group } = emoji;

      if (group in groups) {
        groups[group].push(emoji);
      } else {
        groups[group] = [emoji];
      }
    });

    // Sort each group by order
    Object.keys(groups).forEach((group) => {
      groups[group].sort((a, b) => a.order - b.order);
    });

    return groups;
  };

  scrollToGroup = (group: string) => {
    const element = document.getElementById(`emoji-group-${group}`);

    if (element) {
      element.scrollIntoView();
    }
  };

  searchList = (emoji: Object) => {
    const lookups = [...emoji.shortcodes];

    if (emoji.tags) {
      lookups.push(...emoji.tags);
    }

    if (emoji.annotation) {
      lookups.push(emoji.annotation);
    }

    if (emoji.emoticon) {
      lookups.push(emoji.emoticon);
    }

    return (lookups.join(' ').indexOf(this.props.query) >= 0);
  };

  render() {
    const { emojis, emojiPath, emojiSize, onEnter, onLeave, onSelect } = this.props;
    const groupedEmojis = this.groupList(emojis);

    return (
      <div className="iep__list">
        {Object.keys(groupedEmojis).map(group => (
          <section key={group} className="iep__list-section" id={`emoji-group-${group}`}>
            <header className="iep__list-header">
              <GroupName group={group} />
            </header>

            <div className="iep__list-body">
              {groupedEmojis[group].map(emoji => (
                <Emoji
                  key={emoji.hexcode}
                  emoji={emoji}
                  emojiPath={emojiPath}
                  emojiSize={emojiSize}
                  onEnter={onEnter}
                  onLeave={onLeave}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }
}
