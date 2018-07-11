import Tour from '../src/Tour.js'
import {html} from 'lit-html/lib/lit-extended';

var myTour = window.myTour = {
  canExit: true,
  steps: [{
    target: '#features',
    data: {
      title: "Wow",
      content: "Let's take a look at some features!"
    }
  }, {
    target: '#feature1',
    data: { content: "No matter the browser size, I'm always in the right spot. Try resizing!"}
  }, {
    target: '#feature2',
    data: { content: "By default, Tour puts your tooltips in the perfect spot, automagically!"}
  }, {
    target: '#feature3',
    data: { content: "Promises are built in by default along with powerful before and after hooks for each step!"}
  }, {
    target: '#feature4',
    data: { content: "Unlike intro.js, ng-joyride, and others, Tour.js will NOT relayer your elements, shuffle your z-indices or manipulate your existing DOM in any way."}
  }, {
    target: '#vader',
    data: { content: "Luke, come to the dark side... it's easily themable ;)"},
    before: function() {
      console.log('Before works!')
    },
    after: function() {
      console.log('After works')
    }
  }, {
    target: '#installation',
    data: { content: "Installation is a breeze, and Tour.js is a lightweight (weighing in at about 12kb gzipped!)"}
  }, {
    target: '#usage',
    data: { content: "Tours are ridiculously easy to build."}
  }, {
    target: '#config',
    data: { content: "And customization is a snap! These are the defaults which you can override globally, per tour, or per step."}
  }, {
    target: '#api',
    data: { content: "A clean and simple API to get the job done."}
  }, {
    target: '#promises',
    data: { content: "Built in hooks let you fine-tune and control your app state as the tour progresses!"}
  }, {
    target: '#forkme_banner',
    data: { content: "I'll let you take it from here"}
  }]
}

const config = {
  customTemplate: () => html`hi`
}

let tour = new Tour(myTour.steps, config)
console.log({tour})
tour.start();

if (module.hot) {
  module.hot.dispose(function () {
    tour.done()
  });

  module.hot.accept(function () {
    tour.start();
  });
}


//todo: add scrolling
//todo: add currentStep and length param to template function
  //todo: hid actions when length === 1