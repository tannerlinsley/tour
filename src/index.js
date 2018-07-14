import Mask from "./components/Mask";
import TourBox from "./components/TourBox";
import {scrollIntoViewIfNecessary} from './utils/dom'
import Renderer from "./renderer/Renderer";

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

    this.renderer = new Renderer(this.tourBox, this.mask);
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
    this.tourBox.renderData(step.data, progress);
    this.renderer.renderStep(step)

    // Make sure everything is scrolled into view (First the target. Then, if nescessary, the tourBox)
    scrollIntoViewIfNecessary(step.target);
    scrollIntoViewIfNecessary(this.tourBox.wrapper)

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
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.renderStep(this.currentStep);
    } else {
      this.done();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.renderStep(this.currentStep);
    }
  }

  cleanup() {
    this.tourBox.cleanup();
    this.mask.cleanup();
    this.renderer.cleanup();
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