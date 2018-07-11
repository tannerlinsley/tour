export function createElement(tagName, css){
  // Create the element
  let el = document.createElement(tagName);

  // Apply any styles (if provided)
  if(css) el.setAttribute('style', css)

  // Append the element to the body
  document.body.appendChild(el);
  
  return el;
}

export function setCanvasDimensions(canvas, width, height){
  // Set the CSS width and height
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // Set the canvas' internal width and height
  canvas.width = width;
  canvas.height = height;
}

export function elementIsVisible(el){
  let rect = el.getBoundingClientRect();
  let elIsAboveViewport =  rect.bottom < 0
  let elIsBelowViewport = rect.top > window.innerHeight;
  return !(elIsAboveViewport || elIsBelowViewport)
}