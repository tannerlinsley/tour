import {createElement, setCanvasDimensions, isFixedPosition, getAbsoluteBoundingRect} from '../utils/dom'

export default class Mask {
  MASK_CSS = `
    position: absolute;
    z-index: 99999999999999;
    pointer-events: none;
  `;

  constructor({alpha, customCSS}) {
    //Initialize properties
    this.alpha = alpha;

    // Handle custom mask css
    if(customCSS){
      // Append it to the end of MASK_CSS (last css overides)
      this.MASK_CSS += customCSS
    }
    
    // Initialize the canvas
    this.initCanvas();
  }

  cleanup(){
    this.clearFill()
  }

  initCanvas() {
    // Create a canvas spanning the whole body
    this.canvas = createElement('canvas', this.MASK_CSS);
    // Get the context
    this.ctx = this.canvas.getContext("2d");
  }

  setCanvasPosition(x, y, width, height){
    // Set the x, y position
    this.canvas.style.top = `${y}px`;
    this.canvas.style.left = `${x}px`

    // Set the width, height dimensions
    setCanvasDimensions(this.canvas, width, height)
  }

  refill(){
    this.clearFill();
    this.fill()
  }

  fill() {
    this.ctx.fillStyle = `rgba(0,0,0,${this.alpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  createHoleAtPosition(position) {
    this.ctx.clearRect(position.x, position.y, position.width, position.height);
  }

  clearFill(){
    this.createHoleAtPosition({x: 0, y: 0, width: this.canvas.width, height: this.canvas.height})
  }
}