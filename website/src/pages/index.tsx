import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './styles.module.css';

interface FeatureProps {
	title: string;
	description: React.ReactNode;
	imageUrl?: string;
}

const features: FeatureProps[] = [
	{
		title: 'Safe and clean HTML',
		// imageUrl: 'img/undraw_docusaurus_mountain.svg',
		description: (
			<>
				Whether the HTML content is user submitted, third-party or tooling generated, or manual
				written, have confidence knowing it will be safely rendered to avoid all vulnerabilities and
				XSS attack vectors. Never write <code>dangerouslySetInnerHTML</code> again!
			</>
		),
	},
	{
		title: 'Dynamic content',
		// imageUrl: 'img/undraw_docusaurus_tree.svg',
		description: (
			<>
				Utilize filters, matchers, and transformers to take full control of the content being
				rendered. Filters attributes and elements, autolink URLs, replace tokens, inject React
				components, and more!
			</>
		),
	},
	{
		title: 'Emojis, emojis, emojis',
		// imageUrl: 'img/undraw_docusaurus_react.svg',
		description: (
			<>
				With the power of{' '}
				<a href="https://emojibase.dev" rel="noreferrer" target="_blank">
					Emojibase
				</a>
				, easily replace emoji unicode characters and shortcodes with dynamic SVGs or PNGs. Take
				this a step further by integrating a fully robust and feature complete emoji picker.
			</>
		),
	},
];

function Feature({ imageUrl, title, description }: FeatureProps) {
	const imgUrl = useBaseUrl(imageUrl);

	return (
		<div className={clsx('col col--4', styles.feature)}>
			{imgUrl && (
				<div className="text--center">
					<img alt={title} className={styles.featureImage} src={imgUrl} />
				</div>
			)}

			<h3>{title}</h3>
			<p>{description}</p>
		</div>
	);
}

function Home() {
	const context = useDocusaurusContext();
	const { siteConfig = {} } = context;

	return (
		<Layout description={siteConfig.tagline} title="Safely render HTML in React">
			<header className={clsx('hero hero--primary', styles.heroBanner)}>
				<div className="container">
					<h1 className="hero__title">{siteConfig.title}</h1>
					<p className="hero__subtitle">{siteConfig.tagline}</p>
					<div className={styles.buttons}>
						<Link
							className={clsx('button button--secondary button--lg', styles.getStarted)}
							to={useBaseUrl('docs/')}
						>
							Get started
						</Link>

						<iframe
							frameBorder="0"
							scrolling="0"
							src="https://ghbtns.com/github-btn.html?user=milesj&repo=interweave&type=star&count=true&size=large"
							title="GitHub"
						/>
					</div>
				</div>
			</header>

			<main>
				<section className={styles.features}>
					<div className="container">
						<div className="row">
							{features.map((props, idx) => (
								// eslint-disable-next-line react/no-array-index-key
								<Feature key={idx} {...props} />
							))}
						</div>
					</div>
				</section>
			</main>
		</Layout>
	);
}

export default Home;
