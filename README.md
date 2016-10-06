# Interweave v0.1.0
[![Build Status](https://travis-ci.org/milesj/interweave.svg?branch=master)](https://travis-ci.org/milesj/interweave)

Insert React elements into strings using matchers and filters, while safely rendering HTML.

## Requirements

* ES2015
* React 15+
* IE9+

## Installation

Interweave requires React as a peer dependency.

```
npm install interweave react --save
```

## Documentation

* [Interweave Component](#interweave-component)
    * [Managing Matchers](#managing-matchers)
    * [Managing Filters](#managing-filters)
    * [Callback Events](#callback-events)
* [Markup Component](#markup-component)
* [Matchers](#matchers)
    * [Built-in Matchers](#built-in-matchers)
        * [Email](#email)
        * [Emoji](#emoji)
        * [Hashtag](#hashtag)
        * [IP](#ip)
        * [URL](#url)
    * [Creating A Matcher](#creating-a-matcher)
* [Filters](#filters)
    * [Creating A Filter](#creating-a-filter)
* [HTML Parsing](#html-parsing)
    * [Tag Whitelist](#tag-whitelist)
    * [Attribute Whitelist](#attribute-whitelist)

### Interweave Component

```javascript
import Interweave from 'interweave';

<Interweave markup="This string <b>contains</b> HTML." />
```

#### Managing Matchers

#### Managing Filters

#### Callback Events

### Markup Component

The `Markup` component provides an easy straight-forward pattern
for safely [parsing and rendering HTML](#html-parsing)
without using [dangerouslySetInnerHTML](https://facebook.github.io/react/tips/dangerously-set-inner-html.html).
Unlike the `Interweave` component, the `Markup` component does not
support matchers, filters, or callbacks.

The following props are supported:

* `markup` (string) - A string that contains HTML.
* `tagName` (div | span | p) - The HTML tag name to wrap the output with.

```javascript
import { Markup } from 'interweave';

<Markup markup="This string <b>contains</b> HTML." />
```

### Matchers

#### Built-in Matchers

##### Email

##### Emoji

##### Hashtag

##### IP

##### URL

#### Creating A Matcher

### Filters

#### Creating A Filter

### HTML Parsing

#### Tag Whitelist

#### Attribute Whitelist
