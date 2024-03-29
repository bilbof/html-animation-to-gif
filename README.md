# HTML / CSS animations to GIF

Demonstrates the procedure for converting an animated HTML Element to an animated GIF.

This process works for HTML elements animated with CSS (keyframes, transformations) or Javascript.

## Process

1. Animate an HTML Element
2. At each frame
    a. Convert DOM element to PNG
    b. Write PNG to Canvas
    c. Encode canvas as GIF

## Status

This is demo code. Look at `index.html` and `gifmaker.js` for the entry points.

The hard work of processing is done by the dom-to-image and jsgif libraries.