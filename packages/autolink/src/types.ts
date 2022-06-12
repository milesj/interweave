import React from 'react';
import { ChildrenNode } from 'interweave';

export interface LinkProps {
	children: React.ReactNode;
	href: string;
	key?: number | string;
	newWindow?: boolean;
	onClick?: () => null | void;
}

export interface EmailProps extends Partial<LinkProps> {
	children: ChildrenNode;
	email: string;
	emailParts: {
		host: string;
		username: string;
	};
}

export interface HashtagProps extends Partial<LinkProps> {
	children: ChildrenNode;
	encodeHashtag?: boolean;
	hashtag: string;
	hashtagUrl?: string | ((hashtag: string) => string);
	preserveHash?: boolean;
}

export interface UrlProps extends Partial<LinkProps> {
	children: ChildrenNode;
	url: string;
	urlParts: {
		auth: string;
		fragment: string;
		host: string;
		path: string;
		port: number | string;
		query: string;
		scheme: string;
	};
}

export interface UrlMatcherOptions {
	customTLDs?: string[];
	validateTLD?: boolean;
}

export interface MentionProps extends Partial<LinkProps> {
	children: ChildrenNode;
	mention: string;
	mentionUrl?: string | ((hashtag: string) => string);
}
