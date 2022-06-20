import React from 'react';
import { ChildrenNode, Matcher, Node } from 'interweave';
import { Mention } from './Mention';
import { MentionProps } from './types';

const MENTION_PATTERN = /(^@[\dA-z-]+$)/;

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
			mention: matches[0],
		};
	}
}
