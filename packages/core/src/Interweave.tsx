import React from 'react';
import Parser from './Parser';
import Markup from './Markup';
import { InterweaveProps, CommonInternals, OnBeforeParse, OnAfterParse } from './types';

export default function Interweave(props: InterweaveProps) {
  const {
    attributes,
    content = '',
    emptyContent = null,
    matchers = [],
    noWrap = false,
    onAfterParse = null,
    onBeforeParse = null,
    tagName,
    transformers = [],
  } = props;
  const beforeCallbacks: OnBeforeParse<{}>[] = [];
  const afterCallbacks: OnAfterParse<{}>[] = [];

  // Inherit all callbacks
  function inheritCallbacks(internals: CommonInternals<{}>[]) {
    internals.forEach(internal => {
      if (internal.onBeforeParse) {
        beforeCallbacks.push(internal.onBeforeParse);
      }

      if (internal.onAfterParse) {
        afterCallbacks.push(internal.onAfterParse);
      }
    });
  }

  inheritCallbacks(matchers);
  inheritCallbacks(transformers);

  if (onBeforeParse) {
    beforeCallbacks.push(onBeforeParse);
  }

  if (onAfterParse) {
    afterCallbacks.push(onAfterParse);
  }

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
  const parser = new Parser(markup, props, matchers, transformers);
  let nodes = parser.parse();

  // Trigger after callbacks
  if (nodes) {
    nodes = afterCallbacks.reduce((parserNodes, callback) => {
      const nextNodes = callback(parserNodes, props);

      if (__DEV__) {
        if (!Array.isArray(nextNodes)) {
          throw new TypeError(
            'Interweave `onAfterParse` must return an array of strings and React elements.',
          );
        }
      }

      return nextNodes;
    }, nodes);
  }

  return (
    <Markup
      attributes={attributes}
      emptyContent={emptyContent}
      tagName={tagName}
      noWrap={noWrap}
      parsedContent={nodes}
    />
  );
}
