// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({11:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCanvas = createCanvas;
exports.createElement = createElement;
function createCanvas(width, height, cssStyles) {
  var canvas = createElement('canvas', cssStyles);

  // Set the CSS width and height
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  // Set the canvas' internal width and height
  canvas.width = width;
  canvas.height = height;

  return canvas;
}

function createElement(tagName, css) {
  // Create the element
  var el = document.createElement(tagName);

  // Apply any styles (if provided)
  if (css) el.setAttribute('style', css);

  // Append the element to the body
  document.body.appendChild(el);

  return el;
}
},{}],17:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dom = require("./utils/dom");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mask = function () {
  function Mask(_ref) {
    var alpha = _ref.alpha;

    _classCallCheck(this, Mask);

    this.MASK_CSS = "\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    z-index: 99999999999999;\n  ";

    this.alpha = alpha;

    this._initCanvas();
  }

  _createClass(Mask, [{
    key: "mask",
    value: function mask(target) {
      var targetRect = target.getBoundingClientRect();
      var bodyRect = document.body.getBoundingClientRect();

      this._refill();

      this._createHoleAtPosition({
        x: targetRect.x - bodyRect.x,
        y: targetRect.y - bodyRect.y,
        width: targetRect.width,
        height: targetRect.height
      });
    }
  }, {
    key: "_initCanvas",
    value: function _initCanvas() {
      // Create a canvas spanning the whole body
      var bodyRect = document.body.getBoundingClientRect();
      this.canvas = (0, _dom.createCanvas)(bodyRect.width, bodyRect.height, this.MASK_CSS);

      // Get the context
      this.ctx = this.canvas.getContext("2d");
    }
  }, {
    key: "_refill",
    value: function _refill() {
      this._clearFill();
      this._fill();
    }
  }, {
    key: "_fill",
    value: function _fill() {
      this.ctx.fillStyle = "rgba(0,0,0," + this.alpha + ")";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }, {
    key: "_createHoleAtPosition",
    value: function _createHoleAtPosition(position) {
      this.ctx.clearRect(position.x, position.y, position.width, position.height);
    }
  }, {
    key: "_clearFill",
    value: function _clearFill() {
      this._createHoleAtPosition({ x: 0, y: 0, width: this.canvas.width, height: this.canvas.height });
    }
  }]);

  return Mask;
}();

exports.default = Mask;
},{"./utils/dom":11}],25:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var horizontalCenter = exports.horizontalCenter = function horizontalCenter(rect) {
  return rect.width / 2;
};
var verticalCenter = exports.verticalCenter = function verticalCenter(rect) {
  return rect.height / 2;
};
},{}],12:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defaultTemplateFactory = defaultTemplateFactory;
exports.render = render;
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// The first argument to JS template tags retain identity across multiple
// calls to a tag for the same literal, so we can cache work done per literal
// in a Map.
const templateCaches = exports.templateCaches = new Map();
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = exports.html = (strings, ...values) => new TemplateResult(strings, values, 'html');
/**
 * Interprets a template literal as an SVG template that can efficiently
 * render to and update a container.
 */
const svg = exports.svg = (strings, ...values) => new SVGTemplateResult(strings, values, 'svg');
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values, type, partCallback = defaultPartCallback) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.partCallback = partCallback;
    }
    /**
     * Returns a string of HTML used to create a <template> element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isTextBinding = true;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            html += s;
            // We're in a text position if the previous string closed its tags.
            // If it doesn't have any tags, then we use the previous text position
            // state.
            const closing = findTagClose(s);
            isTextBinding = closing > -1 ? closing < s.length : isTextBinding;
            html += isTextBinding ? nodeMarker : marker;
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        template.innerHTML = this.getHTML();
        return template;
    }
}
exports.TemplateResult = TemplateResult; /**
                                          * A TemplateResult for SVG fragments.
                                          *
                                          * This class wraps HTMl in an <svg> tag in order to parse its contents in the
                                          * SVG namespace, then modifies the template to remove the <svg> tag so that
                                          * clones only container the original fragment.
                                          */

