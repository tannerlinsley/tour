import umbrella from 'umbrellajs'

const $ = umbrella.u

const defaults = {
  maskVisible: true,
  maskVisibleOnNoTarget: false,
  maskClickThrough: false,
  maskClickExit: false,
  maskScrollThrough: true,
  maskColor: 'rgba(0,0,0,.7)',
  dark: false,
  scrollBox: navigator.userAgent.indexOf('AppleWebKit') != -1 ? "body" : "html",
  previousText: 'Previous',
  nextText: 'Next',
  finishText: 'Finish',
  animationDuration: 400,
  placement: ['bottom', 'right', 'top', 'left'],
  disableHotkeys: false,
  showPrevious: true,
  showNext: true,
  margin: 15,
  maxHeight: 120,
  maxWidth: 250,
}

// Reference to all of our elements that we'll resolve in a bit
const els = {}

// Some utilities for events that we'll resolve in a bit
const eventUtils = {}

// The exported API
const service = {
  current: null,
  //
  start,
  stop,
  pause,
  next,
  previous,
  goto,
}


init()

module.exports = service

function init(){
  document.addEventListener("DOMContentLoaded", () => {
    createEvents()
    injectTemplate()
  })
}

// ########################################################################
// API & State
// ########################################################################




function start(tour){

  if (!tour) {
    return Promise.reject('No Tour Specified!')
  }

  if (!tour.steps.length) {
    return Promise.reject('No steps were found in that tour!')
  }

  if (service.current) {
    return stop()
      .then(function() {
        return start(tour)
      })
  }

  let d, resolve, reject
  d = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  service.current = Object.assign({}, defaults, tour, {
    promise: d,
    resolve,
    reject
  })

  // Check for valid placement default
  if (!validPriorities(service.current.placement)) {
    console.warn(`Tour - Invalid placement setting found in tour config. Must be an array eg: ['bottom', 'right', 'top', 'left']`, service.current)
    service.current.placement = defaults.placement
  }
  // Check for valid step placement
  service.current.steps.forEach((step) => {
    if (!step.placement) { return }
    if (!validPriorities(step.placement)) {
      console.warn(`Tour - Invalid placement setting found in step. Must be an array eg: ['bottom', 'right', 'top', 'left']`, step)
    }
  })

  return updateView()
    .then(() => {
      return service.current.promise
    })
}

function stop() {

  service.current.reject({
    error: 'interrupted',
    message: `The tour was interrupted`
  })

  service.current = false
  updateView()
}

function pause() {
  if (service.current) {
    service.current.show = false
  }
  return updateView()
}

function next() {
  return doAfter(service.current.index)
    .then(() => {
      service.current.index++
      return doBefore(service.current.index)
    })
    .then(() => {
      return updateView()
    })
}

function previous() {
  service.current.index--
  return doBefore(service.current.index)
    .then(function() {
      return updateView()
    })
}

function goto(i) {
  // Utilize the previous method with a ++
  service.current.index = i++
  return previous()
}



// ########################################################################
// Internals
// ########################################################################

function doBefore(i) {
  if (service.current.steps[i].before) {
    return service.current.steps[i].before()
  }
}

function doAfter(i) {
  if (service.current.steps[i].after) {
    return service.current.steps[i].after()
  }
}

function updateView(){

  // Finish
  if (service.current.index === service.current.steps.length) {
    return Promise.resolve(true)
  }
  // Not found
  if (service.current.index > service.current.steps.length){
    return Promise.reject({
      error: 'not_found',
      message: `Step ${service.current.index} could not be found.`
    })
  }
  // Normal
  return Promise.resolve()

  // Toggle Elements
  if (state) {
    els.box.removeClass('hidden')
    return Promise.resolve()
  } else {
    els.box.addClass('hidden')
    return setTimeout(function() {
      service.cleanup()
    }, service.current.animationDuration)
  }


  //

}




function throttle(callback, limit) {
  var wait = false
  return function() {
    if (!wait) {
      callback.call()
      wait = true
      setTimeout(function() {
        wait = false
      }, limit)
    }
  }
}

