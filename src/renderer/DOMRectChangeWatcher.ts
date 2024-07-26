import EventEmitter from 'event-emitter-es6';
import { shallowEqualObjects } from 'shallow-equal';
import { getAbsoluteBoundingRect } from '../utils/dom';
import type { Rect } from '../types/Rect';

export default class DOMRectChangeWatcher extends EventEmitter {
	el: HTMLElement;
	config: { debug: boolean };
	forceUpdate_: boolean;
	isLocked: boolean;
	shouldStop: boolean;
	rect: Rect;
	constructor(el: HTMLElement, config?: { debug: boolean }) {
		// Initialize stuff
		super();
		this.el = el;
		this.config = config || { debug: false };
		this.forceUpdate_ = false;
		this.isLocked = false;
		this.shouldStop = false;

		// Set the intial rect
		this.rect = getAbsoluteBoundingRect(el);

		// Start the watcher
		this.watch();
	}

	// The "watch" function is called at the DOM's animation frame rate continously
	watch() {
		if (this.shouldUpdate()) {
			this.emit('change', this.rect);
		}

		if (!this.shouldStop) {
			window.requestAnimationFrame(() => this.watch());
		}
	}

	shouldUpdate() {
		const should = this.forceUpdate_ || this.rectsDidChange();
		return !this.isLocked && should;
	}

	rectsDidChange() {
		const newRect = getAbsoluteBoundingRect(this.el);
		const rectsAreDifferent = !shallowEqualObjects(this.rect, newRect);

		if (rectsAreDifferent) {
			this.rect = newRect;
		}

		return rectsAreDifferent;
	}

	updateTarget(newTarget: HTMLElement) {
		this.el = newTarget;
	}

	forceUpdate() {
		this.forceUpdate_ = true;
	}

	lock() {
		console.log('🔒 Locking');
		this.isLocked = true;
	}

	unlock() {
		console.log('🔑 Unlocking');
		this.isLocked = false;
	}

	unlockOnNextFrame() {
		setTimeout(() => this.unlock(), 0);
	}

	kill() {
		this.shouldStop = true;
	}
}