class SVGTemplateResult extends TemplateResult {
    getHTML() {
        return `<svg>${super.getHTML()}</svg>`;
    }
    getTemplateElement() {
        const template = super.getTemplateElement();
        const content = template.content;
        const svgElement = content.firstChild;
        content.removeChild(svgElement);
        reparentNodes(content, svgElement.firstChild);
        return template;
    }
}
exports.SVGTemplateResult = SVGTemplateResult; /**
                                                * The default TemplateFactory which caches Templates keyed on
                                                * result.type and result.strings.
                                                */

function defaultTemplateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = new Map();
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.get(result.strings);
    if (template === undefined) {
        template = new Template(result, result.getTemplateElement());
        templateCache.set(result.strings, template);
    }
    return template;
}
/**
 * Renders a template to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result a TemplateResult created by evaluating a template tag like
 *     `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param templateFactory a function to create a Template or retreive one from
 *     cache.
 */
function render(result, container, templateFactory = defaultTemplateFactory) {
    const template = templateFactory(result);
    let instance = container.__templateInstance;
    // Repeat render, just call update()
    if (instance !== undefined && instance.template === template && instance._partCallback === result.partCallback) {
        instance.update(result.values);
        return;
    }
    // First render, create a new TemplateInstance and append it
    instance = new TemplateInstance(template, result.partCallback, templateFactory);
    container.__templateInstance = instance;
    const fragment = instance._clone();
    instance.update(result.values);
    removeNodes(container, container.firstChild);
    container.appendChild(fragment);
}
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, not attribute positions,
 * in template.
 */
