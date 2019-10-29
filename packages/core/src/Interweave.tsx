import React from 'react';
import Parser from './Parser';
import Markup, { MarkupProps } from './Markup';
import { FilterInterface } from './Filter';
import { MatcherInterface } from './Matcher';
import { AfterParseCallback, BeforeParseCallback } from './types';

export interface InterweaveProps extends MarkupProps {
  /** Support all the props used by matchers. */
  [prop: string]: any;
  /** Disable all filters from running. */
  disableFilters?: boolean;
  /** Disable all matches from running. */
  disableMatchers?: boolean;
  /** List of filters to apply to the content. */
  filters?: FilterInterface[];
  /** List of matchers to apply to the content. */
  matchers?: MatcherInterface<any>[];
  /** Callback fired after parsing ends. Must return an array of React nodes. */
  onAfterParse?: AfterParseCallback<InterweaveProps> | null;
  /** Callback fired beore parsing begins. Must return a string. */
  onBeforeParse?: BeforeParseCallback<InterweaveProps> | null;
}

export default function Interweave(props: InterweaveProps) {
  const {
    content = '',
    disableFilters = false,
    disableMatchers = false,
    emptyContent = null,
    filters = [],
    matchers = [],
    onAfterParse = null,
    onBeforeParse = null,
    tagName = 'span',
    ...parserProps
  } = props;
  const allMatchers = disableMatchers ? [] : matchers;
  const allFilters = disableFilters ? [] : filters;
  const beforeCallbacks = onBeforeParse ? [onBeforeParse] : [];
  const afterCallbacks = onAfterParse ? [onAfterParse] : [];

  // Inherit callbacks from matchers
  allMatchers.forEach(matcher => {
    if (matcher.onBeforeParse) {
      beforeCallbacks.push(matcher.onBeforeParse.bind(matcher));
    }

    if (matcher.onAfterParse) {
      afterCallbacks.push(matcher.onAfterParse.bind(matcher));
    }
  });

  // Trigger before callbacks
  const markup = beforeCallbacks.reduce((string, callback) => {
    const nextString = callback(string, props);

    if (__DEV__) {
      if (typeof nextString !== 'string') {
        throw new TypeError('Interweave `onBeforeParse` must return a valid HTML string.');
      }
    }

    return nextString;
  }, content || '');

  // Parse the markup
  const parser = new Parser(markup, parserProps, allMatchers, allFilters);

  // Trigger after callbacks
  const nodes = afterCallbacks.reduce((parserNodes, callback) => {
    const nextNodes = callback(parserNodes, props);

    if (__DEV__) {
      if (!Array.isArray(nextNodes)) {
        throw new TypeError(
          'Interweave `onAfterParse` must return an array of strings and React elements.',
        );
      }
    }

    return nextNodes;
  }, parser.parse());

  return (
    <Markup
      emptyContent={emptyContent}
      tagName={tagName}
      parsedContent={nodes.length === 0 ? undefined : nodes}
    />
  );
}
