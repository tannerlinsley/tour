import $ from 'cash-dom'
import TA from 'TinyAnimate'
import './tour.styl'

const defaults = {
  maskVisible: true,
  maskVisibleOnNoTarget: false,
  maskClickThrough: false,
  canExit: false,
  maskScrollThrough: true,
  maskColor: 'rgba(0,0,0,.3)',
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
  padding: 5,
  maxHeight: 120,
  maxWidth: 250,
}

// Reference to all of our elements and uiState that we'll add to in a bit
const els = {}

// Reference to all of our dimensions
const dims = {}

const errors = {
  notFound: {
    error: 'not_found',
    message: `Step could not be found.`
  },
  interrupted: {
    error: 'interrupted',
    message: `The tour was interrupted`
  }
}

// The exported API
const service = {
  current: null,
  //
  start,
  stop,
  next,
  previous,
  goto,
}

let initialized

export default service

// ########################################################################
// API & State
// ########################################################################




function start(tour){

  if(!initialized){
    init()
    initialized = true
  }

  if (!tour) {
    return Promise.reject('No Tour Specified!')
  }

  if (!tour.steps.length) {
    return Promise.reject('No steps were found in that tour!')
  }

  if (service.current) {
    stop()
    return start(tour)
  }

  //todo: fix this stupidity... replac with Promise.resolve(promise) and Promise.reject(promise)
  let d, resolve, reject
  d = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })

  service.current = Object.assign({}, defaults, tour, {
    index: 0,
    promise: d,
    resolve,
    reject
  })

  prepView()
  updateView()

  return service.current.promise
}

function stop() {
  cleanup()
  service.current.reject(errors.interrupted)
  service.current = null
}

function next() {
  if(!stepExists(service.current.index + 1)){
    return finish()
  }
  return doAfter(service.current.index)
    .then(() => {
      service.current.index++
    })
    .then((res) => {
      // Finish
      if (service.current.index === service.current.steps.length) {
        return Promise.resolve(true)
      }
      return doBefore(service.current.index)
    })
    .then((res) => {
      // Finish things out
      if(res === true){
        return doAfter(service.current.index)
          .then((res) => {
            return finish()
          })
      }
      updateView()
    })
}

function previous() {
  if(!stepExists(service.current.index - 1)){
    return
  }
  return doAfter(service.current.index)
    .then((res) => {
      service.current.index--
      return doBefore(service.current.index)
    })
    .then((res) => {
      updateView()
    })
}

function goto(i) {
  if(!stepExists(i)){
    return Promise.reject(errors.notFound)
  }
  return doAfter(service.current.index)
    .then((res) => {
      service.current.index = i
      return doBefore(service.current.index)
    })
    .then((res) => {
      updateView()
    })
}



// ########################################################################
// Internals
// ########################################################################

function init(){
  injectTemplate()
}

function prepView(){

  const {current} = service

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

  Object.assign(els, {
    window: $(window),
    tour: $('#Tour'),
    wrap: $('#Tour-box-wrap'),
    box: $('#Tour-box'),
    tip: $('#Tour-tip'),
    step: $('#Tour-step'),
    length: $('#Tour-length'),
    close: $('#Tour-close'),
    content: $('#Tour-content'),
    innerContent: $('#Tour-inner-content'),
    actions: $('#Tour-actions'),
    previous: $('#Tour-previous'),
    next: $('#Tour-next'),
    masks_wrap: $('#Tour-masks'),
    masks_top: $('#Tour-masks .top'),
    masks_right: $('#Tour-masks .right'),
    masks_bottom: $('#Tour-masks .bottom'),
    masks_left: $('#Tour-masks .left'),
    masks_center: $('#Tour-masks .center'),
    canvas: $('#Tour-canvas'),
    ctx: $('#Tour-canvas')[0].getContext("2d"),
    scroll: $(current.scrollBox),
    target: false
  })

  Object.assign(dims, {
    window: {},
    scroll: {},
    target: {},
    canvas: {
      left: 0,
      top: 0,
      right: 0,
      bottom : 0
    }
  })

  // Events
  if(!current.disableHotkeys) {
    els.previous.on('click', previous)
    els.next.on('click', next)
    els.close.on('click', clickStop)

    els.window.on('keydown', keyDown)
  }


  els.tour.removeClass('hidden')
}

function doBefore(i) {
  if(!service.current.steps[i]){
    return Promise.resolve()
  }
  if (service.current.steps[i].before) {
    return service.current.steps[i].before()
  }
  return Promise.resolve()
}