const nodeMarker = `<!--${marker}-->`;
const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#attributes-0
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-character
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex = /[ \x09\x0a\x0c\x0d]([^\0-\x1F\x7F-\x9F \x09\x0a\x0c\x0d"'>=/]+)[ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*)$/;
/**
 * Finds the closing index of the last closed HTML tag.
 * This has 3 possible return values:
 *   - `-1`, meaning there is no tag in str.
 *   - `string.length`, meaning the last opened tag is unclosed.
 *   - Some positive number < str.length, meaning the index of the closing '>'.
 */
function findTagClose(str) {
    const close = str.lastIndexOf('>');
    const open = str.indexOf('<', close + 1);
    return open > -1 ? str.length : close;
}
/**
 * A placeholder for a dynamic expression in an HTML template.
 *
 * There are two built-in part types: AttributePart and NodePart. NodeParts
 * always represent a single dynamic expression, while AttributeParts may
 * represent as many expressions are contained in the attribute.
 *
 * A Template's parts are mutable, so parts can be replaced or modified
 * (possibly to implement different template semantics). The contract is that
 * parts can only be replaced, not removed, added or reordered, and parts must
 * always consume the correct number of values in their `update()` method.
 *
 * TODO(justinfagnani): That requirement is a little fragile. A
 * TemplateInstance could instead be more careful about which values it gives
 * to Part.update().
 */
class TemplatePart {
    constructor(type, index, name, rawName, strings) {
        this.type = type;
        this.index = index;
        this.name = name;
        this.rawName = rawName;
        this.strings = strings;
    }
}
exports.TemplatePart = TemplatePart;
const isTemplatePartActive = exports.isTemplatePartActive = part => part.index !== -1;
/**
 * An updateable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        const content = this.element.content;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(content, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
                                                              NodeFilter.SHOW_TEXT */, null, false);
        let index = -1;
        let partIndex = 0;
        const nodesToRemove = [];
        // The actual previous node, accounting for removals: if a node is removed
        // it will never be the previousNode.
        let previousNode;
        // Used to set previousNode at the top of the loop.
        let currentNode;
        while (walker.nextNode()) {
            index++;
            previousNode = currentNode;
            const node = currentNode = walker.currentNode;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                    if (!node.hasAttributes()) {
                        continue;
                    }
                    const attributes = node.attributes;
                    // Per https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                    // attributes are not guaranteed to be returned in document order. In
                    // particular, Edge/IE can return them out of order, so we cannot assume
                    // a correspondance between part index and attribute index.
                    let count = 0;
                    for (let i = 0; i < attributes.length; i++) {
                        if (attributes[i].value.indexOf(marker) >= 0) {
                            count++;
                        }
                    }
                    while (count-- > 0) {
                        // Get the template literal section leading up to the first
                        // expression in this attribute
                        const stringForPart = result.strings[partIndex];
                        // Find the attribute name
                        const attributeNameInPart = lastAttributeNameRegex.exec(stringForPart)[1];
                        // Find the corresponding attribute
                        // TODO(justinfagnani): remove non-null assertion
                        const attribute = attributes.getNamedItem(attributeNameInPart);
                        const stringsForAttributeValue = attribute.value.split(markerRegex);
                        this.parts.push(new TemplatePart('attribute', index, attribute.name, attributeNameInPart, stringsForAttributeValue));
                        node.removeAttribute(attribute.name);
                        partIndex += stringsForAttributeValue.length - 1;
                    }
                } else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                    const nodeValue = node.nodeValue;
                    if (nodeValue.indexOf(marker) < 0) {
                        continue;
                    }
                    const parent = node.parentNode;
                    const strings = nodeValue.split(markerRegex);
                    const lastIndex = strings.length - 1;
                    // We have a part for each match found
                    partIndex += lastIndex;
                    // Generate a new text node for each literal section
                    // These nodes are also used as the markers for node parts
                    for (let i = 0; i < lastIndex; i++) {
                        parent.insertBefore(strings[i] === '' ? document.createComment('') : document.createTextNode(strings[i]), node);
                        this.parts.push(new TemplatePart('node', index++));
                    }
                    parent.insertBefore(strings[lastIndex] === '' ? document.createComment('') : document.createTextNode(strings[lastIndex]), node);
                    nodesToRemove.push(node);
                } else if (node.nodeType === 8 /* Node.COMMENT_NODE */ && node.nodeValue === marker) {
                const parent = node.parentNode;
                // Add a new marker node to be the startNode of the Part if any of the
                // following are true:
                //  * We don't have a previousSibling
                //  * previousSibling is being removed (thus it's not the
                //    `previousNode`)
                //  * previousSibling is not a Text node
                //
                // TODO(justinfagnani): We should be able to use the previousNode here
                // as the marker node and reduce the number of extra nodes we add to a
                // template. See https://github.com/PolymerLabs/lit-html/issues/147
                const previousSibling = node.previousSibling;
                if (previousSibling === null || previousSibling !== previousNode || previousSibling.nodeType !== Node.TEXT_NODE) {
                    parent.insertBefore(document.createComment(''), node);
                } else {
                    index--;
                }
                this.parts.push(new TemplatePart('node', index++));
                nodesToRemove.push(node);
                // If we don't have a nextSibling add a marker node.
                // We don't have to check if the next node is going to be removed,
                // because that node will induce a new marker if so.
                if (node.nextSibling === null) {
                    parent.insertBefore(document.createComment(''), node);
                } else {
                    index--;
                }
                currentNode = previousNode;
                partIndex++;
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
exports.Template = Template; /**
                              * Returns a value ready to be inserted into a Part from a user-provided value.
                              *
                              * If the user value is a directive, this invokes the directive with the given
                              * part. If the value is null, it's converted to undefined to work better
                              * with certain DOM APIs, like textContent.
                              */

const getValue = exports.getValue = (part, value) => {
    // `null` as the value of a Text node will render the string 'null'
    // so we convert it to undefined
    if (isDirective(value)) {
        value = value(part);
        return noChange;
    }
    return value === null ? undefined : value;
};
const directive = exports.directive = f => {
    f.__litDirective = true;
    return f;
};
const isDirective = o => typeof o === 'function' && o.__litDirective === true;
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = exports.noChange = {};
/**
 * @deprecated Use `noChange` instead.
 */
exports.directiveValue = noChange;

const isPrimitiveValue = value => value === null || !(typeof value === 'object' || typeof value === 'function');
class AttributePart {
    constructor(instance, element, name, strings) {
        this.instance = instance;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.size = strings.length - 1;
        this._previousValues = [];
    }
    _interpolate(values, startIndex) {
        const strings = this.strings;
        const l = strings.length - 1;
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const v = getValue(this, values[startIndex + i]);
            if (v && v !== noChange && (Array.isArray(v) || typeof v !== 'string' && v[Symbol.iterator])) {
                for (const t of v) {
                    // TODO: we need to recursively call getValue into iterables...
                    text += t;
                }
            } else {
                text += v;
            }
        }
        return text + strings[l];
    }
    _equalToPreviousValues(values, startIndex) {
        for (let i = startIndex; i < startIndex + this.size; i++) {
            if (this._previousValues[i] !== values[i] || !isPrimitiveValue(values[i])) {
                return false;
            }
        }
        return true;
    }
    setValue(values, startIndex) {
        if (this._equalToPreviousValues(values, startIndex)) {
            return;
        }
        const s = this.strings;
        let value;
        if (s.length === 2 && s[0] === '' && s[1] === '') {
            // An expression that occupies the whole attribute value will leave
            // leading and trailing empty strings.
            value = getValue(this, values[startIndex]);
            if (Array.isArray(value)) {
                value = value.join('');
            }
        } else {
            value = this._interpolate(values, startIndex);
        }
        if (value !== noChange) {
            this.element.setAttribute(this.name, value);
        }
        this._previousValues = values;
    }
}
exports.AttributePart = AttributePart;
class NodePart {
    constructor(instance, startNode, endNode) {
        this.instance = instance;
        this.startNode = startNode;
        this.endNode = endNode;
        this._previousValue = undefined;
    }
    setValue(value) {
        value = getValue(this, value);
        if (value === noChange) {
            return;
        }
        if (isPrimitiveValue(value)) {
            // Handle primitive values
            // If the value didn't change, do nothing
            if (value === this._previousValue) {
                return;
            }
            this._setText(value);
        } else if (value instanceof TemplateResult) {
            this._setTemplateResult(value);
        } else if (Array.isArray(value) || value[Symbol.iterator]) {
            this._setIterable(value);
        } else if (value instanceof Node) {
            this._setNode(value);
        } else if (value.then !== undefined) {
            this._setPromise(value);
        } else {
            // Fallback, will render the string representation
            this._setText(value);
        }
    }
    _insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    _setNode(value) {
        if (this._previousValue === value) {
            return;
        }
        this.clear();
        this._insert(value);
        this._previousValue = value;
    }
    _setText(value) {
        const node = this.startNode.nextSibling;
        value = value === undefined ? '' : value;
        if (node === this.endNode.previousSibling && node.nodeType === Node.TEXT_NODE) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if _previousValue is
            // primitive?
            node.textContent = value;
        } else {
            this._setNode(document.createTextNode(value));
        }
        this._previousValue = value;
    }
    _setTemplateResult(value) {
        const template = this.instance._getTemplate(value);
        let instance;
        if (this._previousValue && this._previousValue.template === template) {
            instance = this._previousValue;
        } else {
            instance = new TemplateInstance(template, this.instance._partCallback, this.instance._getTemplate);
            this._setNode(instance._clone());
            this._previousValue = instance;
        }
        instance.update(value.values);
    }
    _setIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _previousValue is an array, then the previous render was of an
        // iterable and _previousValue will contain the NodeParts from the previous
        // render. If _previousValue is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this._previousValue)) {
            this.clear();
            this._previousValue = [];
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this._previousValue;
        let partIndex = 0;
        for (const item of value) {
            // Try to reuse an existing part
            let itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                // If we're creating the first item part, it's startNode should be the
                // container's startNode
                let itemStart = this.startNode;
                // If we're not creating the first part, create a new separator marker
                // node, and fix up the previous part's endNode to point to it
                if (partIndex > 0) {
                    const previousPart = itemParts[partIndex - 1];
                    itemStart = previousPart.endNode = document.createTextNode('');
                    this._insert(itemStart);
                }
                itemPart = new NodePart(this.instance, itemStart, this.endNode);
                itemParts.push(itemPart);
            }
            itemPart.setValue(item);
            partIndex++;
        }
        if (partIndex === 0) {
            this.clear();
            this._previousValue = undefined;
        } else if (partIndex < itemParts.length) {
            const lastPart = itemParts[partIndex - 1];
            // Truncate the parts array so _previousValue reflects the current state
            itemParts.length = partIndex;
            this.clear(lastPart.endNode.previousSibling);
            lastPart.endNode = this.endNode;
        }
    }
    _setPromise(value) {
        this._previousValue = value;
        value.then(v => {
            if (this._previousValue === value) {
                this.setValue(v);
            }
        });
    }
    clear(startNode = this.startNode) {
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
exports.NodePart = NodePart;
const defaultPartCallback = exports.defaultPartCallback = (instance, templatePart, node) => {
    if (templatePart.type === 'attribute') {
        return new AttributePart(instance, node, templatePart.name, templatePart.strings);
    } else if (templatePart.type === 'node') {
        return new NodePart(instance, node, node.nextSibling);
    }
    throw new Error(`Unknown part type ${templatePart.type}`);
};
/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, partCallback, getTemplate) {
        this._parts = [];
        this.template = template;
        this._partCallback = partCallback;
        this._getTemplate = getTemplate;
    }
    update(values) {
        let valueIndex = 0;
        for (const part of this._parts) {
            if (!part) {
                valueIndex++;
            } else if (part.size === undefined) {
                part.setValue(values[valueIndex]);
                valueIndex++;
            } else {
                part.setValue(values, valueIndex);
                valueIndex += part.size;
            }
        }
    }
    _clone() {
        // Clone the node, rather than importing it, to keep the fragment in the
        // template's document. This leaves the fragment inert so custom elements
        // won't upgrade until after the main document adopts the node.
        const fragment = this.template.element.content.cloneNode(true);
        const parts = this.template.parts;
        if (parts.length > 0) {
            // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be
            // null
            const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT |
                                                                   NodeFilter.SHOW_TEXT */, null, false);
            let index = -1;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const partActive = isTemplatePartActive(part);
                // An inactive part has no coresponding Template node.
                if (partActive) {
                    while (index < part.index) {
                        index++;
                        walker.nextNode();
                    }
                }
                this._parts.push(partActive ? this._partCallback(this, part, walker.currentNode) : undefined);
            }
        }
        return fragment;
    }
}
exports.TemplateInstance = TemplateInstance; /**
                                              * Reparents nodes, starting from `startNode` (inclusive) to `endNode`
                                              * (exclusive), into another container (could be the same container), before
                                              * `beforeNode`. If `beforeNode` is null, it appends the nodes to the
                                              * container.
                                              */

