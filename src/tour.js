import Mask from "./Mask";
import TourBox from "./TourBox";
import {elementIsVisible} from './utils/dom'

export default class Tour {
  constructor(steps = [], config = {}) {
    this.steps = steps;
    
    this.steps.forEach(step => {
      step.target = typeof step.target === 'string' ? document.querySelector(step.target) : step.target
    });
    
    this.config = config;
    this.mask = new Mask({ alpha: 0.5 });
    this.tourBox = new TourBox(this, config.customTemplate || null, config.customWrapperCSS || null);
    this.currentStep = 0;

    window.addEventListener('resize', () => {
      // Reinitialize the mask canvas
      this.mask.resizeCanvasToFillBody();
      // Re-render the current step
      this.renderStep(this.currentStep)
    })
  }

  renderStep(stepIndex) {
    let step = this.steps[stepIndex];

    // Run before hook
    if(step.before){
      step.before();
    }
    
    // Compute the current progress
    let progress = {current: stepIndex + 1, total: this.steps.length}

    // Display the step
    this.tourBox.render(step.data, progress);
    this.tourBox.goToElement(step.target);
    this.mask.mask(step.target);


    // Scroll the target into view if necessary
    if(!elementIsVisible(step.target)){
      step.target.scrollIntoView({behavior: 'smooth'})
    }
    // Scroll the tour into view if necessary
    if(!elementIsVisible(this.tourBox.wrapper)){
      this.tourBox.wrapper.scrollIntoView({behavior: 'smooth'})
    }

    // Run the after hook
    if(step.after){
      step.after();
    }
  }

  start() {
    // Display the first step
    this.renderStep(0);

    // Return a promise
    return new Promise((resolve, reject) => {
      this.promiseResolve = resolve;
      this.promiseReject = reject;
    });
  }

  nextStep() {
    if (++this.currentStep < this.steps.length) {
      this.renderStep(this.currentStep);
    } else {
      this.done();
    }
  }

  previousStep() {
    if (--this.currentStep > -1) {
      this.renderStep(this.currentStep);
    }
  }

  cleanup() {
    this.tourBox.cleanup();
    this.mask.cleanup();
  }

  done() {
    this.cleanup();
    this.promiseResolve("Done :)");
  }

  stop() {
    this.cleanup();
    this.promiseReject("Tour closed by user");
  }
}