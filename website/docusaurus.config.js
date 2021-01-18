/* eslint-disable sort-keys */

const pkgs = [
  'interweave',
  'interweave-autolink',
  'interweave-emoji',
  'interweave-emoji-picker',
  'interweave-ssr',
  // eslint-disable-next-line
].map((name) => require(`${name}/package.json`));

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
          label: `v${pkgs[0].version}`,
          position: 'left',
          items: pkgs.map((pkg) => ({
            label: `v${pkg.version} · ${pkg.name.replace(/^interweave-?/, '') || 'core'}`,
            href: `https://www.npmjs.com/package/${pkg.name}`,
          })),
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
      copyright: `Copyright © ${new Date().getFullYear()} Miles Johnson. Built with <a href="https://docusaurus.io/">Docusaurus</a>.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
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
