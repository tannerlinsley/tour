import Mask from './components/Mask';
import TourBox from './components/TourBox';
import Renderer from './renderer/Renderer';
import type { TourConfig } from './types/TourConfig';
import type { TourData } from './types/TourData';
import type { TourSteps } from './types/TourSteps';
import { scrollIntoViewIfNecessary } from './utils/dom';

export type { TourConfig, TourData, TourSteps };

export default class Tour {
	steps: TourSteps[];
	mask: Mask;
	tourBox: TourBox;
	renderer: Renderer;
	currentStep: number;
	promiseResolve?: (value: unknown) => void;
	promiseReject?: (reason?: unknown) => void;

	constructor(
		steps: TourSteps[] = [] as unknown as TourSteps[],
		config: TourConfig = {} as unknown as TourConfig
	) {
		// Get the config
		const { customTemplate, customTourBoxWrapperCSS, alpha, theme } = config;

		// If the user provides a query string instead of an element target, resolve the element here
		this.steps = steps;
		this.steps.forEach((step) => {
			step.target =
				typeof step.target === 'string' ? document.querySelector(step.target) : step.target;

			// If for any reason the target is not found, set it to the body (fallback)
			if (step.target === null) {
				step.target = document.body;
			}
		});

		// Initialize stuff
		this.mask = new Mask({ alpha: alpha ?? 0.5 });
		this.tourBox = new TourBox(this, customTemplate, customTourBoxWrapperCSS, theme);
		this.renderer = new Renderer(this.tourBox, this.mask);
		this.currentStep = 0;
	}

	renderStep(stepIndex: number) {
		const step = this.steps[stepIndex];

		// Run before hook
		if (step.before) {
			try {
				step.before();
			} catch (e) {
				console.error('TourJS: Function `before` encountered a fatal error: ' + e);
			}
		}

		// Compute the current progress
		const progress = {
			current: stepIndex + 1,
			total: this.steps.length

			// Display the step
		};
		// Prevent re-rendering the same component twice
		if (document.getElementById('tour_modal') !== null) {
			// Remove the old 'tour_modal'
			document.getElementById('tour_modal')?.remove();
		}
		this.tourBox.renderData(step.data, progress);

		this.renderer.renderStep(step);

		// Make sure everything is scrolled into view (First the target. Then, if nescessary, the tourBox)
		scrollIntoViewIfNecessary(step.target as HTMLElement);
		scrollIntoViewIfNecessary(this.tourBox.wrapper);

		// Run the after hook
		if (step.after) {
			try {
				step.after();
			} catch (e) {
				console.error('TourJS: Function `after` encountered a fatal error: ' + e);
			}
		}
	}

	start() {
		if (this.steps.length === 0) {
			throw new Error('No steps provided');
		}
		// Display the first step
		this.renderStep(0);

		// Return a promise
		return new Promise((resolve, reject) => {
			this.promiseResolve = resolve;
			this.promiseReject = reject;
		});
	}

	nextStep() {
		if (this.currentStep < this.steps.length - 1) {
			this.currentStep++;
			this.renderStep(this.currentStep);
		} else {
			this.done();
		}
	}

	previousStep() {
		if (this.currentStep > 0) {
			this.currentStep--;
			this.renderStep(this.currentStep);
		}
	}

	cleanup() {
		this.tourBox.cleanup();
		this.mask.cleanup();
		this.renderer.cleanup();
	}

	done() {
		this.cleanup();
		this.promiseResolve('Done :)');
	}

	stop() {
		this.cleanup();
		this.promiseReject('Tour closed by user');
	}
}
