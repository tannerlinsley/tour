import Tour from '../src/newtour.js'

var myTour = window.myTour = {
  canExit: true,
  steps: [{
    target: '#features',
    content: "Let's take a look at some features!"
  }, {
    target: '#feature1',
    content: "No matter the browser size, I'm always in the right spot. Try resizing!"
  }, {
    target: '#feature2',
    content: "By default, Tour puts your tooltips in the perfect spot, automagically!"
  }, {
    target: '#feature3',
    content: "Promises are built in by default along with powerful before and after hooks for each step!"
  }, {
    target: '#feature4',
    content: "Unlike intro.js, ng-joyride, and others, Tour.js will NOT relayer your elements, shuffle your z-indices or manipulate your existing DOM in any way."
  }, {
    target: '#vader',
    content: "Luke, come to the dark side... it's easily themable ;)",
    before: function() {
      return new Promise(function(resolve, reject){

        var vaderEl = document.getElementById('vader')
        vaderEl.style.opacity = '1'

        var boxEl = document.getElementById('Tour-box')
        boxEl.className += ' ' + 'dark-box'

        resolve()
      })
    },
    after: function() {
      return new Promise(function(resolve, reject){

        var vaderEl = document.getElementById('vader')
        vaderEl.style.opacity = '0'

        var boxEl = document.getElementById('Tour-box')
        var classes = boxEl.className.split(' ')
        classes = classes.filter(function(d){
          return d !== 'dark-box'
        })
        boxEl.className = classes.join(' ')

        resolve()
      })
    }
  }, {
    target: '#installation',
    content: "Installation is a breeze, and Tour.js is a lightweight (weighing in at about 12kb gzipped!)"
  }, {
    target: '#usage',
    content: "Tours are ridiculously easy to build."
  }, {
    target: '#config',
    content: "And customization is a snap! These are the defaults which you can override globally, per tour, or per step."
  }, {
    target: '#api',
    content: "A clean and simple API to get the job done."
  }, {
    target: '#promises',
    content: "Built in hooks let you fine-tune and control your app state as the tour progresses!"
  }, {
    target: '#forkme_banner',
    content: "I'll let you take it from here. <h4 style='text-align:right'><strong><3 <a href='http://github.com/tourjs'>tourjs</a></h4> "
  }]
}


// console.log('Tour', tour)
// let tour = new Tour(myTour)
// console.log({tour})
// // tour.start();