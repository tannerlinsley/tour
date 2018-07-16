import 'babel-polyfill';
import DOMRectChangeWatcher from './DOMRectChangeWatcher';

export default class Renderer {
  constructor(tourBox, mask) {
    this.tourBox = tourBox;
    this.mask = mask;
    this.started = false;
  }

  renderStep(step) {
    // Set the target and orientation
    this.target = step.target;
    this.orientation = step.orientation || 'bottom';

    // Start the renderer if not already started
    this.startIfNotStarted()

    // Tell the target watcher to update the target element it's watching
    this.targetWatcher.updateTarget(this.target);
  }

  start() {
    this.setupWatchers();

    // Render everything for the first time
    this.renderCanvas(this.bodyWatcher.rect);
    this.renderMask(this.targetWatcher.rect);
    this.renderTourBox(this.targetWatcher.rect);
  }

  // todo: use this
  startIfNotStarted(){
    if (!this.started) {
      this.start();
      this.started = true;
    }
  }

  setupWatchers() {
    /* Initialize watchers */
    this.tourBoxWatcher = new DOMRectChangeWatcher(this.tourBox.wrapper);
    this.bodyWatcher = new DOMRectChangeWatcher(document.documentElement);
    this.targetWatcher = new DOMRectChangeWatcher(this.target, { debug: true });

    /* Setup event handlers */

    //todo: try putting lock here :)
    this.tourBoxWatcher.on('change', () => 
      this.renderTourBox(this.targetWatcher.rect)
    );

    //todo: replace with functionally equivelent native dom resize event
    this.bodyWatcher.on('change', newRect => {
      this.renderCanvas(newRect);
    });

    this.targetWatcher.on('change', newRect => {
      this.renderMask(newRect);
      this.renderTourBox(newRect)
    });
  }

  async renderCanvas(bodyRect) {
    this.mask.setCanvasPosition(0, 0, bodyRect.width, bodyRect.height);
  }

  async renderMask(targetRect) {
    this.mask.refill();
    this.mask.createHoleAtPosition(targetRect);
  }

  async renderTourBox(targetRect) {
    // Calculate the shift (how much to move relative to the base position based) based on the orientation
    let relativeShift = this.tourBox.calculateRelativeShift(
      this.orientation,
      targetRect,
      this.tourBoxWatcher.rect
    );

    // Go to the computed position
    let newX = targetRect.x + relativeShift.horizontalShift;
    let newY = targetRect.y + relativeShift.verticalShift;

    // Update the position
    this.tourBox.goToPosition(newX, newY);
  }

  cleanup(){
    this.tourBoxWatcher.kill();
    this.bodyWatcher.kill()
    this.targetWatcher.kill()
  }
}

//todo: handle cleanup
//todo: reorganize code, probably seperate render functions back into the component classes instead of here