const reparentNodes = exports.reparentNodes = (container, start, end = null, before = null) => {
    let node = start;
    while (node !== end) {
        const n = node.nextSibling;
        container.insertBefore(node, before);
        node = n;
    }
};
/**
 * Removes nodes, starting from `startNode` (inclusive) to `endNode`
 * (exclusive), from `container`.
 */
const removeNodes = exports.removeNodes = (container, startNode, endNode = null) => {
    let node = startNode;
    while (node !== endNode) {
        const n = node.nextSibling;
        container.removeChild(node);
        node = n;
    }
};
//# sourceMappingURL=lit-html.js.map
},{}],29:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EventPart = exports.PropertyPart = exports.BooleanAttributePart = exports.extendedPartCallback = exports.svg = exports.html = exports.render = undefined;

var _litHtml = require('../lit-html.js');

Object.defineProperty(exports, 'render', {
    enumerable: true,
    get: function () {
        return _litHtml.render;
    }
});

/**
 * Interprets a template literal as a lit-extended HTML template.
 */
const html = exports.html = (strings, ...values) => new _litHtml.TemplateResult(strings, values, 'html', extendedPartCallback);
/**
 * Interprets a template literal as a lit-extended SVG template.
 */
const svg = exports.svg = (strings, ...values) => new _litHtml.SVGTemplateResult(strings, values, 'svg', extendedPartCallback);
/**
 * A PartCallback which allows templates to set properties and declarative
 * event handlers.
 *
 * Properties are set by default, instead of attributes. Attribute names in
 * lit-html templates preserve case, so properties are case sensitive. If an
 * expression takes up an entire attribute value, then the property is set to
 * that value. If an expression is interpolated with a string or other
 * expressions then the property is set to the string result of the
 * interpolation.
 *
 * To set an attribute instead of a property, append a `$` suffix to the
 * attribute name.
 *
 * Example:
 *
 *     html`<button class$="primary">Buy Now</button>`
 *
 * To set an event handler, prefix the attribute name with `on-`:
 *
 * Example:
 *
 *     html`<button on-click=${(e)=> this.onClickHandler(e)}>Buy Now</button>`
 *
 */
