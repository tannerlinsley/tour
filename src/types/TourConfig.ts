import type { ComponentType } from 'svelte';

interface TourConfig {
	customTemplate?: ComponentType;
	customTourBoxWrapperCSS?: string;
	alpha?: number;
	theme?: 'light' | 'dark';
}

export type { TourConfig };
