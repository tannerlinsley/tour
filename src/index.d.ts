import type { TourConfig } from './types/TourConfig';
import type { TourSteps } from './types/TourSteps';

declare class Tour {
	constructor(steps: TourSteps[], config: TourConfig);
	renderStep(stepIndex: number): void;
	start(): Promise<void>;
	nextStep(): void;
	previousStep(): void;
	cleanup(): void;
	done(): void;
	stop(): void;
}
export { Tour };
