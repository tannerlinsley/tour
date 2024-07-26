import type Mask from '../components/Mask';
import type TourBox from '../components/TourBox';
import type { Orientation } from '../types/Orientation';
import type { Rect } from '../types/Rect';
import type { TourSteps } from '../types/TourSteps';
import DOMRectChangeWatcher from './DOMRectChangeWatcher';

export default class Renderer {
	tourBox: TourBox;
	mask: Mask;
	started: boolean;
	target?: string | HTMLElement | Element | null;
	orientation?: Orientation;
	targetWatcher?: DOMRectChangeWatcher;
	bodyWatcher?: DOMRectChangeWatcher;
	tourBoxWatcher?: DOMRectChangeWatcher;
	constructor(tourBox: TourBox, mask: Mask) {
		this.tourBox = tourBox;
		this.mask = mask;
		this.started = false;
	}

	renderStep(step: TourSteps) {
		// Set the target and orientation
		this.target = step.target;
		this.orientation = (step.orientation as Orientation) || 'bottom';

		// Start the renderer if not already started
		this.startIfNotStarted();

		// Tell the target watcher to update the target element it's watching
    if (!this.targetWatcher) throw new Error('DOM TargetWatcher not initialized');
		this.targetWatcher.updateTarget(this.target as HTMLElement);
	}

	start() {
		this.setupWatchers();

		// Render everything for the first time
    if (!this.tourBoxWatcher || !this.bodyWatcher || !this.targetWatcher) throw new Error('DOM Watchers not initialized');
		this.renderCanvas(this.bodyWatcher.rect);
		this.renderMask(this.targetWatcher.rect);
		this.renderTourBox(this.targetWatcher.rect);
	}

	// todo: use this
	startIfNotStarted() {
		if (!this.started) {
			this.start();
			this.started = true;
		}
	}

	setupWatchers() {
		/* Initialize watchers */
		this.tourBoxWatcher = new DOMRectChangeWatcher(this.tourBox.wrapper);
		this.bodyWatcher = new DOMRectChangeWatcher(document.documentElement);
		this.targetWatcher = new DOMRectChangeWatcher(this.target as HTMLElement, { debug: true });

		/* Setup event handlers */

		//todo: try putting lock here :)
    if (!this.targetWatcher) throw new Error('DOM Target Watcher not initialized');
		this.tourBoxWatcher.on('change', () => this.renderTourBox(this.targetWatcher.rect));

		//todo: replace with functionally equivelent native dom resize event
		this.bodyWatcher.on('change', (newRect: Rect) => {
			this.renderCanvas(newRect);
		});

		this.targetWatcher.on('change', (newRect: Rect) => {
			this.renderMask(newRect);
			this.renderTourBox(newRect);
		});
	}

	async renderCanvas(bodyRect: Rect) {
		this.mask.setCanvasPosition(0, 0, bodyRect.width, bodyRect.height);
	}

	async renderMask(targetRect: Rect) {
		this.mask.refill();
		this.mask.createHoleAtPosition(targetRect);
	}

	async renderTourBox(targetRect: Rect) {
		// Calculate the shift (how much to move relative to the base position based) based on the orientation
		if (!this.tourBoxWatcher) throw new Error('TourBoxWatcher not initialized');
		const relativeShift = this.tourBox.calculateRelativeShift(
			this.orientation as Orientation,
			targetRect,
			this.tourBoxWatcher.rect
		);

		// Go to the computed position
		const newX = targetRect.x + relativeShift.horizontalShift;
		const newY = targetRect.y + relativeShift.verticalShift;

		// Update the position
		this.tourBox.goToPosition(newX, newY);
	}

	cleanup() {
		if (!this.tourBoxWatcher || !this.bodyWatcher || !this.targetWatcher) throw new Error('DOM Watchers not initialized');
		this.tourBoxWatcher.kill();
		this.bodyWatcher.kill();
		this.targetWatcher.kill();
	}
}

//todo: handle cleanup
//todo: reorganize code, probably seperate render functions back into the component classes instead of here
