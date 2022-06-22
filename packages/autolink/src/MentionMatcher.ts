import React from 'react';
import { ChildrenNode, Matcher, Node } from 'interweave';
import { MENTION_PATTERN } from './constants';
import { Mention } from './Mention';
import { MentionProps } from './types';

export class MentionMatcher extends Matcher<MentionProps> {
	replaceWith(children: ChildrenNode, props: MentionProps): Node {
		return React.createElement(Mention, props, children);
	}

	asTag(): string {
		return 'a';
	}

	match(string: string) {
		return this.doMatch(string, MENTION_PATTERN, this.handleMatches);
	}

	handleMatches(matches: string[]): { mention: string } {
		return {
			mention: matches[1],
		};
	}
}
