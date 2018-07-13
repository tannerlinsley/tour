import {createElement, setCanvasDimensions, isFixedPosition, getAbsoluteBoundingRect} from './utils/dom'

export default class Mask {
  MASK_CSS = `
    position: absolute;
    z-index: 99999999999999;
    pointer-events: none;
    top: 0px;
    left: 0px;
  `;

  constructor({alpha}) {
    this.alpha = alpha;
    this.initCanvas();
  }

  mask(target){
    let targetRect = getAbsoluteBoundingRect(target)

    this.refill();

    this.createHoleAtPosition({
      x: targetRect.left,
      y: targetRect.top,
      width: targetRect.width,
      height: targetRect.height
    })

    // Handle case where target is fixed position
    if(isFixedPosition(target)){
      window.requestAnimationFrame(()=>this.mask(target))
    }
  }


  cleanup(){
    this.clearFill()
  }

  initCanvas() {
    // Create a canvas spanning the whole body
    this.canvas = createElement('canvas', this.MASK_CSS);
    this.setCanvasPosition();
    // Get the context
    this.ctx = this.canvas.getContext("2d");
  }

  setCanvasPosition(){
    let bodyRect = document.body.getBoundingClientRect();
    setCanvasDimensions(this.canvas, bodyRect.width, bodyRect.height)
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