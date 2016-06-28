# Tour

[![Join the chat at https://gitter.im/tourjs/tour](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/tourjs/tour?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
A simple, minimalist touring and on-boarding library for javascript

## [Awesome Demo](http://tourjs.github.io/tour)

## Features

* Supports single page apps, and complex scrollable content
*	Responsive & Intelligent
*	Automagic Positioning
*	Promise Driven Events & Hooks
*	Tour does not manipulate or relayer your DOM elements in any way

## Installation

```
$ npm install nz-tour --save
```

```javascript
import tour from 'tour'
```

## Simple Usage

```javascript
const myTour = {
	config: {} // see config
    steps: [{
      target: '#first-element',
      content: 'This is the first step!',
    }, {
      target: '.some .other .element',
      placementPriority: [ 'right', 'top', 'bottom', 'left' ],
      content: 'Blah blah blah. I prefer to show up on the right.',
    }, {
      target: '#menu-element',
      content: 'I guess this is a menu!',
    }, {
      target: '#last-element',
      content: 'It is over! :(',
    }]
};

tour.start(myTour)
  .then(function() {
      console.log('Tour Finished!');
  })
  .catch(function() {
      console.log('Tour Interrupted!')
  });

```

## Config

Defaults:
```javascript
{
  maskVisible: true, // Shows the element mask
  maskVisibleOnNoTarget: false, // Shows a full page mask if no target element has been specified
  maskClickThrough: false, // Allows the user to interact with elements beneath the mask
  maskClickExit: false, // Exit the tour when the user clicks on the mask
  maskScrollThrough: true // Allows the user to scroll the scrollbox or window through the mask
  maskColor: 'rgba(0,0,0,.7)' // The mask color
  scrollBox: 'body', // The container to scroll when searching for elements
  previousText: 'Previous',
  nextText: 'Next',
  finishText: 'Finish',
  showPrevious: true, // Setting to false hides the previous button
  showNext: true // Setting to false hides the next button
  animationDuration: 400, // Animation Duration for the box and mask
  placementPriority: ['bottom', 'right', 'top','left'],
  dark: false, // Dark mode (Works great with `mask.visible = false`)
  disableInteraction: false, // Disable interaction with the highlighted elements
  highlightMargin: 0, // Margin of the highglighted area
  disableEscExit: false // Disable end of tour when pressing ESC,
  onClose: function() {} //Function called when the tour is closed
  onComplete: function() {} //Function called when the tour is completed
}
```

## Shortcut Keys

*   Left/Right Arrow keys - Previous/Next
*   Esc - Abort the tour
*   1-9 - Goto step 1-9

## API

#### .start(tour)
- Starts a Tour
- Params:
  *	*tour*: Tour Object

- Returns:
  *	Promise that resolves when the tour is finished and rejected when aborted.

#### .stop()
- Stops a Tour
- Returns:
  *	Promise that resolves when the tour is stopped.

#### .pause()
- Pauses a Tour
- Returns:
  *	Promise that resolves when the tour is paused and hidden.

#### .next()
- Goes to the next step in the current tour
- Returns:
  *	Promise that resolves when the next step is reached

#### .previous()
- Goes to the previous step in the current tour
  *	Promise that resolves when the previous step is reached

#### .goto(step)
- Goes to a specific step in the tour
- Params:
  *	*step*: The number of the step starting at 1,2,3...

- Returns:
  *	Promise that resolves when the specific step is reached


## Using Promise Event Hooks
You can pass any function that returns a promise to the `before` and `after` events for any step.  When the promise resolves, the tour moves on accordingly.

#### Example
```javascript
var tour = {
	steps: [{
      target: '#first-element',
      content: 'This is the first step!',
    }, {
      target: '.some .other .element',
      content: 'Blah blah blah.',
      showPrevious: false,
      before: () => {
      	// Do something amazing
      	return new Promise()
    	}
    }, {
      target: '#menu-element',
      content: 'I guess this is a menu!',
      after: () => {
      	// Do some more cool stuff
      	return new Promise()
    	}
    }, {
      target: '#last-element',
      content: 'It is over! :(',
    }]
}
```


## Roadmap & Contributing

All PR's and contributions are more than welcome!
