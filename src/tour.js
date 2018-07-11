import Mask from "./Mask";
import TourBox from "./TourBox";

export default class Tour {
  constructor(steps = [], config = {}) {
    // Initialize the class
    this.steps = steps;
    
    this.steps.forEach(step => {
      step.target = typeof step.target === 'string' ? document.querySelector(step.target) : step.target
    })
    
    this.config = config;
    this.mask = new Mask({ alpha: 0.5 });
    this.tourBox = new TourBox(this);
    this.currentStep = 0;

    window.addEventListener('resize', evt => {
      // Reinitialize the mask canvas
      this.mask.resizeCanvasToFillBody()
      // Rerender the current step
      this.displayCurrentStep()
    })
  }

  displayStep(step) {
    // Run before hook
    if(step.before){
      step.before();
    }

    // Display the step
    this.tourBox.render(step.data);
    this.tourBox.goToElement(step.target);
    this.mask.mask(step.target);


    // Run the after hook
    if(step.after){
      step.after();
    }
  }

  displayCurrentStep() {
    this.displayStep(this.steps[this.currentStep]);
  }

  start() {
    // Display the first step
    this.displayCurrentStep();

    // Return a promise
    return new Promise((resolve, reject) => {
      this.promiseResolve = resolve;
      this.promiseReject = reject;
    });
  }

  nextStep() {
    if (++this.currentStep < this.steps.length) {
      this.displayCurrentStep();
    } else {
      this.done();
    }
  }

  previousStep() {
    if (--this.currentStep > -1) {
      this.displayCurrentStep();
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