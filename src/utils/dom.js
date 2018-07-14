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
 * 
 * @param {HTMLElement} el 
 */
export function scrollIntoViewIfNecessary(el){
  if(!elementIsVisible(el)){
    el.scrollIntoView({behavior: 'smooth'})
  }
}

/**
 * Determine whether or not an element is within the viewport
 * @param {HTMLElement} el 
 */
function elementIsVisible(el){
  console.log('el',el)
  let rect = el.getBoundingClientRect();
  let elIsAboveViewport =  rect.bottom < 0
  let elIsBelowViewport = rect.top > window.innerHeight;
  return !(elIsAboveViewport || elIsBelowViewport)
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


export function getAbsoluteBoundingRect(el) {
  let rect = el.getBoundingClientRect();

  let result = {
    top: rect.top + window.pageYOffset,
    bottom: rect.bottom + window.pageYOffset,
    left: rect.left + window.pageXOffset,
    right: rect.right + window.pageXOffset,
    width: rect.width,
    height: rect.height
  }

  result.x = result.left;
  result.y = result.top;

  return result;
}