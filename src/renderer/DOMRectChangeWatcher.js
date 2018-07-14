import { getAbsoluteBoundingRect } from '../utils/dom';
import objectsShallowEqual from 'shallow-equal/objects';
import EventEmitter from 'es6-event-emitter';


export default class DOMRectChangeWatcher extends EventEmitter {
  constructor(el, config) {
    // Initialize stuff
    super();
    this.el = el;
    this.config = config || {};
    this.forceUpdate = false;
    this.isLocked = false;
    this.shouldStop = false;

    // Set the intial rect
    this.rect = getAbsoluteBoundingRect(el);

    // Start the watcher
    this.watch();
  }

  // The "watch" function is called at the DOM's animation frame rate continously
  watch() {
    if (this.shouldUpdate()) {
      this.trigger('change', this.rect);
    }

    if(!this.shouldStop){
      window.requestAnimationFrame(() => this.watch());
    }
  }

  shouldUpdate() {
    let should = this.forceUpdate || this.rectsDidChange();
    return !this.isLocked && should
  }

  rectsDidChange() {
    let newRect = getAbsoluteBoundingRect(this.el);
    let rectsAreDifferent = !objectsShallowEqual(this.rect, newRect);

    if (rectsAreDifferent) {
      this.rect = newRect;
    }

    return rectsAreDifferent;
  }

  updateTarget(newTarget) {
    this.el = newTarget;
  }

  forceUpdate() {
    this.forceUpdate = true;
  }

  lock(){
    console.log('🔒 Locking')
    this.isLocked = true;
  }

  unlock(){
    console.log('🔑 Unlocking')
    this.isLocked = false;
  }

  unlockOnNextFrame(){
    setTimeout(()=>this.unlock(),0)
  }

  kill(){
    this.shouldStop = true;
  }
}
