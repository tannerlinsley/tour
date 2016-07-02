# Tour

A simple, minimalist touring and on-boarding library for javascript

[![](https://avatars0.githubusercontent.com/u/20192755?v=3&s=500)](http://tourjs.github.io/tour)

[![Join the chat at https://gitter.im/tourjs/tour](https://badges.gitter.im/tourjs/tour.svg)](https://gitter.im/tourjs/tour?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## [Awesome Demo](http://tourjs.github.io/tour)

## Features

* Supports single page apps, and complex scrollable content
*	Responsive & Intelligent
*	Automagic Positioning
*	Promise Driven Events & Hooks
*	Tour does not manipulate or relayer your DOM elements in any way

## Installation

Install via npm
```bash
$ npm install tour --save
```
or CDN

https://npmcdn.com/tour@latest/dist/tour.js
https://npmcdn.com/tour@latest/dist/tour.css

Import JS and CSS
```javascript
// ES6+
import Tour from 'tour'

// CommonJS
const Tour = require('tour').default
```
```css
@import 'node_modules/tour/dist/tour.css'
```



## Simple Usage

```javascript
const myTour = {
	canExit: true,
	nextText: 'Proceed!',
	steps: [{
		target: '#first-element',
		content: 'This is the first step!',
	}, {
		target: '.some .other .element',
		content: 'Blah blah blah. I prefer to show up on the right.',
		placement: [ 'right', 'top', 'bottom', 'left' ],
	}, {
		target: '#menu-element',
		content: 'I guess this is a menu!',
	}, {
		target: '#last-element',
		content: 'It is over! :(',
	}],
};

Tour.start(myTour)
  .then(() => {
    console.log('Tour Finished!');
  })
  .catch(() => {
    console.log('Tour Interrupted!')
  });

```

## Config

Defaults:
```javascript
{
	canExit: false, // Can exit the tour or not (via an X button)
	padding: 5, // Padding around the highlighted element
	maxHeight: 120, // Max height of the tooltip box
	maxWidth: 250, // Max width of the tooltip box
	maskVisible: true, // Shows the mask
	maskVisibleOnNoTarget: false, // Shows a full page mask if no target element has been specified
	maskClickThrough: false, // Allows the user to interact with elements beneath the mask
	maskScrollThrough: true // Allows the user to scroll the scrollbox or window through the mask
	maskColor: 'rgba(0,0,0,.7)' // The mask color
	scrollBox: 'body', // The container to scroll when searching for elements
	previousText: 'Previous',
	nextText: 'Next',
	finishText: 'Finish',
	showPrevious: true, // Setting to false hides the previous button
	showNext: true // Setting to false hides the next button
	animationDuration: 400, // Animation Duration for the box and mask
	placement: ['bottom', 'right', 'top','left'],
	dark: false, // Dark mode (Works great with `mask.visible = false`)
	disableInteraction: false, // Disable interaction with the highlighted elements
	disableEscExit: false // Disable end of tour when pressing ESC,
}
```

## API

#### .start(tour)
- Starts a Tour
- Params:
  *	*tour*: Tour Object
- Returns:
  *	Promise that resolves when the tour is finished or rejected when aborted.

#### .stop()
- Stops a Tour
- Returns:
  *	Promise that resolves when the tour is stopped.

#### .next()
- Goes to the next step in the current tour
- Returns:
  *	Promise that resolves when the next step is reached

#### .previous()
- Goes to the previous step in the current tour
  *	Promise that resolves when the previous step is reached

#### .goto(index)
- Goes to a specific step in the tour
- Params:
  *	*index*: The 0-index number of the step eg. `0, 1, 2, 3`

- Returns:
  *	Promise that resolves when the specific step is reached


## Using Promise Event Hooks
You can pass any function that returns a promise to the `before` and `after` properties for any step.  When the promise resolves, the tour moves on accordingly.

#### Example
```javascript
var tour = {
	steps: [{
      target: '#first-element',
      content: 'This is the first step!',
    }, {
      target: '.some .other .element',
      content: 'Blah blah blah.',
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
