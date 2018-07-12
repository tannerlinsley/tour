import { createElement } from './utils/dom';
import { horizontalCenter, verticalCenter } from './utils/orientation';
import {render} from 'lit-html/lib/lit-extended';
import {DEFAULT_TEMPLATE, DEFAULT_WRAPPER_CSS} from './defaults'


export default class TourBox {
  offsetX = 10;
  offsetY = 10;

  constructor(tour, template, wrapperCSS) {
    // Initialize stuff
    this.tour = tour;
    this.template = template || DEFAULT_TEMPLATE;
    this.wrapperCSS = wrapperCSS || DEFAULT_WRAPPER_CSS;

    // Setup the event handlers
    this.eventHandlers = {
      close: this.tour.stop.bind(this.tour),
      next: this.tour.nextStep.bind(this.tour),
      previous: this.tour.previousStep.bind(this.tour)
    }

    // Create the wrapper div
    this.wrapper = createElement('div', this.wrapperCSS);
  }

  render(data, progress) {
    render(this.template(data, this.eventHandlers, progress), this.wrapper);
  }

  cleanup(){
    this.wrapper.remove()
  }

  goToPosition(x, y) {
    this.wrapper.style.left = `${x}px`;
    this.wrapper.style.top = `${y}px`;
  }

  goToElement(target, orientation='bottom') {
    let targetRect = target.getBoundingClientRect();
    let wrapperRect = this.wrapper.getBoundingClientRect();

    // Compute base positions (the absolute x and y of the upper left corner)
    let baseX = targetRect.x + window.scrollX;
    let baseY = targetRect.y + window.scrollY;

    // Calculate the shift (how much to move relative to the base position based) based on the orientation
    let {horizontalShift, verticalShift} = this.calculateRelativeShift(orientation, targetRect, wrapperRect)

    // Go to the computed position
    let newX = baseX + horizontalShift;
    let newY =  baseY + verticalShift
    this.goToPosition(newX, newY);

    // Check that the width/height didn't change in the process (if they did we need to rerun again since centering will be thrown off)
    // Explanation: Sometimes the browser will rerender the div when you move it to help fit its contents in the viewport (ie if you try to smush the tour div onto the right side of the screen partially, it'll resize to fit)
    let newWrapperRect = this.wrapper.getBoundingClientRect()
    if(wrapperRect.width !==  newWrapperRect.width || wrapperRect.height !== newWrapperRect.height){
      this.goToElement(target, orientation)
    }
  }

  calculateRelativeShift(orientation, targetRect, wrapperRect){
    let horizontalShift = 0;
    let verticalShift = 0;
    
    switch (orientation){
      case 'bottom':
        horizontalShift += horizontalCenter(targetRect) - horizontalCenter(wrapperRect);
        verticalShift += targetRect.height + this.offsetY;
        break;
      case 'top':
        horizontalShift += horizontalCenter(targetRect) - horizontalCenter(wrapperRect);
        verticalShift -= wrapperRect.height + this.offsetY;
        break;
      case 'left':
        verticalShift += verticalCenter(targetRect) - verticalCenter(wrapperRect);
        horizontalShift -= wrapperRect.width + this.offsetX;
        break;
      case 'right': 
      verticalShift += verticalCenter(targetRect) - verticalCenter(wrapperRect);
      horizontalShift += targetRect.width + this.offsetX;
      break;
    }
  
    return {horizontalShift, verticalShift}
  }
}