function doAfter(i) {
  if(!service.current.steps[i]){
    return Promise.resolve()
  }
  if (service.current.steps[i].after) {
    return service.current.steps[i].after()
  }
  return Promise.resolve()
}

function finish(){
  cleanup()
  service.current.resolve()
  service.current = null
}

function updateView(){

  console.log('---')

  const current = service.current
  const steps = current.steps
  const index = current.index
  const currentStep = steps[index]

  // Mask Events?
  els.masks_wrap.css('pointer-events', (currentStep.maskClickThrough !== undefined ? currentStep.maskClickThrough : current.maskClickThrough) ? 'none' : 'all')

  // Dark Box?
  if (currentStep.dark !== undefined ? currentStep.dark : current.dark) {
    els.box.addClass('dark-box')
  } else{
    els.box.removeClass('dark-box')
  }

  // HTML updates
  els.step.text(index + 1)
  els.length.text(steps.length)
  els.innerContent.text(currentStep.content)
  els.previous.text(currentStep.previousText || current.previousText)
  els.next.text(currentStep.nextText || (index == steps.length - 1 ? current.finishText : current.nextText))

  if(currentStep.showNext === undefined ? current.showNext : currentStep.showNext){
    els.next.css({display: null})
  } else{
    els.next.css({display: 'none'})
  }

  if(index > 0 && (currentStep.showPrevious === undefined ? current.showPrevious : currentStep.showPrevious)){
    els.previous.css({display: null})
  } else{
    els.previous.css({display: 'none'})
  }

  if(currentStep.canExit === undefined ? current.canExit : currentStep.canExit){
    els.close.css({display: null })
  }
  else{
    els.close.css({display: 'none'})
  }

  // Scroll the content box back to the top
  els.content[0].scrollTop = 0

  console.log(target);

  let target = findTarget();

  getDimensions()

  // Scroll target into view if not visible
  console.log('elementIsVisible', elementIsVisible(target))
  if (!elementIsVisible(target)) 
    scrollToTarget(target);

  // Move to the target
  !dims.first && (dims.first = true) && moveToTarget(target)
  return moveToTarget(target);
}

function getDimensions() {

  const current = service.current

  if(!current){
    return
  }

  // Window
  dims.window = {
    width: els.window[0].innerWidth,
    height: els.window[0].innerHeight
  }

  // Scrollbox
  dims.scroll = {
    width: els.scroll.outerWidth(),
    height: els.scroll.outerHeight(),
    offset: els.scroll.offset(),
    scrollTop: els.scroll[0].scrollTop,
    scrollLeft: els.scroll[0].scrollLeft,
  }

  // Round Offsets
  Object.keys(dims.scroll.offset).forEach((key) => {
    dims.scroll.offset[key] = Math.ceil(dims.scroll.offset[key])
  })

  dims.scroll.height = (dims.scroll.height + dims.scroll.offset.top > dims.window.height) ? dims.window.height : dims.scroll.height
  dims.scroll.width = (dims.scroll.width + dims.scroll.offset.left > dims.window.width) ? dims.window.width : dims.scroll.width
  dims.scroll.offset.toBottom = dims.scroll.height + dims.scroll.offset.top
  dims.scroll.offset.toRight = dims.scroll.width + dims.scroll.offset.left
  dims.scroll.offset.fromBottom = dims.window.height - dims.scroll.offset.top - dims.scroll.height
  dims.scroll.offset.fromRight = dims.window.width - dims.scroll.offset.left - dims.scroll.width

  // Target
  dims.target = {
    width: els.target.outerWidth(),
    height: els.target.outerHeight(),
    offset: els.target.offset()
  }

  // For an html/body scrollbox
  if (current.scrollBox == 'body' || current.scrollBox == 'html') {
    dims.target.offset.top -= dims.scroll.scrollTop
  }

  // Round Offsets
  Object.keys(dims.target.offset).forEach((key) => {
    dims.target.offset[key] = Math.ceil(dims.target.offset[key])
  })

  // Get Target Bottom and right
  dims.target.offset.toBottom = dims.target.offset.top + dims.target.height
  dims.target.offset.toRight = dims.target.offset.left + dims.target.width
  dims.target.offset.fromBottom = dims.window.height - dims.target.offset.top - dims.target.height
  dims.target.offset.fromRight = dims.window.width - dims.target.offset.left - dims.target.width

  // Get Target Margin Points
  dims.target.margins = {
    offset: {
      top: dims.target.offset.top - current.padding,
      left: dims.target.offset.left - current.padding,
      toBottom: dims.target.offset.toBottom + current.padding,
      toRight: dims.target.offset.toRight + current.padding,
      fromBottom: dims.target.offset.fromBottom - current.padding,
      fromRight: dims.target.offset.fromRight - current.padding
    },
    height: dims.target.height + current.padding * 2,
    right: dims.target.offset.fromRight + current.padding * 2
  }
}

