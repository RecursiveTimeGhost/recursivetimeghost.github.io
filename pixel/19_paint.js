/*
## WHAT
The 19_paint.js file contains the core functionality for an interactive pixel art editor with basic drawing tools, color selection, and file management capabilities.

## HOW
* Defines a Picture class to represent the pixel art canvas.
* Implements various UI components like PictureCanvas, PixelEditor, ToolSelect, and ColorSelect.
* Provides drawing tools such as draw, rectangle, fill, and pick.
* Includes functionality for saving and loading pictures.
* Implements an undo feature with UndoButton and historyUpdateState.
* Sets up the initial state and configuration for the pixel editor.
* Provides utility functions for creating DOM elements and handling mouse/touch events.
* Implements the main startPixelEditor function to initialize and run the editor.
*/

/**
 * Represents a picture as a 2D grid of pixels.
 *
 * @class Picture
 * @param {number} width - The width of the picture in pixels.
 * @param {number} height - The height of the picture in pixels.
 * @param {string[]} pixels - An array of pixel colors, one for each pixel in the picture.
 */
var Picture = class Picture
  {
  constructor(width, height, pixels)
    {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
    }
  static empty(width, height, color)
    {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
    }
  pixel(x, y)
    {
    return this.pixels[x + y * this.width];
    }
  draw(pixels)
    {
    let copy = this.pixels.slice();
    for (let {x, y, color} of pixels) copy[x + y * this.width] = color;
    return new Picture(this.width, this.height, copy);
    }
  }

/**
 * Merges the properties of the `action` object into the `state` object, creating a new object.
 * This function is a utility for updating the state of an application in a functional, immutable way.
 *
 * @param {Object} state - The current state object.
 * @param {Object} action - The action object containing the properties to merge into the state.
 * @returns {Object} - A new state object with the merged properties.
 */
function updateState(state, action)
  {
  return {...state, ...action};
  }

/**
 * Creates a new DOM element of the specified type, with the given properties and child elements.
 *
 * @param {string} type - The type of DOM element to create (e.g. 'div', 'button', etc.).
 * @param {Object} [props] - An object containing properties to assign to the created DOM element.
 * @param {...(string|Node)} children - The child elements to append to the created DOM element. Can be strings (which will be converted to text nodes) or other DOM nodes.
 * @returns {Node} - The created DOM element.
 */
function elt(type, props, ...children)
  {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children)
    {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
    }
  return dom;
  }

/**
 * The scale factor used to draw the picture on the canvas.
 */
var scale = 10;

/**
 * Represents a canvas that displays a picture and allows user interaction with the picture.
 *
 * The `PictureCanvas` class provides a way to display a `Picture` object on a canvas element and handle user input events, such as mouse and touch events, to interact with the picture.
 *
 * The constructor takes a `Picture` object and a callback function `pointerDown` that is called when the user interacts with the picture. The `syncState` method is used to update the canvas when the picture changes.
 */