const extendedPartCallback = exports.extendedPartCallback = (instance, templatePart, node) => {
    if (templatePart.type === 'attribute') {
        if (templatePart.rawName.substr(0, 3) === 'on-') {
            const eventName = templatePart.rawName.slice(3);
            return new EventPart(instance, node, eventName);
        }
        const lastChar = templatePart.name.substr(templatePart.name.length - 1);
        if (lastChar === '$') {
            const name = templatePart.name.slice(0, -1);
            return new _litHtml.AttributePart(instance, node, name, templatePart.strings);
        }
        if (lastChar === '?') {
            const name = templatePart.name.slice(0, -1);
            return new BooleanAttributePart(instance, node, name, templatePart.strings);
        }
        return new PropertyPart(instance, node, templatePart.rawName, templatePart.strings);
    }
    return (0, _litHtml.defaultPartCallback)(instance, templatePart, node);
};
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */
class BooleanAttributePart extends _litHtml.AttributePart {
    setValue(values, startIndex) {
        const s = this.strings;
        if (s.length === 2 && s[0] === '' && s[1] === '') {
            const value = (0, _litHtml.getValue)(this, values[startIndex]);
            if (value === _litHtml.noChange) {
                return;
            }
            if (value) {
                this.element.setAttribute(this.name, '');
            } else {
                this.element.removeAttribute(this.name);
            }
        } else {
            throw new Error('boolean attributes can only contain a single expression');
        }
    }
}
exports.BooleanAttributePart = BooleanAttributePart;
class PropertyPart extends _litHtml.AttributePart {
    setValue(values, startIndex) {
        const s = this.strings;
        let value;
        if (this._equalToPreviousValues(values, startIndex)) {
            return;
        }
        if (s.length === 2 && s[0] === '' && s[1] === '') {
            // An expression that occupies the whole attribute value will leave
            // leading and trailing empty strings.
            value = (0, _litHtml.getValue)(this, values[startIndex]);
        } else {
            // Interpolation, so interpolate
            value = this._interpolate(values, startIndex);
        }
        if (value !== _litHtml.noChange) {
            this.element[this.name] = value;
        }
        this._previousValues = values;
    }
}
exports.PropertyPart = PropertyPart;
class EventPart {
    constructor(instance, element, eventName) {
        this.instance = instance;
        this.element = element;
        this.eventName = eventName;
    }
    setValue(value) {
        const listener = (0, _litHtml.getValue)(this, value);
        if (listener === this._listener) {
            return;
        }
        if (listener == null) {
            this.element.removeEventListener(this.eventName, this);
        } else if (this._listener == null) {
            this.element.addEventListener(this.eventName, this);
        }
        this._listener = listener;
    }
    handleEvent(event) {
        if (typeof this._listener === 'function') {
            this._listener.call(this.element, event);
        } else if (typeof this._listener.handleEvent === 'function') {
            this._listener.handleEvent(event);
        }
    }
}
exports.EventPart = EventPart; //# sourceMappingURL=lit-extended.js.map
},{"../lit-html.js":12}],15:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var boxCSS = exports.boxCSS = '\n  background-color: white;\n  color: black;\n  padding: 15px;\n  box-shadow: 0px 0px 9px #636363;\n  max-width:300px;\n';

