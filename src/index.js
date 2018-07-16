import Mask from "./components/Mask";
import TourBox from "./components/TourBox";
import Renderer from "./renderer/Renderer";
import { scrollIntoViewIfNecessary } from './utils/dom';

export default class Tour {
  constructor(steps = [], config = {}) {
    // Get the config
    let {
      customTemplate,
      customTourBoxWrapperCSS,
      alpha
    } = config;
    
    // If the user provides a query string instead of an element target, resolve the element here
    this.steps = steps;
    this.steps.forEach(step => {
      step.target = typeof step.target === 'string' ? document.querySelector(step.target) : step.target
    });
    
    // Initialize stuff
    this.mask = new Mask({ alpha: alpha || 0.5 });
    this.tourBox = new TourBox(this, customTemplate || null, customTourBoxWrapperCSS || null);
    this.renderer = new Renderer(this.tourBox, this.mask);
    this.currentStep = 0;
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