function scrollToTarget(target){
  target.scrollIntoView({behavior: 'smooth'})
        }

function elementIsVisible(el){
  let rect = el.getBoundingClientRect();
  let elIsAboveViewport =  rect.bottom < 0
  let elIsBelowViewport = rect.top > window.innerHeight;
  console.log({elIsAboveViewport, elIsBelowViewport})
  return !(elIsAboveViewport || elIsBelowViewport)
}

function findTarget() {
  const target = $(service.current.steps[service.current.index].target)
  els.target = target.length ? target : null
  return els.target[0];
  }

function moveToTarget(target) {
  console.log('Call to moveToTarget with target:', target)
  moveBoxToTarget(target)
  return moveMasksToTarget(target)
}

const template = `
  <div id="Tour" class="hidden">
    <div id="Tour-box-wrap">
      <div id="Tour-box">
        <div id="Tour-tip" class="top center"></div>
        <div id="Tour-step"></div>
        <div id="Tour-length"></div>
        <div id="Tour-close">&#10005</div>
        <div id="Tour-content">
          <div id="Tour-inner-content"></div>
        </div>
        <div id="Tour-actions">
          <button id="Tour-previous"></button>
          <button id="Tour-next"></button>
        </div>
      </div>
    </div>
    <div id="Tour-masks">
      <div class="mask top"></div>
      <div class="mask right"></div>
      <div class="mask bottom"></div>
      <div class="mask left"></div>
      <div class="mask center"></div>
    </div>
    <canvas id="Tour-canvas"></canvas>
  </div>
`

function injectTemplate(){
  const wrap = document.createElement('div')
  document.body.appendChild(wrap)
  wrap.outerHTML = template
}

function cleanup(){
  // Hide the tour element
  els.tour.addClass('hidden')

  els.canvas.css('opacity', null)

  els.masks_wrap.css('pointer-events', null)

  els.previous.off('click', previous)
  els.next.off('click', next)
  els.close.off('click', clickStop)

  els.window.off('keydown', keyDown)
  }