var arrowCSS = exports.arrowCSS = function arrowCSS(orientation) {
  var COLOR = 'grey';

  switch (orientation) {
    case 'bottom':
      return '\n            width: 0; \n            height: 0; \n            border-left: 5px solid transparent;\n            border-right: 5px solid transparent;\n            border-bottom: 5px solid ' + COLOR + ';\n          ';
    case 'top':
      return '\n            width: 0; \n            height: 0; \n            border-left: 20px solid transparent;\n            border-right: 20px solid transparent;\n            border-top: 20px solid ' + COLOR + ';\n          ';

    case 'left':
      return '\n            width: 0; \n            height: 0; \n            border-top: 60px solid transparent;\n            border-bottom: 60px solid transparent;\n            border-left: 60px solid ' + COLOR + ';\n          ';

    case 'right':
      return '\n            width: 0; \n            height: 0; \n            border-top: 10px solid transparent;\n            border-bottom: 10px solid transparent; \n            \n            border-right:10px solid ' + COLOR + '; \n          ';
  }
};

var closeButtonCSS = exports.closeButtonCSS = '\n  float: right;\n  position: relative;\n  cursor: pointer;\n  top: -5px;\n  padding: 5px;\n  color: #aaa;\n';
},{}],9:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  <div style="', '">\n    <span style=', '" on-click=', '>x</span>\n    <div style="font-weight:bold">', '</div>\n    <div>', '</div>\n  </div>\n'], ['\n  <div style="', '">\n    <span style=', '" on-click=', '>x</span>\n    <div style="font-weight:bold">', '</div>\n    <div>', '</div>\n  </div>\n']);

