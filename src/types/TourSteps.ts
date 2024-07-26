import type { Orientation } from './Orientation';
import type { TourData } from './TourData';

interface TourSteps {
	orientation?: Orientation;
	target: string | Element | HTMLElement | null;
	before?: () => void;
	after?: () => void;
	data: TourData;
}

export type { TourSteps };
