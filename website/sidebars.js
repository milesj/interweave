/* eslint-disable sort-keys */

module.exports = {
  docs: [
    'index',
    'matchers',
    'filters',
    {
      collapsed: false,
      type: 'category',
      label: 'Extensions',
      items: ['exts/autolink', 'exts/emoji', 'exts/emoji-picker'],
    },
    'compose',
    'parser',
    'ssr',
    {
      type: 'link',
      label: 'Changelog',
      href: 'https://github.com/milesj/interweave/blob/master/CHANGELOG.md',
    },
  ],
};
