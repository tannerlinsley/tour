import { createElement, setCanvasDimensions } from '../utils/dom';

export default class Mask {
	MASK_CSS: string;
	alpha: number;
	canvas?: HTMLCanvasElement;
	ctx?: CanvasRenderingContext2D;
	constructor({ alpha }: { alpha: number }, customCSS?: string) {
		this.MASK_CSS = 'position: absolute; z-index: 10; pointer-events: none;';

		// Initialize properties
		this.alpha = alpha;

		// Handle custom mask css
		if (customCSS) {
			// Append it to the end of MASK_CSS (last css overides)
			this.MASK_CSS += customCSS;
		}

		// Initialize the canvas
		this.initCanvas();
	}

	cleanup() {
		this.clearFill();
	}

	initCanvas() {
		// Create a canvas spanning the whole body
		if (document.getElementById('tour_canvas') === null) {
			this.canvas = createElement('canvas', this.MASK_CSS) as HTMLCanvasElement;
			this.canvas.id = 'tour_canvas';
		} else {
			this.canvas = document.getElementById('tour_canvas') as HTMLCanvasElement;
		}
		// Get the context
		this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
	}

	setCanvasPosition(x: number, y: number, width: number, height: number) {
		if (!this.canvas) return new Error('Canvas not initialized.');
		// Set the x, y position
		this.canvas.style.top = `${y < 0 ? 0 : y}px`;
		this.canvas.style.left = `${x < 0 ? 0 : x}px`;

		// Set the width, height dimensions
		setCanvasDimensions(this.canvas, width, height);
	}

	refill() {
		this.clearFill();
		this.fill();
	}

	fill() {
		if (!this.canvas) return new Error('Canvas not initialized.');
		if (!this.ctx) return new Error('Canvas context not initialized.');
		this.ctx.fillStyle = `rgba(0,0,0,${this.alpha})`;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	createHoleAtPosition(position: { x: number; y: number; width: number; height: number }) {
		if (!this.ctx) return new Error('Canvas context not initialized.');
		this.ctx.clearRect(position.x, position.y, position.width, position.height);
	}

	clearFill() {
		if (!this.canvas) return new Error('Canvas not initialized.');
		this.createHoleAtPosition({ x: 0, y: 0, width: this.canvas.width, height: this.canvas.height });
	}
}
