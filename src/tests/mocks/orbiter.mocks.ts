import type {
	AnalyticKey,
	SetPageView,
	SetPerformanceMetric,
	SetTrackEvent
} from '$declarations/orbiter/orbiter.did';
import type { SatelliteIdText } from '$lib/types/satellite';
import { Principal } from '@dfinity/principal';
import { nanoid } from 'nanoid';

export interface SetPageViewsRequestEntry {
	key: AnalyticKey;
	page_view: SetPageViewPayload;
}

export type SetPageViewRequest = {
	satellite_id: SatelliteIdText;
} & SetPageViewsRequestEntry;

export type SetPageViewsRequest = Pick<SetPageViewRequest, 'satellite_id'> & {
	page_views: SetPageViewsRequestEntry[];
};

export interface SetPageViewPayload {
	title: string;
	referrer?: string;
	time_zone: string;
	session_id: string;
	href: string;
	device: PageViewDevicePayload;
	version?: bigint;
	user_agent?: string;
	client?: PageViewClientPayload;
	campaign?: SetPageViewCampaignPayload;
}

export interface PageViewDevicePayload {
	inner_height: number;
	inner_width: number;
	screen_height?: number;
	screen_width?: number;
}

export interface SetPageViewCampaignPayload {
	utm_source: string;
	utm_medium?: string;
	utm_campaign?: string;
	utm_term?: string;
	utm_content?: string;
}

export interface PageViewClientPayload {
	browser: string;
	os: string;
	device?: string;
}

export interface SetTrackEventRequestEntry {
	key: AnalyticKey;
	track_event: SetTrackEventPayload;
}

export type SetTrackEventRequest = {
	satellite_id: SatelliteIdText;
} & SetTrackEventRequestEntry;

export type SetTrackEventsRequest = Pick<SetPageViewRequest, 'satellite_id'> & {
	track_events: SetTrackEventRequestEntry[];
};

export interface SetTrackEventPayload {
	name: string;
	metadata?: Record<string, string>;
	session_id: string;
	version?: bigint;
	user_agent?: string;
}

export type PerformanceMetricName = 'CLS' | 'FCP' | 'INP' | 'LCP' | 'TTFB';

export interface PerformanceData {
	WebVitalsMetric: WebVitalsMetric;
}

export interface WebVitalsMetric {
	value: number;
	delta: number;
	id: string;
	navigation_type?: NavigationType;
}

export type NavigationType =
	| 'Navigate'
	| 'Reload'
	| 'BackForward'
	| 'BackForwardCache'
	| 'Prerender'
	| 'Restore';

export interface SetPerformanceRequestEntry {
	key: AnalyticKey;
	performance_metric: SetPerformanceMetricPayload;
}

export type SetPerformanceRequest = {
	satellite_id: SatelliteIdText;
} & SetPerformanceRequestEntry;

export type SetPerformancesRequest = Pick<SetPageViewRequest, 'satellite_id'> & {
	performance_metrics: SetPerformanceRequestEntry[];
};

export interface SetPerformanceMetricPayload {
	href: string;
	metric_name: PerformanceMetricName;
	data: PerformanceData;
	user_agent?: string;
	session_id: string;
	version?: bigint;
}

export type PageViewPayload = SetPageViewPayload & {
	updated_at: bigint;
	created_at: bigint;
};

export type TrackEventPayload = Omit<SetTrackEventPayload, 'user_agent'> & {
	updated_at: bigint;
	created_at: bigint;
};

export type PerformanceMetricPayload = Omit<SetPerformanceMetricPayload, 'user_agent'> & {
	updated_at: bigint;
	created_at: bigint;
};

export const satelliteIdMock = Principal.fromText('ck4tp-3iaaa-aaaal-ab7da-cai');

const userAgentMock =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:125.0) Gecko/20100101 Firefox/125.0';

export const userAgentHeadersMock: [string, string][] = [['User-Agent', userAgentMock]];

const { timeZone } = Intl.DateTimeFormat().resolvedOptions();

const sessionId = nanoid();

export const pageViewMock: SetPageView = {
	href: 'https://test.com',
	device: {
		inner_height: 300,
		inner_width: 600,
		screen_width: [1920],
		screen_height: [1080]
	},
	satellite_id: satelliteIdMock,
	referrer: [],
	session_id: sessionId,
	title: 'Test',
	time_zone: timeZone,
	user_agent: [userAgentMock],
	client: [
		{
			browser: 'Firefox',
			device: ['desktop'],
			os: 'Mac os'
		}
	],
	campaign: [
		{
			utm_source: 'newsletter',
			utm_medium: ['email'],
			utm_campaign: ['spring_launch'],
			utm_term: ['rust-sdk'],
			utm_content: ['cta-button']
		}
	],
	version: [],
	updated_at: []
};

export const pageViewPayloadMock: SetPageViewPayload = {
	href: 'https://test.com',
	device: {
		inner_height: 300,
		inner_width: 600,
		screen_width: 1920,
		screen_height: 1080
	},
	session_id: sessionId,
	title: 'Test',
	time_zone: timeZone,
	user_agent: userAgentMock,
	client: {
		browser: 'Firefox',
		device: 'desktop',
		os: 'Mac os'
	},
	campaign: {
		utm_source: 'newsletter',
		utm_medium: 'email',
		utm_campaign: 'spring_launch',
		utm_term: 'rust-sdk',
		utm_content: 'cta-button'
	}
};

export const trackEventMock: SetTrackEvent = {
	name: 'my_event',
	metadata: [
		[
			['event1', 'Lorem ipsum dolor sit amet'],
			['event2', ' Praesent congue, mauris id commodo vulputate']
		]
	],
	satellite_id: satelliteIdMock,
	session_id: sessionId,
	user_agent: [userAgentMock],
	version: [],
	updated_at: []
};

export const trackEventPayloadMock: SetTrackEventPayload = {
	name: 'my_event',
	metadata: {
		event1: 'Lorem ipsum dolor sit amet',
		event2: ' Praesent congue, mauris id commodo vulputate'
	},
	session_id: sessionId,
	user_agent: userAgentMock
};

export const performanceMetricMock: SetPerformanceMetric = {
	session_id: sessionId,
	data: {
		WebVitalsMetric: {
			id: nanoid(),
			value: 1.23,
			navigation_type: [{ Navigate: null }],
			delta: 0.5
		}
	},
	href: 'https://test.com',
	metric_name: { LCP: null },
	satellite_id: satelliteIdMock,
	version: [],
	user_agent: [userAgentMock]
};

export const performanceMetricPayloadMock: SetPerformanceMetricPayload = {
	session_id: sessionId,
	data: {
		WebVitalsMetric: {
			id: nanoid(),
			value: 1.23,
			navigation_type: 'Navigate',
			delta: 0.5
		}
	},
	href: 'https://test.com',
	metric_name: 'LCP',
	user_agent: userAgentMock
};