var _dom = require('./utils/dom');

var _orientation = require('./utils/orientation');

var _litExtended = require('lit-html/lib/lit-extended');

var lit = _interopRequireWildcard(_litExtended);

var _defaultStyles = require('./defaultStyles');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var DEFAULT_TEMPLATE = function DEFAULT_TEMPLATE(data, eventHandlers, orientation) {
  return lit.html(_templateObject, _defaultStyles.boxCSS, _defaultStyles.closeButtonCSS, eventHandlers.close, data.title, data.content);
};

var DEFAULT_WRAPPER_CSS = '\n  position: absolute;\n  z-index: 999999999999999;\n';

var TourBox = function () {
  function TourBox(template, wrapperCSS) {
    _classCallCheck(this, TourBox);

    this.offsetX = 10;
    this.offsetY = 10;
    this.eventHandlers = {
      close: this.closeButtonClickHandler.bind(this)
    };

    // Initialize the class properties
    this.template = template || DEFAULT_TEMPLATE;
    this.wrapperCSS = wrapperCSS || DEFAULT_WRAPPER_CSS;

    // Create the wrapper div
    this.wrapper = (0, _dom.createElement)('div', this.wrapperCSS);
  }

  _createClass(TourBox, [{
    key: 'render',
    value: function render(data) {
      lit.render(this.template(data, this.eventHandlers), this.wrapper);
    }
  }, {
    key: 'goToPosition',
    value: function goToPosition(x, y) {
      this.wrapper.style.left = x + 'px';
      this.wrapper.style.top = y + 'px';
    }
  }, {
    key: 'goToElement',
    value: function goToElement(target) {
      var orientation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'bottom';

      var targetRect = target.getBoundingClientRect();
      var wrapperRect = this.wrapper.getBoundingClientRect();
      var bodyRect = document.body.getBoundingClientRect();

      // Compute base positions (the absolute x and y of the upper left corner)
      var baseX = targetRect.x - bodyRect.x;
      var baseY = targetRect.y - bodyRect.y;

      // Calculate the shift (how much to move relative to the base position based) based on the orientation

      var _calculateRelativeShi = this.calculateRelativeShift(orientation, targetRect, wrapperRect),
          horizontalShift = _calculateRelativeShi.horizontalShift,
          verticalShift = _calculateRelativeShi.verticalShift;

      // Go to the computed position


      var newX = baseX + horizontalShift;
      var newY = baseY + verticalShift;
      this.goToPosition(newX, newY);

      // Check that the width/height didn't change in the process (if they did we need to rerun again since cerntering will be thrown off)
      // Explanation: Sometimes the browser will rerender the div when you move it to help fit its contents in the viewport (ie if you try to smush the tour div onto the right side of the screen partially, it'll resize to fit)
      var newWrapperRect = this.wrapper.getBoundingClientRect();
      if (wrapperRect.width !== newWrapperRect.width || wrapperRect.height !== newWrapperRect.height) {
        console.log('Looks like the browser decided to screww us over...');
        this.goToElement(target, orientation);
      }
    }
  }, {
    key: 'calculateRelativeShift',
    value: function calculateRelativeShift(orientation, targetRect, wrapperRect) {
      var horizontalShift = 0;
      var verticalShift = 0;

      switch (orientation) {
        case 'bottom':
          horizontalShift += (0, _orientation.horizontalCenter)(targetRect) - (0, _orientation.horizontalCenter)(wrapperRect);
          verticalShift += targetRect.height + this.offsetY;
          break;
        case 'top':
          horizontalShift += (0, _orientation.horizontalCenter)(targetRect) - (0, _orientation.horizontalCenter)(wrapperRect);
          verticalShift -= wrapperRect.height + this.offsetY;
          break;
        case 'left':
          verticalShift += (0, _orientation.verticalCenter)(targetRect) - (0, _orientation.verticalCenter)(wrapperRect);
          horizontalShift -= wrapperRect.width + this.offsetX;
          break;
        case 'right':
          verticalShift += (0, _orientation.verticalCenter)(targetRect) - (0, _orientation.verticalCenter)(wrapperRect);
          horizontalShift += targetRect.width + this.offsetX;
          break;
      }

      return { horizontalShift: horizontalShift, verticalShift: verticalShift };
    }
  }, {
    key: 'closeButtonClickHandler',
    value: function closeButtonClickHandler() {
      console.log('hiiii', this);
    }
  }]);

  return TourBox;
}();