var PictureCanvas = class PictureCanvas
  {
  constructor(picture, pointerDown)
    {
    this.dom = elt("canvas",
      {
      onmousedown: event => this.mouse(event, pointerDown),
      ontouchstart: event => this.touch(event, pointerDown)
      });
    this.syncState(picture);
    }
  syncState(picture)
    {
    if (this.picture == picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
    }
  }

/**
 * Draws a picture on the given canvas element, scaling it by the provided scale factor.
 *
 * @param {Picture} picture - The picture to be drawn.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw the picture on.
 * @param {number} scale - The scale factor to use when drawing the picture.
 */
function drawPicture(picture, canvas, scale)
  {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext("2d");

  for (let y = 0; y < picture.height; y++)
  for (let x = 0; x < picture.width; x++)
    {
    cx.fillStyle = picture.pixel(x, y);
    cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

/**
 * Handles mouse down events on the canvas and sets up event listeners to track mouse movement and release.
 *
 * When the user presses the left mouse button on the canvas, this method calculates the position of the pointer relative to the canvas, calls the provided `onDown` callback with the pointer position, and sets up event listeners to track mouse movement and release.
 *
 * If the `onDown` callback returns a function, that function is used as the `onMove` callback to handle subsequent mouse movement events. The `onMove` callback is called with the updated pointer position as the canvas is moved.
 *
 * When the user releases the mouse button, the event listeners are removed.
 *
 * @param {MouseEvent} downEvent - The mouse down event object.
 * @param {function(Object): function(Object)} onDown - A callback function that is called with the initial pointer position. If the callback returns a function, that function is used as the `onMove` callback.
 */
PictureCanvas.prototype.mouse = function(downEvent, onDown)
  {
  if (downEvent.button != 0) return;
  let pos = pointerPosition(downEvent, this.dom);
  let onMove = onDown(pos);
  if (!onMove) return;

  let move = moveEvent =>
    {
    if (moveEvent.buttons == 0) this.dom.removeEventListener("mousemove", move);
    else
      {
      let newPos = pointerPosition(moveEvent, this.dom);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);
      }
    };

  this.dom.addEventListener("mousemove", move);
  };

/**
 * Calculates the position of a pointer (e.g. mouse or touch) relative to a DOM node.
 *
 * Given the position of a pointer event and the DOM node it occurred on, this function
 * calculates the position of the pointer within the node, taking into account the node's
 * position and scale factor.
 *
 * @param {Object} pos - The position object from the pointer event, containing `clientX` and `clientY` properties.
 * @param {HTMLElement} domNode - The DOM node the pointer event occurred on.
 * @returns {Object} An object with `x` and `y` properties representing the pointer position within the node.
 */
function pointerPosition(pos, domNode)
  {
  let rect = domNode.getBoundingClientRect();
  return {x: Math.floor((pos.clientX - rect.left) / scale), y: Math.floor((pos.clientY - rect.top) / scale)};
  }

/**
 * Handles touch events on the canvas and sets up event listeners to track touch movement and release.
 *
 * When the user touches the canvas, this method calculates the position of the touch relative to the canvas, calls the provided `onDown` callback with the touch position, and sets up event listeners to track touch movement and release.
 *
 * If the `onDown` callback returns a function, that function is used as the `onMove` callback to handle subsequent touch movement events. The `onMove` callback is called with the updated touch position as the canvas is moved.
 *
 * When the user releases the touch, the event listeners are removed.
 *
 * @param {TouchEvent} startEvent - The touch start event object.
 * @param {function(Object): function(Object)} onDown - A callback function that is called with the initial touch position. If the callback returns a function, that function is used as the `onMove` callback.
 */
PictureCanvas.prototype.touch = function(startEvent, onDown)
  {
  let pos = pointerPosition(startEvent.touches[0], this.dom);
  let onMove = onDown(pos);
  startEvent.preventDefault();
  if (!onMove) return;

  let move = moveEvent =>
    {
    let newPos = pointerPosition(moveEvent.touches[0], this.dom);
    if (newPos.x == pos.x && newPos.y == pos.y) return;
    pos = newPos;
    onMove(newPos);
    };

  let end = () =>
    {
    this.dom.removeEventListener("touchmove", move);
    this.dom.removeEventListener("touchend", end);
    };

  this.dom.addEventListener("touchmove", move);
  this.dom.addEventListener("touchend", end);
  };

/**
 * Represents a pixel editor application that manages the state of a picture and provides tools and controls for editing it.
 *
 * The `PixelEditor` class is responsible for creating and managing the main components of the pixel editor, including the canvas for displaying the picture, and the various controls for interacting with the editor.
 *
 * The constructor takes an initial state object and a configuration object that provides the necessary dependencies, such as the available tools, controls, and a dispatch function for updating the state.
 *
 * The `syncState` method is used to update the state of the pixel editor and synchronize the state of its components.
 */
var PixelEditor = class PixelEditor
  {
  constructor(state, config)
    {
    let {tools, controls, dispatch} = config;
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, pos =>
      {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) return pos => onMove(pos, this.state);
      });
    this.controls = controls.map(Control => new Control(state, config));
    this.dom = elt("div", {}, this.canvas.dom, elt("br"), ...this.controls.reduce((a, c) => a.concat(" ", c.dom), []));
    }
  syncState(state)
    {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
    }
  }

/**
 * Represents a tool selection component for a pixel editor application.
 *
 * The `ToolSelect` class is responsible for creating and managing a dropdown
 * menu that allows the user to select the current tool to use in the pixel
 * editor. The selected tool is dispatched to the application state.
 *
 * The constructor takes the current application state and a configuration object
 * that provides the available tools and a dispatch function for updating the
 * state.
 *
 * The `syncState` method is used to update the selected tool in the dropdown
 * menu to match the current state of the application.
 */
