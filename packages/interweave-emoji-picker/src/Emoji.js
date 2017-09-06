/**
 * @copyright   2016, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import EmojiCharacter from 'interweave/lib/components/Emoji';
import { SCROLL_LOAD_BUFFER } from './constants';
import { EmojiShape, EmojiPathShape } from './shapes';

import type { Emoji, EmojiPath, ScrollListener } from './types';

type EmojiProps = {
  addScrollListener: (listener: ScrollListener) => void,
  emoji: Emoji,
  emojiPath: EmojiPath,
  onEnter: (emoji: Emoji) => void,
  onLeave: (emoji: Emoji) => void,
  onSelect: (emoji: Emoji) => void,
  removeScrollListener: (listener: ScrollListener) => void,
};

type EmojiState = {
  active: boolean,
  loaded: boolean,
};

export default class EmojiButton extends React.PureComponent<EmojiProps, EmojiState> {
  ref: *;

  static contextTypes = {
    classNames: PropTypes.objectOf(PropTypes.string),
  };

  static propTypes = {
    addScrollListener: PropTypes.func.isRequired,
    emoji: EmojiShape.isRequired,
    emojiPath: EmojiPathShape.isRequired,
    removeScrollListener: PropTypes.func.isRequired,
    onEnter: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  state = {
    active: false,
    loaded: false,
  };

  componentWillMount() {
    this.props.addScrollListener(this.handleLazyLoad);
  }

  componentWillUnmount() {
    this.props.removeScrollListener(this.handleLazyLoad);
  }

  handleEnter = (e: SyntheticMouseEvent<*>) => {
    e.stopPropagation();

    this.setState({
      active: true,
    });

    this.props.onEnter(this.props.emoji);
  };

  handleLazyLoad = (container: HTMLDivElement) => {
    if (this.ref.offsetTop <= (container.scrollTop + container.offsetHeight + SCROLL_LOAD_BUFFER)) {
      this.setState({
        loaded: true,
      });

      this.props.removeScrollListener(this.handleLazyLoad);
    }
  };

  handleLeave = (e: SyntheticMouseEvent<*>) => {
    e.stopPropagation();

    this.setState({
      active: false,
    });

    this.props.onLeave(this.props.emoji);
  };

  handleRef = (ref: *) => {
    this.ref = ref;
  };

  handleSelect = (e: SyntheticMouseEvent<*>) => {
    e.stopPropagation();

    this.props.onSelect(this.props.emoji);
  };

  render() {
    const { emoji, emojiPath } = this.props;
    const { classNames } = this.context;
    const { active, loaded } = this.state;
    const className = [classNames.emoji];

    if (active) {
      className.push(classNames.emojiActive);
    }

    return (
      <button
        key={emoji.hexcode}
        type="button"
        className={className.join(' ')}
        onClick={this.handleSelect}
        onMouseEnter={this.handleEnter}
        onMouseLeave={this.handleLeave}
        ref={this.handleRef}
      >
        {loaded ? (
          <EmojiCharacter
            unicode={emoji.unicode}
            emojiPath={emojiPath}
            emojiSize={1}
          />
        ) : (
          <span style={{ height: '1em' }}>
            &nbsp;
          </span>
        )}
      </button>
    );
  }
}