function moveBoxToTarget(target) {
  const {current} = service

  if(!current){
    return
  }

  const currentStep = current.steps[service.current.index]
  const {maxHeight, maxWidth} = current

  // Default Position?
  if (!target) {
    placeCentered()
    return
  }

  const placementOptions = {
    bottom,
    right,
    left,
    top
  }

  let placed = false

  const placement = currentStep.placement || service.current.placement

  console.log({placement})

  placement.forEach(priority => {
    if (!placed) {
      let success = placementOptions[priority]();
      if(success){
        console.log(`Successfully placed at ${priority}`)
      placed = true
    }
    }
  })

  // Fallback: If no placement works then place inside (the only place left to place it)
  if (!placed) {
    console.log('Still not placed... falling back to placeInside()')
    placeInside('bottom', 'center')
  }

  return Promise.resolve(null)

  function bottom() {
    // Can Below?
    if (dims.target.margins.offset.fromBottom > maxHeight) {
      // Can Centered?
      if (dims.target.width > maxWidth) {
        placeVertically('bottom', 'center')
        return true
      }
      // Can on the left?
      if (dims.target.offset.fromRight + dims.target.width > maxWidth) {
        placeVertically('bottom', 'left')
        return true
      }
      // Right, I guess...
      placeVertically('bottom', 'right')
      return true
    }
  }

  function right() {
    // Can Right?
    if (dims.target.margins.offset.fromRight > maxWidth) {
      // Is Element to Large to fit?
      if (dims.target.margins.height > dims.scroll.height) {
        if (dims.target.offset.top > dims.window.height / 2) {
          placeHorizontally('right', 'top')
          return true
        }
        if (dims.target.offset.fromBottom > dims.window.height / 2) {
          placeHorizontally('right', 'bottom')
          return true
        }
        placeHorizontally('right', 'center', true)
        return true
      }
      // Can Center?
      if (dims.target.height > maxHeight) {
        placeHorizontally('right', 'center')
        return true
      }
      // can Top?
      if (dims.target.offset.fromBottom + dims.target.height > maxHeight) {
        placeHorizontally('right', 'top')
        return true
      }
      placeHorizontally('right', 'bottom')
      return true
    }
  }

  function left() {
    // Can Left?
    if (dims.target.margins.offset.left > maxWidth) {
      // Is Element to Large to fit?
      if (dims.target.margins.height > dims.scroll.height) {
        placeHorizontally('left', 'center', true)
        return true
      }
      // can Center?
      if (dims.target.height > maxHeight) {
        placeHorizontally('left', 'center')
        return true
      }
      // can Top?
      if (dims.target.offset.fromBottom + dims.target.height > maxHeight) {
        placeHorizontally('left', 'top')
        return true
      }
      placeHorizontally('left', 'bottom')
      return true
    }
  }

  function top() {
    // Can Above?
    if (dims.target.margins.offset.top > maxHeight) {
      // Can Centered?
      if (dims.target.width > maxWidth) {
        placeVertically('top', 'center')
        return true
      }
      // Can on the left?
      if (dims.target.offset.fromRight + dims.target.width > maxWidth) {
        placeVertically('top', 'left')
        return true
      }
      // Right, I guess...
      placeVertically('top', 'right')
      return true
    }
  }

  // Placement functions
  function placeVertically(v, h) {
    let top, left, translateX, translateY, tipY

    if (v == 'top') {
      top = dims.target.margins.offset.top - (current.padding * 2)
      tipY = 'bottom'
      translateY = '-100%'
    } else {
      top = dims.target.margins.offset.toBottom + (current.padding * 2)
      tipY = 'top'
      translateY = '0'
    }

    if (h == 'right') {
      left = dims.target.offset.toRight + current.padding
      translateX = '-100%'
    } else if (h == 'center') {
      left = dims.target.offset.left + (dims.target.width / 2)
      translateX = '-50%'
    } else {
      left = dims.target.offset.left - current.padding
      translateX = '0'
    }

    els.wrap.css({
      left: left + 'px',
      top: top + 'px',
      transform: 'translate(' + translateX + ',' + translateY + ')'
    })

    els.tip.attr('class', 'vertical ' + tipY + ' ' + h)
  }

  function placeHorizontally(h, v, fixed) {
    let top, left, translateX, translateY, tipX

    if (h == 'right') {
      left = dims.target.margins.offset.toRight + (current.padding * 2)
      tipX = 'left'
      translateX = '0'
    } else {
      left = dims.target.margins.offset.left - (current.padding * 2)
      tipX = 'right'
      translateX = '-100%'
    }

    if (fixed) {
      top = dims.window.height / 2
      translateY = '-50%'
    } else if (v == 'top') {
      top = dims.target.offset.top
      translateY = '0'
    } else if (v == 'center') {
      top = dims.target.offset.top + dims.target.height / 2
      translateY = '-50%'
    } else {
      top = dims.target.offset.toBottom
      translateY = '-100%'
    }

    els.wrap.css({
      left: left + 'px',
      top: top + 'px',
      transform: 'translate(' + translateX + ',' + translateY + ')'
    })

    els.tip.attr('class', 'horizontal ' + tipX + ' ' + v)

  }

  function placeInside(v, h) {
    let top, left, translateY, translateX

    if (v == 'top') {
      top = dims.target.margins.offset.top < dims.scroll.offset.top ? service.current.margin : dims.target.offset.top
      translateY = '0'
    } else {
      top = dims.target.margins.offset.toBottom > dims.scroll.offset.toBottom ? dims.scroll.offset.toBottom - service.current.margin : dims.target.offset.toBottom
      translateY = '-100%'
    }

    if (h == 'right') {
      left = dims.target.offset.left + dims.target.width
      translateX = '-100%'
    } else if (h == 'center') {
      left = dims.target.offset.left + dims.target.width / 2
      translateX = '-50%'
    } else {
      left = dims.target.offset.left
      translateX = '0'
    }

    els.wrap.css({
      left: left + 'px',
      top: top + 'px',
      transform: 'translate(' + translateX + ',' + translateY + ')'
    })

    els.tip.attr('class', 'hidden')
  }

  function placeCentered() {
    els.wrap.css({
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      margin: '0'
    })
    els.tip.attr('class', 'hidden')

  }
}