exports.default = TourBox;
},{"./utils/dom":11,"./utils/orientation":25,"lit-html/lib/lit-extended":29,"./defaultStyles":15}],7:[function(require,module,exports) {
"use strict";

var _Mask = require("../src2/Mask");

var _Mask2 = _interopRequireDefault(_Mask);

var _TourBox = require("../src2/TourBox");

var _TourBox2 = _interopRequireDefault(_TourBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (module.hot) {
  module.hot.accept(function () {
    location.reload();
  });
}

var mask = new _Mask2.default({ alpha: 0.5 });
var tourBox = new _TourBox2.default();

function tourStep(stepData, target) {
  tourBox.render(stepData);
  tourBox.goToElement(target);
  mask.mask(target);
}

// Example call:
var target = document.querySelector("#features");
var exampleStepData = { title: "Hello", content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum" };
tourStep(exampleStepData, target);

window.tourStep = tourStep;
},{"../src2/Mask":17,"../src2/TourBox":9}],3:[function(require,module,exports) {
'use strict';

var _newtour = require('../src/newtour.js');

var _newtour2 = _interopRequireDefault(_newtour);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    before: function before() {
      return new Promise(function (resolve, reject) {

        var vaderEl = document.getElementById('vader');
        vaderEl.style.opacity = '1';

        var boxEl = document.getElementById('Tour-box');
        boxEl.className += ' ' + 'dark-box';

        resolve();
      });
    },
    after: function after() {
      return new Promise(function (resolve, reject) {

        var vaderEl = document.getElementById('vader');
        vaderEl.style.opacity = '0';

        var boxEl = document.getElementById('Tour-box');
        var classes = boxEl.className.split(' ');
        classes = classes.filter(function (d) {
          return d !== 'dark-box';
        });
        boxEl.className = classes.join(' ');

        resolve();
      });
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

  // console.log('Tour', tour)
  // let tour = new Tour(myTour)
  // console.log({tour})
  // // tour.start();

};
},{"../src/newtour.js":7}],8:[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '51408' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[8,3], null)
//# sourceMappingURL=/example.fd1d8b81.map