var ToolSelect = class ToolSelect
  {
  constructor(state, {tools, dispatch})
    {
    this.select = elt("select", {class: "form-control", onchange: () => dispatch({tool: this.select.value})}, ...Object.keys(tools).map(name => elt("option", {selected: name == state.tool}, name)));
    this.dom = elt("label", null, "🖌 Tool: ", this.select);
    }

  syncState(state) {this.select.value = state.tool;}
  }

/**
 * Represents a color selection component for a pixel editor application.
 *
 * The `ColorSelect` class is responsible for creating and managing an input
 * field that allows the user to select the current color to use in the pixel
 * editor. The selected color is dispatched to the application state.
 *
 * The constructor takes the current application state and a configuration object
 * that provides a dispatch function for updating the state.
 *
 * The `syncState` method is used to update the selected color in the input
 * field to match the current state of the application.
 */
var ColorSelect = class ColorSelect
  {
  constructor(state, {dispatch})
    {
    this.input = elt("input", {class: "form-control", type: "color", value: state.color, onchange: () => dispatch({color: this.input.value}) });
    this.dom = elt("label", null, "Color: ", this.input);
    }

  syncState(state)
    {
    this.input.value = state.color;
    }
  }

/**
 * Draws a single pixel on the canvas at the given position using the current color from the application state.
 *
 * @param {Object} pos - The position of the pixel to draw.
 * @param {number} pos.x - The x-coordinate of the pixel.
 * @param {number} pos.y - The y-coordinate of the pixel.
 * @param {Object} state - The current application state.
 * @param {function} dispatch - A function to dispatch updates to the application state.
 * @returns {function} A function that can be used to draw a single pixel.
 */
function draw(pos, state, dispatch)
  {
  function drawPixel({x, y}, state)
    {
    let drawn = {x, y, color: state.color};
    dispatch({picture: state.picture.draw([drawn])});
    }

  drawPixel(pos, state);

  return drawPixel;
  }

/**
 * Draws a rectangle on the canvas using the current color from the application state.
 *
 * The `rectangle` function takes the starting position of the rectangle, the current application state, and a dispatch function to update the state. It returns a function that can be used to draw the rectangle.
 *
 * The returned function, `drawRectangle`, takes the current mouse position and draws a rectangle from the starting position to the current position, using the current color from the application state. It then dispatches an update to the application state to draw the rectangle on the canvas.
 *
 * @param {Object} start - The starting position of the rectangle.
 * @param {number} start.x - The x-coordinate of the starting position.
 * @param {number} start.y - The y-coordinate of the starting position.
 * @param {Object} state - The current application state.
 * @param {function} dispatch - A function to dispatch updates to the application state.
 * @returns {function} A function that can be used to draw a rectangle.
 */
function rectangle(start, state, dispatch)
  {
  function drawRectangle(pos)
    {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++)
    for (let x = xStart; x <= xEnd; x++)
    drawn.push({x, y, color: state.color});

    dispatch({picture: state.picture.draw(drawn)});
    }

  drawRectangle(start);

  return drawRectangle;
  }

/**
 * An array of offsets representing the four cardinal directions: up, down, left, and right.
 * Each object in the array has `dx` and `dy` properties that can be used to offset a coordinate
 * by one unit in the corresponding direction.
 */
var around = [{dx: -1, dy: 0}, {dx: 1, dy: 0}, {dx: 0, dy: -1}, {dx: 0, dy: 1}];

/**
 * Fills a connected region of pixels on the canvas with the current color from the application state.
 *
 * The `fill` function takes the starting position of the fill, the current application state, and a dispatch function to update the state. It then recursively fills all connected pixels of the same color as the starting pixel, replacing them with the current color.
 *
 * The function first identifies the target color of the starting pixel, and adds the starting pixel to the list of pixels to be drawn. It then iterates through the four cardinal directions (up, down, left, right) and checks if the adjacent pixels are the same color as the target color and have not been visited yet. If so, it adds those pixels to the list of pixels to be drawn.
 *
 * Once all connected pixels have been identified, the function dispatches an update to the application state to draw the filled region on the canvas.
 *
 * @param {Object} pos - The starting position of the fill.
 * @param {number} pos.x - The x-coordinate of the starting position.
 * @param {number} pos.y - The y-coordinate of the starting position.
 * @param {Object} state - The current application state.
 * @param {function} dispatch - A function to dispatch updates to the application state.
 */
