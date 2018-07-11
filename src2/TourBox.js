import { createElement } from './utils/dom';
import { horizontalCenter, verticalCenter } from './utils/orientation';
import * as lit from 'lit-html/lib/lit-extended';
import {boxCSS, closeButtonCSS} from './defaultStyles'


const DEFAULT_TEMPLATE = (data, eventHandlers, orientation) => lit.html`
  <div style="${boxCSS}">
    <span style=${closeButtonCSS}" on-click=${eventHandlers.close}>x</span>
    <div style="font-weight:bold">${data.title}</div>
    <div>${data.content}</div>
  </div>
`;

const DEFAULT_WRAPPER_CSS = `
  position: absolute;
  z-index: 999999999999999;
`;

export default class TourBox {
  offsetX = 10;
  offsetY = 10;

  eventHandlers = {
    close: this.closeButtonClickHandler.bind(this)
  }

  constructor(template, wrapperCSS) {
    // Initialize the class properties
    this.template = template || DEFAULT_TEMPLATE;
    this.wrapperCSS = wrapperCSS || DEFAULT_WRAPPER_CSS;

    // Create the wrapper div
    this.wrapper = createElement('div', this.wrapperCSS);
  }

  render(data) {
    lit.render(this.template(data, this.eventHandlers), this.wrapper);
  }

  goToPosition(x, y) {
    this.wrapper.style.left = `${x}px`;
    this.wrapper.style.top = `${y}px`;
  }

  goToElement(target, orientation='bottom') {
    let targetRect = target.getBoundingClientRect();
    let wrapperRect = this.wrapper.getBoundingClientRect();
    let bodyRect = document.body.getBoundingClientRect();

    // Compute base positions (the absolute x and y of the upper left corner)
    let baseX = targetRect.x - bodyRect.x;
    let baseY = targetRect.y - bodyRect.y;

    // Calculate the shift (how much to move relative to the base position based) based on the orientation
    let {horizontalShift, verticalShift} = this.calculateRelativeShift(orientation, targetRect, wrapperRect)

    // Go to the computed position
    let newX = baseX + horizontalShift;
    let newY =  baseY + verticalShift
    this.goToPosition(newX, newY);

    // Check that the width/height didn't change in the process (if they did we need to rerun again since cerntering will be thrown off)
    // Explanation: Sometimes the browser will rerender the div when you move it to help fit its contents in the viewport (ie if you try to smush the tour div onto the right side of the screen partially, it'll resize to fit)
    let newWrapperRect = this.wrapper.getBoundingClientRect()
    if(wrapperRect.width !==  newWrapperRect.width || wrapperRect.height !== newWrapperRect.height){
      console.log('Looks like the browser decided to screww us over...')
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
        verticalShift -= wrapperRect.height + this.offsetY
        break;
      case 'left':
        verticalShift += verticalCenter(targetRect) - verticalCenter(wrapperRect)
        horizontalShift -= wrapperRect.width + this.offsetX
        break;
      case 'right': 
      verticalShift += verticalCenter(targetRect) - verticalCenter(wrapperRect)
      horizontalShift += targetRect.width + this.offsetX
      break;
    }
  
    return {horizontalShift, verticalShift}
  }

  closeButtonClickHandler(){
    console.log('hiiii', this)
  }
}