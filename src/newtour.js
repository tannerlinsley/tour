if (module.hot) {
  module.hot.accept(function() {
    location.reload();
  });
}




import Mask from "../src2/Mask";
import TourBox from "../src2/TourBox";

let mask = new Mask({ alpha: 0.5 });
let tourBox = new TourBox();

function tourStep(stepData, target) {
  tourBox.render(stepData);
  tourBox.goToElement(target);
  mask.mask(target);
}


// Example call:
let target = document.querySelector("#features");
let exampleStepData = { title: "Hello", content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum" };
tourStep(exampleStepData, target);


window.tourStep = tourStep;