function fill({x, y}, state, dispatch)
  {
  let targetColor = state.picture.pixel(x, y);
  let drawn = [{x, y, color: state.color}];
  let visited = new Set();

  for (let done = 0; done < drawn.length; done++)
  for (let {dx, dy} of around)
    {
    let x = drawn[done].x + dx, y = drawn[done].y + dy;
    if (x >= 0 && x < state.picture.width && y >= 0 && y < state.picture.height && !visited.has(x + "," + y) && state.picture.pixel(x, y) == targetColor)
      {
      drawn.push({x, y, color: state.color});
      visited.add(x + "," + y);
      }
    }

  dispatch({picture: state.picture.draw(drawn)});
  }

/**
 * Sets the current color in the application state to the color of the pixel at the given position.
 *
 * @param {Object} pos - The position of the pixel to pick the color from.
 * @param {number} pos.x - The x-coordinate of the pixel.
 * @param {number} pos.y - The y-coordinate of the pixel.
 * @param {Object} state - The current application state.
 * @param {function} dispatch - A function to dispatch updates to the application state.
 */
function pick(pos, state, dispatch)
  {
  dispatch({color: state.picture.pixel(pos.x, pos.y)});
  }

/**
 * A button component that allows the user to save the current picture as a PNG image.
 *
 * The `SaveButton` class has a constructor that takes the current application state and creates a button element with an `onclick` event handler that calls the `save()` method. The `save()` method creates a canvas element, draws the current picture on it, creates a download link for the canvas, appends it to the document, clicks the link, and then removes the link. The `syncState()` method updates the internal `picture` property when the application state changes.
 */
var SaveButton = class SaveButton
  {
  constructor(state)
    {
    this.picture = state.picture;
    this.dom = elt("button", {class: "btn btn-dark", onclick: () => this.save()}, "Save");
    }

  save()
    {
    let canvas = elt("canvas");
    drawPicture(this.picture, canvas, 1);
    let link = elt("a", {href: canvas.toDataURL(), download: "pixelart.png"});
    document.body.appendChild(link);
    link.click();
    link.remove();
    }

  syncState(state) { this.picture = state.picture; }
  }

/**
 * A button component that allows the user to load a picture from a file.
 *
 * The `LoadButton` class has a constructor that takes the current application state and creates a button element with an `onclick` event handler that calls the `startLoad()` function to open a file dialog and load the selected file. The `syncState()` method is empty, as this component does not need to update its state when the application state changes.
 */
var LoadButton = class LoadButton
  {
  constructor(_, {dispatch})
    {
    this.dom = elt("button", {class: "btn btn-dark", onclick: () => startLoad(dispatch) }, "Load");
    }
  syncState() {}
  }

/**
 * Starts the process of loading a picture from a file.
 *
 * This function creates an input element of type "file", sets its `onchange` event handler to call `finishLoad()` with the selected file, appends the input element to the document body, clicks the input to open the file dialog, and then removes the input element from the document.
 *
 * @param {function} dispatch - A function to dispatch updates to the application state.
 */
function startLoad(dispatch)
  {
  let input = elt("input", {type: "file", onchange: () => finishLoad(input.files[0], dispatch)});
  document.body.appendChild(input);
  input.click();
  input.remove();
  }

/**
 * Finishes the process of loading a picture from a file.
 *
 * This function is called when a file has been selected in the file dialog opened by the `startLoad()` function. It creates a new `FileReader` object, sets its `onload` event handler to create an `img` element with the loaded image data, and then dispatches an action to update the application state with the new picture.
 *
 * @param {File} file - The file selected by the user.
 * @param {function} dispatch - A function to dispatch updates to the application state.
 */
function finishLoad(file, dispatch)
  {
  if (file == null) return;
  let reader = new FileReader();
  reader.addEventListener("load", () =>
    {
    let image = elt("img",
      {
      onload: () => dispatch({picture: pictureFromImage(image)}),
      src: reader.result
      });
    });
  reader.readAsDataURL(file);
  }

/**
 * Creates a new `Picture` object from an `img` element.
 *
 * This function takes an `img` element, scales it down to a maximum size of 100x100 pixels, and then extracts the pixel data from the image. It creates a new `Picture` object with the scaled dimensions and the extracted pixel data.
 *
 * @param {HTMLImageElement} image - The `img` element to convert to a `Picture`.
 * @returns {Picture} - A new `Picture` object with the scaled image data.
 */