function moveMasksToTarget(target) {

  if(!service.current){
    return
  }

  const padding = service.current.padding || 0

  if (!els.target) {
    els.masks_top.css({
      height: service.current.maskVisibleOnNoTarget ? '100%' : '0px'
    })
    els.masks_bottom.css({
      height: '0px'
    })
    els.masks_left.css({
      top: '0px',
      height: '100%',
      width: '0px'
    })
    els.masks_right.css({
      top: '0px',
      height: '100%',
      width: '0px'
    })
  } else{

    els.masks_top.css({
      height: dims.target.offset.top + 'px',
      top: dims.target.offset.top < 0 ? dims.target.offset.top + 'px' : 0
    })


    let targetRect = target.getBoundingClientRect();
    let bodyRect = document.body.getBoundingClientRect();

    let topOffset = targetRect.top + targetRect.height - bodyRect.y;
    let height = bodyRect.height - topOffset;

    // let amtFromTargetToBottom = bodyRect.height
    els.masks_bottom.css({
      height: height + 'px',
      top: topOffset + 'px',
      bottom: 'initial'
    })
    els.masks_left.css({
      top: dims.target.offset.top + 'px',
      height: dims.target.height + 'px',
      width: dims.target.offset.left + 'px'
    })
    els.masks_right.css({
      top: dims.target.offset.top + 'px',
      height: dims.target.height + 'px',
      width: dims.target.offset.fromRight + 'px'
    })

    if (service.current.disableInteraction) {
      els.masks_center.css({
        height: dims.target.height + (2 * padding) + 'px',
        top: dims.target.offset.top - padding + 'px',
        left: dims.target.offset.left - padding + 'px',
        right: dims.target.offset.fromRight - padding + 'px',
        backgroundColor: 'transparent'
      })
    }
  }

  if(!service.current.maskVisible){
    els.canvas.css({
      opacity: 0
    })
    return
  }
  els.canvas.css({
    opacity: 1
  })

  els.canvas[0].width = dims.window.width * els.pixelRatio
  els.canvas[0].height = dims.window.height * els.pixelRatio

  els.canvas.css({
    width: dims.window.width + 'px',
    height: dims.window.height + 'px'
  })

  els.pixelRatio = window.devicePixelRatio || 1
  if (els.pixelRatio !== 1) {
    els.ctx.scale(els.pixelRatio, els.pixelRatio)
  }

  els.ctx.fillStyle = service.current.maskColor

  const left = dims.target.offset.left - padding
  const top = dims.target.offset.top - padding
  const right = dims.target.offset.toRight + padding
  const bottom = dims.target.offset.toBottom + padding

  return new Promise((resolve, reject) => {
    TA.animate(0, 1, service.current.animationDuration, (d) => {
     //   els.ctx.clearRect(0, 0, dims.window.width, dims.window.height)

        dims.canvas.left = dims.canvas.left + ((left - dims.canvas.left) * d)
        dims.canvas.top = dims.canvas.top + ((top - dims.canvas.top) * d)
        dims.canvas.right = dims.canvas.right + ((right - dims.canvas.right) * d)
        dims.canvas.bottom = dims.canvas.bottom + ((bottom - dims.canvas.bottom) * d)

       // drawEmptyRoundedRectangle(els.ctx, dims.canvas.left, dims.canvas.top, dims.canvas.right, dims.canvas.bottom, 5)
        //els.ctx.fill()
      }, 'easeOutQuad', () => {
        resolve()
      }
    )
  })
}


// ########################################################################
// Event Handlers
// ########################################################################

function clickStop() {
  if (service.current.canExit) {
    stop()
  }
}

function keyDown(e) {
  switch (e.which) {
    case 37:
      previous()
      prevent(e)
      return
    case 39:
      next()
      prevent(e)
      return
    case 27:
      if (!service.current.disableEscExit) {
        stop()
        prevent(e)
        return
      }
    case 38:
    case 40:
      onWindowScroll()
      return
  }
}


// ########################################################################
// Canvas Utils
// ########################################################################

function drawEmptyRoundedRectangle (ctx, x, y, x2, y2, radius = 0) {

	ctx.beginPath()
  ctx.moveTo(dims.window.width / 2, 0)
  ctx.lineTo(0, 0)
  ctx.lineTo(0, dims.window.height)
  ctx.lineTo(dims.window.width, dims.window.height)
  ctx.lineTo(dims.window.width, 0)
  ctx.lineTo(dims.window.width / 2, 0)

  ctx.lineTo(dims.window.width / 2, y)
  ctx.lineTo(x2 - radius, y)
  ctx.quadraticCurveTo(x2, y, x2, y + radius)
  ctx.lineTo(x2, y2 - radius)
  ctx.quadraticCurveTo(x2, y2, x2 - radius, y2)
  ctx.lineTo(x + radius, y2)
  ctx.quadraticCurveTo(x, y2, x, y2 - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.lineTo(dims.window.width / 2, y)
  ctx.closePath()

}



// ########################################################################
// Utils
// ########################################################################


function validPriorities(priorities){
  for (let i = 0; i < priorities.length; i += 1) {
    if (defaults.placement.indexOf(priorities[i]) === -1) {
      return false
    }
  }
  return true
}

function stepExists(i){
  return (i >= 0) && i < (service.current.steps.length)
}