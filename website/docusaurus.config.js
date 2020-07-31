/* eslint-disable sort-keys */

const pkg = require('interweave/package.json');

module.exports = {
  title: 'Interweave',
  tagline:
    'React library to safely render HTML, filter attributes, autowrap text with matchers, render emoji characters, and much more.',
  url: 'https://interweave.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.svg',
  organizationName: 'milesj',
  projectName: 'interweave',
  themeConfig: {
    navbar: {
      title: 'Interweave',
      logo: {
        alt: 'Interweave',
        src: 'img/logo.svg',
      },
      items: [
        {
          href: 'https://www.npmjs.com/package/interweave',
          label: `v${pkg.version}`,
          position: 'left',
        },
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/milesj/interweave',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Miles Johnson. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          homePageId: 'index',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/milesj/interweave/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/milesj/interweave/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
