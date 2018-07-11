import {createCanvas} from './utils/dom'

export default class Mask {
  MASK_CSS = `
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 99999999999999;
  `;

  constructor({alpha}) {
    this.alpha = alpha;

    this._initCanvas();
  }

  mask(target){
    let targetRect = target.getBoundingClientRect();
    let bodyRect = document.body.getBoundingClientRect();

    this._refill()

    this._createHoleAtPosition({
      x: targetRect.x - bodyRect.x,
      y: targetRect.y - bodyRect.y,
      width: targetRect.width,
      height: targetRect.height
    })
  }


  _initCanvas() {
    // Create a canvas spanning the whole body
    let bodyRect = document.body.getBoundingClientRect();
    this.canvas = createCanvas(bodyRect.width, bodyRect.height, this.MASK_CSS);

    // Get the context
    this.ctx = this.canvas.getContext("2d");
  }

  _refill(){
    this._clearFill()
    this._fill()
  }

  _fill() {
    this.ctx.fillStyle = `rgba(0,0,0,${this.alpha})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  _createHoleAtPosition(position) {
    this.ctx.clearRect(position.x, position.y, position.width, position.height);
  }

  _clearFill(){
    this._createHoleAtPosition({x: 0, y: 0, width: this.canvas.width, height: this.canvas.height})
  }
}