# Interweave v0.4.0
[![Build Status](https://travis-ci.org/milesj/interweave.svg?branch=master)](https://travis-ci.org/milesj/interweave)

Interweave is a robust library that can...

* Safely render HTML without using `dangerouslySetInnerHTML`.
* Clean HTML attributes using filters.
* Match and replace text using matchers.
* Autolink URLs, IPs, emails, and hashtags.
* Render or replace Emoji characters.
* And much more!

## Requirements

* ES2015
* React 0.14+
* IE9+

## Installation

Interweave requires React as a peer dependency.

```
npm install interweave react --save
```

## Usage

Interweave can primarily be used through the `Interweave` and `Markup`
components, both of which provide an easy, straight-forward implementation
for safely [parsing and rendering HTML](#html-parsing)
without using [dangerouslySetInnerHTML](https://facebook.github.io/react/tips/dangerously-set-inner-html.html).

The `Interweave` component has the additional benefit of utilizing
[filters](#filters), [matchers](#matchers), and callbacks.

```javascript
import Interweave from 'interweave';

<Interweave
    tagName="div"
    className="foo"
    content="This string <b>contains</b> HTML."
/>
```

#### Props

* `content` (string) - The string to render and apply matchers and
  filters to. Supports HTML.
* `tagName` (div | span | p) - The HTML element tag name to wrap the
  output with. Defaults to "span".
* `className` (string) - Class name to append to the HTML element.
* `filters` (Filter[]) - Filters to apply to this local instance.
* `matchers` (Matcher[]) - Matchers to apply to this local instance.
* `disableFilters` (boolean) - Disables both global and local filters.
* `disableMatchers` (boolean) - Disables both global and local matchers.
* `noHtml` (boolean) - Strips HTML tags from the content string while
  parsing.
* `onBeforeParse` (func) - Callback that fires before parsing. Is
  passed the source string and must return a string.
* `onAfterParse` (func) => Callback that fires after parsing. Is
  passed an array of strings/elements and must return an array.

### Markup

Unlike the `Interweave` component, the `Markup` component does not
support matchers, filters, or callbacks. This component is preferred
when rendering strings that contain HTML is the primary use case.

```javascript
import { Markup } from 'interweave';

<Markup content="This string <b>contains</b> HTML." />
```

#### Props

The `Markup` component only supports the `content`, `tagName`, and
`className` props mentioned previously.

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

#### Managing Matchers

#### Managing Filters

#### Callback Events

### Markup Component

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
