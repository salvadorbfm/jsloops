# JSLoops
JSLoops is a simple handler for generating audio loops with "live programming". This project is intended to work just in the browser and for now doesn't have any real purpose that just having fun. This work is based on the great project [liv3c0der](https://github.com/halfbyte/liv3c0der/).

## Workflow
* User writes the code music
* User press CMD+Enter or CTR+Enter for starting or reloading the pattern function
* JSLoops validates the pattern function
* JSLoops handles the pattern function in 16 steps

## Components
**JSLoopsHandler:**
Global component that handles user events, code editor configuration, live reload code and JSLoopsEngine initialization.

**JSLoopsEngine:** Global component responsible for handling all the sound beats and effects.

## Dependencies
* [CodeMirror](https://github.com/codemirror/codemirror)
<!-- * [Tuna](https://github.com/Theodeus/tuna) -->

## How to run it
* `npm install`
* `gulp serve`
------------------------------
`@salvadorbfm`
