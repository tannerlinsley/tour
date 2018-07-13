/**
 * Helper function for creating DOM elements, applying CSS, and appending them to the body
 * @param {String} tagName 
 * @param {String} css 
 */
export function createElement(tagName, css){
  // Create the element
  let el = document.createElement(tagName);

  // Apply any styles (if provided)
  if(css) el.setAttribute('style', css)

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
export function setCanvasDimensions(canvas, width, height){
  // Set the CSS width and height
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // Set the canvas' internal width and height
  canvas.width = width;
  canvas.height = height;
}


/**
 * Determine whether or not an element is within the viewport
 * @param {HTMLElement} el 
 */
export function elementIsVisible(el){
  let rect = el.getBoundingClientRect();
  let elIsAboveViewport =  rect.bottom < 0
  let elIsBelowViewport = rect.top > window.innerHeight;
  return !(elIsAboveViewport || elIsBelowViewport)
}

/**
 * DOM utility to determine if an element is fixed position or not
 * Note: Will not return false positives, but may return false negatives (elements that should be fixed but don't behave that way - if one of the fixed ancestors has a CSS transform)
 * @param {HTMLElement} el 
 */
export function isFixedPosition(el){
  return getAllParentNodes(el).some(el => getComputedStyle(el).position === 'fixed')
}

function getAllParentNodes(el){
  let result = [];
  let current = el;
  while(current = current.parentNode){
    if(current instanceof HTMLElement){
      result.push(current)
    }
  }
  return result;
}