function debounce(func, wait, immediate) {
  var timeout
  return function() {
    var context = this,
      args = arguments
    var later = function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}




// ########################################################################
// HTML
// ########################################################################




const template = `
  <div id="Tour-box-wrap">
    <div id="Tour-box" class="hidden">
      <div id="Tour-tip" class="top center"></div>
      <div id="Tour-step">{{view.step + 1}}</div>
      <div id="Tour-length">{{view.length}}</div>
      <div id="Tour-close" ng-click="stop()">&#10005</div>
      <div id="Tour-content">
        <div id="Tour-inner-content"></div>
      </div>
      <div id="Tour-actions">
        <button id="Tour-previous" ng-show="view.step > 0 && view.showPrevious" ng-click="previous()">{{view.previousText}}</button>
        <button id="Tour-next" ng-show="view.step >= 0 && view.showNext" ng-click="next()" class="success">{{view.nextText}}</button>
      </div>
    </div>
  </div>
  <div class="Tour-masks" ng-show="current.tour.config.mask.visible" ng-click="tryStop()">
    <div class="mask top"></div>
    <div class="mask right"></div>
    <div class="mask bottom"></div>
    <div class="mask left"></div>
    <div class="mask center"></div>
  </div>
`

function injectTemplate(){
  const wrap = document.createElement('div')
  document.body.appendChild(wrap)
  wrap.outerHTML = template

  Object.assign(els, {
    window: $(window),
    wrap: $('#Tour-box-wrap'),
    box: $('#Tour-box'),
    tip: $('#Tour-tip'),
    step: $('#Tour-step'),
    close: $('#Tour-close'),
    content: $('#Tour-content'),
    innerContent: $('#Tour-inner-content'),
    actions: $('#Tour-actions'),
    previous: $('#Tour-previous'),
    next: $('#Tour-next'),
    masks_wrap: $('.Tour-masks'),
    masks_top: $('.Tour-masks .top'),
    masks_right: $('.Tour-masks .right'),
    masks_bottom: $('.Tour-masks .bottom'),
    masks_left: $('.Tour-masks .left'),
    masks_center: $('.Tour-masks .center'),
    scroll: $(config.scrollBox),
    target: false
  })


}

function resolveEventSystem(){
  var prefix = '',
    _addEventListener, onwheel, support

  // detect event model
  if (window.addEventListener) {
    _addEventListener = "addEventListener"
    _removeEventListener = "removeEventListener"
  } else {
    _addEventListener = "attachEvent"
    _removeEventListener = "detachEvent"
    prefix = "on"
  }

  // detect available wheel event
  support = "onwheel" in document.createElement("div") ? "wheel" : // Modern browsers support "wheel"
    document.onmousewheel !== undefined ? "mousewheel" : // Webkit and IE support at least "mousewheel"
    "DOMMouseScroll" // let's assume that remaining browsers are older Firefox

  eventUtils.addWheelListener = (elem, callback, useCapture) => {
    _addWheelListener(elem, support, callback, useCapture)

    // handle MozMousePixelScroll in older Firefox
    if (support == "DOMMouseScroll") {
      _addWheelListener(elem, "MozMousePixelScroll", callback, useCapture)
    }
  }

  eventUtils.removeWheelListener = (elem, callback, useCapture) => {
    _removeWheelListener(elem, support, callback, useCapture)

    // handle MozMousePixelScroll in older Firefox
    if (support == "DOMMouseScroll") {
      _removeWheelListener(elem, "MozMousePixelScroll", callback, useCapture)
    }
  }

  function _removeWheelListener(elem, eventName, callback, useCapture) {
    elem[_removeEventListener](prefix + eventName, support == "wheel" ? callback : original, useCapture || false)
  }

  function _addWheelListener(elem, eventName, callback, useCapture) {
    elem[_addEventListener](prefix + eventName, support == "wheel" ? callback : original, useCapture || false)
  }

  function original(originalEvent) {
    !originalEvent && (originalEvent = window.event)

    // create a normalized event object
    var event = {
      // keep a ref to the original event object
      originalEvent: originalEvent,
      target: originalEvent.target || originalEvent.srcElement,
      type: "wheel",
      deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
      deltaX: 0,
      deltaZ: 0,
      preventDefault: function() {
        originalEvent.preventDefault ?
          originalEvent.preventDefault() :
          originalEvent.returnValue = false
      }
    }

    // calculate deltaY (and deltaX) according to the event
    if (support == "mousewheel") {
      event.deltaY = -1 / 40 * originalEvent.wheelDelta
      // Webkit also support wheelDeltaX
      originalEvent.wheelDeltaX && (event.deltaX = -1 / 40 * originalEvent.wheelDeltaX)
    } else {
      event.deltaY = originalEvent.detail
    }

    // it's time to fire the callback
    return callback(event)
  }
}


// const config = $scope.current.tour.config,
//   target = false,
//   seeking = false,
//
//
//
//   scrolling = false,
//   maskTransitions = true,
//   currentStep = null
//
//   var els =
//
//   var dims = {
//     window: {},
//     scroll: {},
//     target: {}
//   }
//
//   // Turn on Transitions
//   toggleMaskTransitions(true)
//   toggleBoxTransitions(true)
//
//         // Mask Events?
//         els.masks_wrap.css('pointer-events', config.mask.clickThrough ? 'none' : 'all')
//
//         // Dark Box?
//         if (config.dark) {
//           els.box.addClass('dark-box')
//           margin = 7
//         }
//
//         // Step Update Listener
//         var stepUpdater = $scope.$on('step', updateStep)
//         // Thottle for 60fps
//         var onWindowScrollDebounced = $scope.throttle(onWindowScroll, 16)
//         var stopScrollingDebounced = $scope.debounce(stopScrolling, 100)
//
//         // Key Bindings
//         if(config.disableHotkeys == false) {
//           els.window.bind('keydown', keyDown)
//           // window scroll, resize bindings
//           els.window.bind('resize scroll', onWindowScrollDebounced)
//           window.addWheelListener(window, onWindowScrollDebounced)
//           // content scroll bindings
//           els.content.bind('scroll', onBoxScroll)
//           window.addWheelListener(els.content[0], onBoxScroll)
//           // mask scroll bindings
//           if (config.mask.scrollThrough === false) {
//             window.addWheelListener(els.masks_wrap[0], stopMaskScroll)
//           }
//         }
//
//         // Event Cleanup
//         $scope.cleanup = function cleanup() {
//           stepUpdater()
//           els.window.unbind('keydown', keyDown)
//           els.window.unbind('resize scroll', onWindowScrollDebounced)
//           window.removeWheelListener(window, onWindowScrollDebounced)
//           els.content.unbind('scroll', onBoxScroll)
//           window.removeWheelListener(els.content[0], onBoxScroll)
//
//           if (config.mask.scrollThrough === false) {
//             window.removeWheelListener(els.masks_wrap[0], stopMaskScroll)
//           }
//           els = {}
//           el.remove()
//         }
//
//         // Events
//
//         $scope.tryStop = function() {
//           if (config.mask.clickExit) {
//             $scope.stop()
//           }
//         }
//
//         function keyDown(e) {
//           if (e.which >= 49 && e.which <= 57) {
//             $scope.gotoStep(e.which - 48)
//             return
//           }
//           switch (e.which) {
//             case 37:
//               $scope.previous()
//               prevent(e)
//               return
//             case 39:
//               $scope.next()
//               prevent(e)
//               return
//             case 27:
//               if (!config.disableEscExit) {
//                 $scope.stop()
//                 prevent(e)
//                 return
//               }
//             case 38:
//             case 40:
//               onWindowScrollDebounced()
//               return
//           }
//         }
//
//         function stopMaskScroll(e) {
//           e.stopPropagation(e)
//           e.preventDefault(e)
//           e.returnValue = false
//           return false
//         }
//
//         function toggleMaskTransitions(state) {
//           var group = els.masks_top.add(els.masks_right).add(els.masks_bottom).add(els.masks_left)
//           if (state) {
//             maskTransitions = true
//             group.css('transition', 'all ' + config.animationDuration + 'ms ease')
//           } else {
//             maskTransitions = false
//             group.css('transition', 'all 0')
//           }
//         }
//
//         function toggleBoxTransitions(state) {
//           var group = els.wrap.add(els.box).add(els.tip)
//           if (state) {
//             group.css('transition', 'all ' + config.animationDuration + 'ms ease')
//           } else {
//             group.css('transition', 'all 0')
//           }
//         }
//
//         function onBoxScroll(e) {
//           var delta
//           if (e.type == 'DOMMouseScroll') {
//             delta = e.detail * -40
//           } else {
//             delta = e.wheelDelta
//           }
//           var up = delta > 0
//           var scrollTop = els.content.scrollTop()
//
//           if (up && !scrollTop) {
//             return prevent(e)
//           }
//           if (!up && (els.innerContent.height() - els.content.height() == scrollTop)) {
//             return prevent(e)
//           }
//         }
//
//         function prevent(e) {
//           e.stopPropagation(e)
//           e.preventDefault(e)
//           e.returnValue = false
//           return false
//         }
//
//         function onWindowScroll() {
//           if (seeking) {
//             return
//           }
//
//           scrolling = true
//           toggleMaskTransitions(false)
//           stopScrollingDebounced()
//
//           findTarget(currentStep)
//             .then(getDimensions)
//             .then(scrollToTarget)
//             .then(getDimensions)
//             .then(moveToTarget)
//         }
//
//         function stopScrolling() {
//           scrolling = false
//           toggleMaskTransitions(true)
//         }
//
//         function updateStep(e, step) {
//           els.target = false
//           var steps = $scope.current.tour.steps
//           currentStep = step
//           $scope.view = {
//             step: step,
//             length: steps.length,
//             previousText: config.previousText,
//             nextText: step == steps.length - 1 ? config.finishText : config.nextText,
//             showNext: steps[step].showNext === undefined ? config.showNext : steps[step].showNext,
//             showPrevious: steps[step].showPrevious === undefined ? config.showPrevious : steps[step].showPrevious
//           }
//           //Don't mess around with angular sanitize for now. Add compile and sanitize later...
//           els.innerContent.html(steps[step].content)
//           // Scroll Back to the top
//           els.content.scrollTop(0)
//
//           // Reset Scrolling and Seeking states
//           seeking = true
//
//           return findTarget(step)
//             .then(getDimensions)
//             .then(scrollToTarget)
//             .then(getDimensions)
//             .then(moveToTarget)
//             .then(function() {
//               seeking = false
//             })
//         }
//
//         // Internal Functions
//         function findTarget(step) {
//           var d = Promise.defer()
//
//           if (els.target) {
//             d.resolve(target)
//           } else {
//             var foundTarget = angular.element($scope.current.tour.steps[step].target)
//             if (!foundTarget.length) {
//               d.resolve(false)
//             } else {
//               els.target = angular.element(foundTarget[0])
//               d.resolve(els.target)
//             }
//           }
//           return d.promise
//         }
//
//         function getDimensions() {
//
//           if (!els.target) {
//             return Promise.resolve(null)
//           }
//
//           // Window
//           dims.window = {
//             width: els.window.width(),
//             height: els.window.height()
//           }
//
//           // Scrollbox
//           dims.scroll = {
//             width: els.scroll.outerWidth(),
//             height: els.scroll.outerHeight(),
//             offset: els.scroll.offset(),
//             scroll: {
//               top: els.scroll.scrollTop(),
//               left: els.scroll.scrollLeft()
//             }
//           }
//
//           // Round Offsets
//           angular.forEach(dims.scroll.offset, function(o, i) {
//             dims.scroll.offset[i] = Math.ceil(o)
//           })
//
//           dims.scroll.height = (dims.scroll.height + dims.scroll.offset.top > dims.window.height) ? dims.window.height : dims.scroll.height
//           dims.scroll.width = (dims.scroll.width + dims.scroll.offset.left > dims.window.width) ? dims.window.width : dims.scroll.width
//           dims.scroll.offset.toBottom = dims.scroll.height + dims.scroll.offset.top
//           dims.scroll.offset.toRight = dims.scroll.width + dims.scroll.offset.left
//           dims.scroll.offset.fromBottom = dims.window.height - dims.scroll.offset.top - dims.scroll.height
//           dims.scroll.offset.fromRight = dims.window.width - dims.scroll.offset.left - dims.scroll.width
//
//           // Target
//           dims.target = {
//             width: els.target.outerWidth(),
//             height: els.target.outerHeight(),
//             offset: els.target.offset()
//           }
//
//           // For an html/body scrollbox
//           if (config.scrollBox == 'body' || config.scrollBox == 'html') {
//             dims.target.offset.top -= dims.scroll.scroll.top
//           }
//
//           // Round Offsets
//           angular.forEach(dims.target.offset, function(o, i) {
//             dims.target.offset[i] = Math.ceil(o)
//           })
//
//           // Get Target Bottom and right
//           dims.target.offset.toBottom = dims.target.offset.top + dims.target.height
//           dims.target.offset.toRight = dims.target.offset.left + dims.target.width
//           dims.target.offset.fromBottom = dims.window.height - dims.target.offset.top - dims.target.height
//           dims.target.offset.fromRight = dims.window.width - dims.target.offset.left - dims.target.width
//
//           // Get Target Margin Points
//           dims.target.margins = {
//             offset: {
//               top: dims.target.offset.top - margin,
//               left: dims.target.offset.left - margin,
//               toBottom: dims.target.offset.toBottom + margin,
//               toRight: dims.target.offset.toRight + margin,
//               fromBottom: dims.target.offset.fromBottom - margin,
//               fromRight: dims.target.offset.fromRight - margin
//             },
//             height: dims.target.height + margin * 2,
//             right: dims.target.offset.fromRight + margin * 2
//           }
//
//           return Promise.resolve(null)
//         }
//
//         function scrollToTarget() {
//           if (!els.target) {
//             return Promise.resolve(null)
//           }
//
//           var newScrollTop = findScrollTop()
//           var d = Promise.defer()
//           if (!newScrollTop) {
//             d.resolve()
//           } else {
//             els.scroll.animate({
//                 scrollTop: newScrollTop
//               }, scrolling ? 0 : config.animationDuration,
//               function() {
//                 d.resolve()
//               })
//           }
//
//           return d.promise
//         }
//
//         function findScrollTop() {
//           // Is element to large to fit?
//           if (dims.target.margins.height > dims.scroll.height) {
//             // Is the element too far above us?
//             if (dims.target.offset.toBottom - maxHeight < dims.scroll.offset.top) {
//               return dims.scroll.scroll.top - (dims.scroll.offset.top - (dims.target.offset.toBottom - maxHeight))
//             }
//             // Is the element too far below us?
//             if (dims.target.offset.top + maxHeight > dims.scroll.offset.toBottom) {
//               return dims.scroll.scroll.top + ((dims.target.offset.top + maxHeight) - dims.scroll.offset.toBottom)
//             }
//             // Must be visible on both ends?
//             return false
//           }
//
//           // Is Element too far Above Us?
//           if (dims.target.margins.offset.top < dims.scroll.offset.top) {
//             return dims.scroll.scroll.top - (dims.scroll.offset.top - dims.target.margins.offset.top)
//           }
//
//           // Is Element too far Below Us?
//           if (dims.target.margins.offset.toBottom > dims.scroll.offset.toBottom) {
//             return dims.scroll.scroll.top + (dims.target.margins.offset.toBottom - dims.scroll.offset.toBottom)
//           }
//
//           return false
//         }
//
//         function moveToTarget() {
//           return Promise.all([
//             moveBox(),
//             moveMasks()
//           ])
//         }
//
//         function moveBox() {
//           var step = $scope.current.tour.steps[$scope.current.index]
//
//           // Default Position?
//           if (!els.target) {
//             placeCentered()
//             return
//           }
//
//           var placementOptions = {
//             bottom: bottom,
//             right: right,
//             left: left,
//             top: top
//           }
//
//           var placed = false
//           angular.forEach((step.placement || config.placement), function(priority) {
//             if (!placed && placementOptions[priority]()) {
//               placed = true
//             }
//           })
//
//           if (!placed) {
//             placeInside('bottom', 'center')
//           }
//
//           return Promise.resolve(null)
//
//           // Placement Priorities
//           function bottom() {
//             // Can Below?
//             if (dims.target.margins.offset.fromBottom > maxHeight) {
//               // Can Centered?
//               if (dims.target.width > maxWidth) {
//                 placeVertically('bottom', 'center')
//                 return true
//               }
//               // Can on the left?
//               if (dims.target.offset.fromRight + dims.target.width > maxWidth) {
//                 placeVertically('bottom', 'left')
//                 return true
//               }
//               // Right, I guess...
//               placeVertically('bottom', 'right')
//               return true
//             }
//             return false
//           }
//
//           function right() {
//             // Can Right?
//             if (dims.target.margins.offset.fromRight > maxWidth) {
//               // Is Element to Large to fit?
//               if (dims.target.margins.height > dims.scroll.height) {
//
//                 if (dims.target.offset.top > dims.window.height / 2) {
//                   placeHorizontally('right', 'top')
//                   return true
//                 }
//
//                 if (dims.target.offset.fromBottom > dims.window.height / 2) {
//                   placeHorizontally('right', 'bottom')
//                   return true
//                 }
//
//                 placeHorizontally('right', 'center', true)
//                 return true
//               }
//
//               // Can Center?
//               if (dims.target.height > maxHeight) {
//                 placeHorizontally('right', 'center')
//                 return true
//               }
//               // can Top?
//               if (dims.target.offset.fromBottom + dims.target.height > maxHeight) {
//                 placeHorizontally('right', 'top')
//                 return true
//               }
//               placeHorizontally('right', 'bottom')
//               return true
//             }
//             return false
//           }
//
//           function left() {
//             // Can Left?
//             if (dims.target.margins.offset.left > maxWidth) {
//               // Is Element to Large to fit?
//               if (dims.target.margins.height > dims.scroll.height) {
//                 placeHorizontally('left', 'center', true)
//                 return true
//               }
//               // can Center?
//               if (dims.target.height > maxHeight) {
//                 placeHorizontally('left', 'center')
//                 return true
//               }
//               // can Top?
//               if (dims.target.offset.fromBottom + dims.target.height > maxHeight) {
//                 placeHorizontally('left', 'top')
//                 return true
//               }
//               placeHorizontally('left', 'bottom')
//               return true
//             }
//             return false
//           }
//
//           function top() {
//             // Can Above?
//             if (dims.target.margins.offset.top > maxHeight) {
//               // Can Centered?
//               if (dims.target.width > maxWidth) {
//                 placeVertically('top', 'center')
//                 return true
//               }
//               // Can on the left?
//               if (dims.target.offset.fromRight + dims.target.width > maxWidth) {
//                 placeVertically('top', 'left')
//                 return true
//               }
//               // Right, I guess...
//               placeVertically('top', 'right')
//               return true
//             }
//             return false
//           }
//
//           // Placement functions
//           function placeVertically(v, h) {
//             var top
//             var left
//             var translateX
//             var translateY
//             var tipY
//
//             if (v == 'top') {
//               top = dims.target.margins.offset.top
//               tipY = 'bottom'
//               translateY = '-100%'
//             } else {
//               top = dims.target.margins.offset.toBottom
//               tipY = 'top'
//               translateY = '0'
//             }
//
//             if (h == 'right') {
//               left = dims.target.offset.toRight
//               translateX = '-100%'
//             } else if (h == 'center') {
//               left = dims.target.offset.left + dims.target.width / 2
//               translateX = '-50%'
//             } else {
//               left = dims.target.offset.left
//               translateX = '0'
//             }
//
//             els.wrap.css({
//               left: left + 'px',
//               top: top + 'px',
//               transform: 'translate(' + translateX + ',' + translateY + ')'
//             })
//
//             els.tip.attr('class', 'vertical ' + tipY + ' ' + h)
//           }
//
//           function placeHorizontally(h, v, fixed) {
//             var top
//             var left
//             var translateX
//             var translateY
//             var tipX
//
//             if (h == 'right') {
//               left = dims.target.margins.offset.toRight
//               tipX = 'left'
//               translateX = '0'
//             } else {
//               left = dims.target.margins.offset.left
//               tipX = 'right'
//               translateX = '-100%'
//             }
//
//             if (fixed) {
//               top = dims.window.height / 2
//               translateY = '-50%'
//             } else if (v == 'top') {
//               top = dims.target.offset.top
//               translateY = '0'
//             } else if (v == 'center') {
//               top = dims.target.offset.top + dims.target.height / 2
//               translateY = '-50%'
//             } else {
//               top = dims.target.offset.toBottom
//               translateY = '-100%'
//             }
//
//             els.wrap.css({
//               left: left + 'px',
//               top: top + 'px',
//               transform: 'translate(' + translateX + ',' + translateY + ')'
//             })
//
//             els.tip.attr('class', 'horizontal ' + tipX + ' ' + v)
//
//           }
//
//           function placeInside(v, h) {
//             var top
//             var left
//             var translateY
//             var translateX
//
//             if (v == 'top') {
//               top = dims.target.margins.offset.top < dims.scroll.offset.top ? margin : dims.target.offset.top
//               translateY = '0'
//             } else {
//               top = dims.target.margins.offset.toBottom > dims.scroll.offset.toBottom ? dims.scroll.offset.toBottom - margin : dims.target.offset.toBottom
//               translateY = '-100%'
//             }
//
//             if (h == 'right') {
//               left = dims.target.offset.left + dims.target.width
//               translateX = '-100%'
//             } else if (h == 'center') {
//               left = dims.target.offset.left + dims.target.width / 2
//               translateX = '-50%'
//             } else {
//               left = dims.target.offset.left
//               translateX = '0'
//             }
//
//             els.wrap.css({
//               left: left + 'px',
//               top: top + 'px',
//               transform: 'translate(' + translateX + ',' + translateY + ')'
//             })
//
//             els.tip.attr('class', 'hidden')
//           }
//
//           function placeCentered() {
//             els.wrap.css({
//               left: '50%',
//               top: '50%',
//               transform: 'translate(-50%, -50%)',
//               margin: '0'
//             })
//             els.tip.attr('class', 'hidden')
//
//           }
//         }
//
//         function moveMasks() {
//           if (!els.target) {
//             els.masks_top.css({
//               height: config.mask.visibleOnNoTarget ? '100%' : '0px'
//             })
//             els.masks_bottom.css({
//               height: '0px'
//             })
//             els.masks_left.css({
//               top: '0px',
//               height: '100%',
//               width: '0px'
//             })
//             els.masks_right.css({
//               top: '0px',
//               height: '100%',
//               width: '0px'
//             })
//             return Promise.resolve(null)
//           }
//
//           var margin = config.highlightMargin ? config.highlightMargin : 0
//
//           els.masks_top.css({
//             height: dims.target.offset.top - margin + 'px',
//             top: dims.target.offset.top < 0 ? dims.target.offset.top + 'px' : 0
//           })
//           els.masks_bottom.css({
//             height: dims.target.offset.fromBottom - margin + 'px',
//             bottom: dims.target.offset.fromBottom < 0 ? dims.target.offset.fromBottom + 'px' : 0
//           })
//           els.masks_left.css({
//             top: dims.target.offset.top - margin + 'px',
//             height: dims.target.height + 2*margin + 'px',
//             width: dims.target.offset.left - margin + 'px'
//           })
//           els.masks_right.css({
//             top: dims.target.offset.top - margin + 'px',
//             height: dims.target.height + 2*margin + 'px',
//             width: dims.target.offset.fromRight - margin + 'px'
//           })
//
//           if (config.disableInteraction) {
//             els.masks_center.css({
//               height: dims.target.height + 2*margin + 'px',
//               top: dims.target.offset.top - margin + 'px',
//               left: dims.target.offset.left - margin + 'px',
//               right: dims.target.offset.fromRight - margin + 'px',
//               backgroundColor: 'transparent'
//             })
//           }
//
//
//           return Promise.resolve(null)
//         }
//       }
//     }
//   })
//
//
// })()








// ########################################################################
// Utils
// ########################################################################

function validPriorities(priorities){
  for (var i = 0; i < priorities.length; i += 1) {
    if (defaults.placement.indexOf(priorities[i]) === -1) {
      return false
    }
  }
  return true
}
