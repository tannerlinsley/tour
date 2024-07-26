/**
 * Helper function for creating DOM elements, applying CSS, and appending them to the body
 * @param {String} tagName
 * @param {String} css
 */
export function createElement(tagName: string, css: string) {
	// Create the element
	const el = document.createElement(tagName);

	// Apply any styles (if provided)
	if (css) el.setAttribute('style', css);

	// Append the element to the body
	document.body.appendChild(el);

	return el;
}

/**
 * Sets the canvas dimensions properly to avoid warping / blurriness issues
 * @param {HTMLCanvasElement} canvas
 * @param {Number} width
 * @param {Number} height
 */
export function setCanvasDimensions(canvas: HTMLCanvasElement, width: number, height: number) {
	// Set the CSS width and height
	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;

	// Set the canvas' internal width and height
	canvas.width = width;
	canvas.height = height;
}

/**
 *
 * @param {HTMLElement} el
 */
export function scrollIntoViewIfNecessary(el: HTMLElement) {
	if (!elementIsVisible(el)) {
		el.scrollIntoView({ behavior: 'smooth' });
	}
}

/**
 * Determine whether or not an element is within the viewport
 * @param {HTMLElement} el
 */
function elementIsVisible(el: HTMLElement) {
	const rect = el.getBoundingClientRect();
	const elIsAboveViewport = rect.bottom < 0;
	const elIsBelowViewport = rect.top > window.innerHeight;
	return !(elIsAboveViewport || elIsBelowViewport);
}

// function getAllParentNodes(el: HTMLElement) {
// 	const result = [];
// 	let current = el;
// 	while ((current = current.parentNode)) {
// 		if (current instanceof HTMLElement) {
// 			result.push(current);
// 		}
// 	}
// 	return result;
// }

export function getAbsoluteBoundingRect(el: HTMLElement): Rect {
	let rect;

	rect = document.body.getBoundingClientRect();

	if (el) {
		rect = el.getBoundingClientRect();
	}

	const result = {
		top: rect.top + window.scrollY,
		bottom: rect.bottom + window.scrollY,
		left: rect.left + window.scrollX,
		right: rect.right + window.scrollX,
		width: rect.width,
		height: rect.height,
		x: 0,
		y: 0
	};

	result.x = result.left;
	result.y = result.top;
	return result;
}
