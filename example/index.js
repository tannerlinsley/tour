var myTour = window.myTour = {
  config: {
    //dark: true,
  },
  steps: [{
    target: '#features',
    content: "Let's take a look at some features!"
  }, {
    target: '#feature1',
    content: "No matter the browser size, I'm always in the right spot."
  }, {
    target: '#feature2',
    content: "No more defining the position for every step! Try resizing your browser..."
  }, {
    target: '#start-demo',
    content: "I even know when to step aside when your browser gets too short :)"
  }, {
    target: '#feature3',
    content: "Promises are passed around and resolved like candy. Yes, that means asyncronous hooks for tour progression!"
  }, {
    target: '#feature4',
    content: "Unlike intro.js, ng-joyride, and others, I WON'T relayer your DOM, shuffle your z-indexes or otherwise F up your perfectly architected UI."
  }, {
    target: '#vader',
    content: "Luke, come to the dark side...",
    before: function() {
      return new Promise((resolve, reject) => {

        var vaderEl = document.getElementById('vader')
        vaderEl.styles.opacity = '1'

        var boxEl = document.getElementById('Tour-box')
        boxEl.addClass('dark-box')

        resolve()
      })
    },
    after: function() {
      return new Promise((resolve, reject) => {

        var vaderEl = document.getElementById('vader')
        vaderEl.styles.opacity = '0'

        var boxEl = document.getElementById('Tour-box')
        boxEl.removeClass('dark-box')

        resolve()
      })
    }
  }, {
    target: '#installation',
    content: "Installation is a breeze, and I'm only 4kb gzipped! (14kb non-zipped)"
  }, {
    target: '#usage',
    content: "Tours are simple JSON, as everything should be in life."
  }, {
    target: '#config',
    content: "Customization is a snap! These are my defaults which you can override globally or per tour."
  }, {
    target: '#api',
    content: "Easy peezy."
  }, {
    target: '#promises',
    content: "Built in promises make angular awesome, and now your tours can be just as powerful!"
  }, {
    target: '#forkme_banner',
    content: "I'll let you take it from here. <h4 style='text-align:right'><strong><3 <a href='http://github.com/tourjs'>tourjs</a></h4> "
  }]
}

window.start = function(){
  tour.start(myTour)
}
