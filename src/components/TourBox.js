import { render } from 'lit-html/lib/lit-extended';
import { DEFAULT_TEMPLATE, DEFAULT_WRAPPER_CSS } from '../defaults';
import { createElement } from '../utils/dom';
import { horizontalCenter, verticalCenter } from '../utils/orientation';


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

  renderData(data, progress) {
    render(this.template(data, this.eventHandlers, progress), this.wrapper);
  }

  cleanup(){
    this.wrapper.remove()
  }

  goToPosition(x, y) {
    this.wrapper.style.left = `${x}px`;
    this.wrapper.style.top = `${y}px`;
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