function pictureFromImage(image)
  {
  let width = Math.min(100, image.width);
  let height = Math.min(100, image.height);
  let canvas = elt("canvas", {width, height});
  let cx = canvas.getContext("2d"); cx.drawImage(image, 0, 0);
  let pixels = [];
  let {data} = cx.getImageData(0, 0, width, height);
  const hex = (n) => n.toString(16).padStart(2, "0");

  for (let i = 0; i < data.length; i += 4)
    {
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push("#" + hex(r) + hex(g) + hex(b));
    }

  return new Picture(width, height, pixels);
  }

/**
 * Updates the application state based on the provided action.
 *
 * This function handles two types of actions:
 * 1. Undo action: If the action has an `undo` property set to `true`, the function restores the previous state from the `done` array and updates the `doneAt` timestamp.
 * 2. Picture update action: If the action has a `picture` property, the function updates the current state with the new picture and adds the previous state to the `done` array, updating the `doneAt` timestamp.
 * For any other actions, the function simply merges the action properties into the current state.
 *
 * @param {Object} state - The current application state.
 * @param {Object} action - The action to apply to the state.
 * @returns {Object} - The updated application state.
 */
function historyUpdateState(state, action)
  {
  if (action.undo == true)
    {
    if (state.done.length == 0) return state;
    return {...state, picture: state.done[0], done: state.done.slice(1), doneAt: 0};
    }
  else if (action.picture && state.doneAt < Date.now() - 1000)
    {
    return {...state, ...action, done: [state.picture, ...state.done], doneAt: Date.now()};
    }
  else
    {
    return {...state, ...action};
    }
  }

/**
 * A button component that allows the user to undo the previous action in the pixel editor.
 * The button is disabled when there are no previous actions to undo.
 */
var UndoButton = class UndoButton
  {
  constructor(state, {dispatch})
    {
    this.dom = elt("button", {class: "btn", onclick: () => dispatch({undo: true}), disabled: state.done.length == 0 }, "Undo");
    }
  syncState(state)
    {
    this.dom.disabled = state.done.length == 0;
    }
  }

/**
 * The initial state of the pixel editor application.
 *
 * @property {string} tool - The currently selected tool, e.g. "draw", "fill", "rectangle", "pick".
 * @property {string} color - The currently selected color, represented as a hexadecimal color code.
 * @property {Picture} picture - The initial picture, represented as a `Picture` object with a specified width, height, and background color.
 * @property {Picture[]} done - An array of previous `Picture` states, used for the undo functionality.
 * @property {number} doneAt - The timestamp of the last action that modified the picture, used for the undo functionality.
 */
var startState =
  {
  tool: "draw",
  color: "#000000",
  picture: Picture.empty(60, 30, "#f0f0f0"),
  done: [],
  doneAt: 0
  };

/**
 * An object containing the base set of tools for the pixel editor application.
 * The tools are:
 * - `draw`: A tool for drawing individual pixels on the canvas.
 * - `fill`: A tool for filling a region of the canvas with a specified color.
 * - `rectangle`: A tool for drawing a rectangle on the canvas.
 * - `pick`: A tool for selecting a color from the canvas.
 */
var baseTools = {draw, fill, rectangle, pick};
/**
 * An array of base controls for the pixel editor application. The controls are:
 * - `ToolSelect`: A control for selecting the current tool.
 * - `ColorSelect`: A control for selecting the current color.
 * - `SaveButton`: A control for saving the current picture.
 * - `LoadButton`: A control for loading a picture.
 * - `UndoButton`: A control for undoing the previous action.
 */
var baseControls = [ToolSelect, ColorSelect, SaveButton, LoadButton, UndoButton];

/**
 * Starts the pixel editor application with the given state, tools, and controls.
 *
 * @param {Object} [options] - The options for starting the pixel editor.
 * @param {Object} [options.state=startState] - The initial state of the pixel editor.
 * @param {Object} [options.tools=baseTools] - The tools available in the pixel editor.
 * @param {Array} [options.controls=baseControls] - The controls available in the pixel editor.
 * @returns {HTMLElement} - The DOM element representing the pixel editor.
 */
function startPixelEditor({state = startState, tools = baseTools, controls = baseControls})
  {
  let app = new PixelEditor(state,
    {
    tools,
    controls,
    dispatch(action)
      {
      state = historyUpdateState(state, action);
      app.syncState(state);
      }
    });
  return app.dom;
  }
