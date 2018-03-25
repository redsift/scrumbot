/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(console) {'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _siftSdkWeb = __webpack_require__(8);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Scrumbot Sift. Frontend controller entry point.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */
	
	
	//import Webhook from './lib/webhook';
	
	function _sendWebhook(url, key, value) {
	  // console.log('sched-sift: _sendWebhook: ', url, key, value);
	  var wh = new XMLHttpRequest();
	  var whurl = url;
	  whurl = whurl.replace('{key}', encodeURIComponent(key));
	  whurl = whurl.replace('{value}', encodeURIComponent(value));
	  // console.log('sched-sift: _sendWebhook: sending: ', whurl);
	  wh.open('GET', whurl, false);
	  wh.send();
	}
	
	var MyController = function (_SiftController) {
	  _inherits(MyController, _SiftController);
	
	  function MyController() {
	    _classCallCheck(this, MyController);
	
	    var _this = _possibleConstructorReturn(this, (MyController.__proto__ || Object.getPrototypeOf(MyController)).call(this));
	    // You have to call the super() method to initialize the base class.
	
	
	    _this._suHandler = _this.onStorageUpdate.bind(_this);
	    _this.view.subscribe('wpm', _this.onFormSubmit.bind(_this));
	    return _this;
	  }
	
	  // for more info: http://docs.redsift.com/docs/client-code-siftcontroller
	
	
	  _createClass(MyController, [{
	    key: 'loadView',
	    value: function loadView(state) {
	      console.log('scrumbot: loadView', state);
	      // Register for storage update events on the "x" bucket so we can update the UI
	      this.storage.subscribe(['slack_info', 'settingsExport'], this._suHandler);
	      switch (state.type) {
	        case 'summary':
	          var wh = this.getWebhook();
	          var settings = this.getSettings();
	          var slackInfo = this.getSlackInfo();
	
	          return {
	            html: 'summary.html',
	            data: Promise.all([wh, settings, slackInfo]).then(function (values) {
	              return {
	                webhookUri: values[0],
	                settings: values[1],
	                slackInfo: values[2]
	              };
	            })
	          };
	
	        default:
	          console.error('scrumbot: unknown Sift type: ', state.type);
	      }
	    }
	
	    // Event: storage update
	
	  }, {
	    key: 'onStorageUpdate',
	    value: function onStorageUpdate(value) {
	      var _this2 = this;
	
	      console.log('scrumbot: onStorageUpdate: ', value);
	
	      this.getSettings().then(function (settings) {
	        console.log('onStorageUpdate: settings: ', settings);
	        _this2.publish('settings', settings);
	      });
	
	      this.getSlackInfo().then(function (slackInfo) {
	        console.log('onStorageUpdate: slackInfo:', slackInfo);
	        _this2.publish('slackInfo', slackInfo);
	      });
	    }
	  }, {
	    key: 'onFormSubmit',
	    value: function onFormSubmit(value) {
	      console.log('scrumbot: FormSubmit: ', value);
	      this.storage.get({
	        bucket: '_redsift',
	        keys: ['webhooks/settingsHook']
	      }).then(function (wbr) {
	        console.log('scrumbot: FormSubmit webhook url: ', wbr[0].value);
	        _sendWebhook(wbr[0].value, 'settings', JSON.stringify(value));
	      }).catch(function (error) {
	        console.error('scrumbot: FormSubmit: ', error);
	      });
	    }
	  }, {
	    key: 'getWebhook',
	    value: function getWebhook() {
	      return this.storage.get({
	        bucket: '_redsift',
	        keys: ['webhooks/settingsHook']
	      }).then(function (d) {
	        return d[0].value;
	      });
	    }
	  }, {
	    key: 'getSettings',
	    value: function getSettings() {
	      return this.storage.get({
	        bucket: 'settingsExport',
	        keys: ['settings']
	      }).then(function (values) {
	        console.log('scrumbot: getSettings returned:', values[0].value);
	        return values[0].value ? JSON.parse(values[0].value) : null;
	      });
	    }
	  }, {
	    key: 'getSlackInfo',
	    value: function getSlackInfo() {
	      return this.storage.get({
	        bucket: 'slack_info',
	        keys: ['slack-signed-up']
	      }).then(function (values) {
	        console.log('scrumbot: getSlackInfo returned:', values[0].value);
	        return values[0].value ? JSON.parse(values[0].value) : null;
	      });
	    }
	  }]);
	
	  return MyController;
	}(_siftSdkWeb.SiftController);
	
	// Do not remove. The Sift is responsible for registering its views and controllers
	
	
	exports.default = MyController;
	(0, _siftSdkWeb.registerSiftController)(new MyController());
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*global window, global*/
	var util = __webpack_require__(2)
	var assert = __webpack_require__(6)
	var now = __webpack_require__(7)
	
	var slice = Array.prototype.slice
	var console
	var times = {}
	
	if (typeof global !== "undefined" && global.console) {
	    console = global.console
	} else if (typeof window !== "undefined" && window.console) {
	    console = window.console
	} else {
	    console = {}
	}
	
	var functions = [
	    [log, "log"],
	    [info, "info"],
	    [warn, "warn"],
	    [error, "error"],
	    [time, "time"],
	    [timeEnd, "timeEnd"],
	    [trace, "trace"],
	    [dir, "dir"],
	    [consoleAssert, "assert"]
	]
	
	for (var i = 0; i < functions.length; i++) {
	    var tuple = functions[i]
	    var f = tuple[0]
	    var name = tuple[1]
	
	    if (!console[name]) {
	        console[name] = f
	    }
	}
	
	module.exports = console
	
	function log() {}
	
	function info() {
	    console.log.apply(console, arguments)
	}
	
	function warn() {
	    console.log.apply(console, arguments)
	}
	
	function error() {
	    console.warn.apply(console, arguments)
	}
	
	function time(label) {
	    times[label] = now()
	}
	
	function timeEnd(label) {
	    var time = times[label]
	    if (!time) {
	        throw new Error("No such label: " + label)
	    }
	
	    var duration = now() - time
	    console.log(label + ": " + duration + "ms")
	}
	
	function trace() {
	    var err = new Error()
	    err.name = "Trace"
	    err.message = util.format.apply(null, arguments)
	    console.error(err.stack)
	}
	
	function dir(object) {
	    console.log(util.inspect(object) + "\n")
	}
	
	function consoleAssert(expression) {
	    if (!expression) {
	        var arr = slice.call(arguments, 1)
	        assert.ok(false, util.format.apply(null, arr))
	    }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process, console) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }
	
	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};
	
	
	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }
	
	  if (process.noDeprecation === true) {
	    return fn;
	  }
	
	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }
	
	  return deprecated;
	};
	
	
	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};
	
	
	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;
	
	
	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};
	
	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};
	
	
	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];
	
	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}
	
	
	function stylizeNoColor(str, styleType) {
	  return str;
	}
	
	
	function arrayToHash(array) {
	  var hash = {};
	
	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });
	
	  return hash;
	}
	
	
	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }
	
	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }
	
	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);
	
	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }
	
	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }
	
	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }
	
	  var base = '', array = false, braces = ['{', '}'];
	
	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }
	
	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }
	
	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }
	
	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }
	
	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }
	
	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }
	
	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }
	
	  ctx.seen.push(value);
	
	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }
	
	  ctx.seen.pop();
	
	  return reduceToSingleString(output, base, braces);
	}
	
	
	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}
	
	
	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}
	
	
	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}
	
	
	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }
	
	  return name + ': ' + str;
	}
	
	
	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);
	
	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }
	
	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}
	
	
	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;
	
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;
	
	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;
	
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;
	
	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;
	
	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;
	
	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;
	
	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;
	
	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;
	
	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;
	
	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;
	
	exports.isBuffer = __webpack_require__(4);
	
	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	
	
	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}
	
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];
	
	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}
	
	
	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};
	
	
	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(5);
	
	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;
	
	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};
	
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(3), __webpack_require__(1)))

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;
	
	process.listeners = function (name) { return [] }
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
	// original notice:
	
	/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	function compare(a, b) {
	  if (a === b) {
	    return 0;
	  }
	
	  var x = a.length;
	  var y = b.length;
	
	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break;
	    }
	  }
	
	  if (x < y) {
	    return -1;
	  }
	  if (y < x) {
	    return 1;
	  }
	  return 0;
	}
	function isBuffer(b) {
	  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
	    return global.Buffer.isBuffer(b);
	  }
	  return !!(b != null && b._isBuffer);
	}
	
	// based on node assert, original notice:
	
	// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
	//
	// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
	//
	// Originally from narwhal.js (http://narwhaljs.org)
	// Copyright (c) 2009 Thomas Robinson <280north.com>
	//
	// Permission is hereby granted, free of charge, to any person obtaining a copy
	// of this software and associated documentation files (the 'Software'), to
	// deal in the Software without restriction, including without limitation the
	// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
	// sell copies of the Software, and to permit persons to whom the Software is
	// furnished to do so, subject to the following conditions:
	//
	// The above copyright notice and this permission notice shall be included in
	// all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
	// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var util = __webpack_require__(2);
	var hasOwn = Object.prototype.hasOwnProperty;
	var pSlice = Array.prototype.slice;
	var functionsHaveNames = (function () {
	  return function foo() {}.name === 'foo';
	}());
	function pToString (obj) {
	  return Object.prototype.toString.call(obj);
	}
	function isView(arrbuf) {
	  if (isBuffer(arrbuf)) {
	    return false;
	  }
	  if (typeof global.ArrayBuffer !== 'function') {
	    return false;
	  }
	  if (typeof ArrayBuffer.isView === 'function') {
	    return ArrayBuffer.isView(arrbuf);
	  }
	  if (!arrbuf) {
	    return false;
	  }
	  if (arrbuf instanceof DataView) {
	    return true;
	  }
	  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
	    return true;
	  }
	  return false;
	}
	// 1. The assert module provides functions that throw
	// AssertionError's when particular conditions are not met. The
	// assert module must conform to the following interface.
	
	var assert = module.exports = ok;
	
	// 2. The AssertionError is defined in assert.
	// new assert.AssertionError({ message: message,
	//                             actual: actual,
	//                             expected: expected })
	
	var regex = /\s*function\s+([^\(\s]*)\s*/;
	// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
	function getName(func) {
	  if (!util.isFunction(func)) {
	    return;
	  }
	  if (functionsHaveNames) {
	    return func.name;
	  }
	  var str = func.toString();
	  var match = str.match(regex);
	  return match && match[1];
	}
	assert.AssertionError = function AssertionError(options) {
	  this.name = 'AssertionError';
	  this.actual = options.actual;
	  this.expected = options.expected;
	  this.operator = options.operator;
	  if (options.message) {
	    this.message = options.message;
	    this.generatedMessage = false;
	  } else {
	    this.message = getMessage(this);
	    this.generatedMessage = true;
	  }
	  var stackStartFunction = options.stackStartFunction || fail;
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, stackStartFunction);
	  } else {
	    // non v8 browsers so we can have a stacktrace
	    var err = new Error();
	    if (err.stack) {
	      var out = err.stack;
	
	      // try to strip useless frames
	      var fn_name = getName(stackStartFunction);
	      var idx = out.indexOf('\n' + fn_name);
	      if (idx >= 0) {
	        // once we have located the function frame
	        // we need to strip out everything before it (and its line)
	        var next_line = out.indexOf('\n', idx + 1);
	        out = out.substring(next_line + 1);
	      }
	
	      this.stack = out;
	    }
	  }
	};
	
	// assert.AssertionError instanceof Error
	util.inherits(assert.AssertionError, Error);
	
	function truncate(s, n) {
	  if (typeof s === 'string') {
	    return s.length < n ? s : s.slice(0, n);
	  } else {
	    return s;
	  }
	}
	function inspect(something) {
	  if (functionsHaveNames || !util.isFunction(something)) {
	    return util.inspect(something);
	  }
	  var rawname = getName(something);
	  var name = rawname ? ': ' + rawname : '';
	  return '[Function' +  name + ']';
	}
	function getMessage(self) {
	  return truncate(inspect(self.actual), 128) + ' ' +
	         self.operator + ' ' +
	         truncate(inspect(self.expected), 128);
	}
	
	// At present only the three keys mentioned above are used and
	// understood by the spec. Implementations or sub modules can pass
	// other keys to the AssertionError's constructor - they will be
	// ignored.
	
	// 3. All of the following functions must throw an AssertionError
	// when a corresponding condition is not met, with a message that
	// may be undefined if not provided.  All assertion methods provide
	// both the actual and expected values to the assertion error for
	// display purposes.
	
	function fail(actual, expected, message, operator, stackStartFunction) {
	  throw new assert.AssertionError({
	    message: message,
	    actual: actual,
	    expected: expected,
	    operator: operator,
	    stackStartFunction: stackStartFunction
	  });
	}
	
	// EXTENSION! allows for well behaved errors defined elsewhere.
	assert.fail = fail;
	
	// 4. Pure assertion tests whether a value is truthy, as determined
	// by !!guard.
	// assert.ok(guard, message_opt);
	// This statement is equivalent to assert.equal(true, !!guard,
	// message_opt);. To test strictly for the value true, use
	// assert.strictEqual(true, guard, message_opt);.
	
	function ok(value, message) {
	  if (!value) fail(value, true, message, '==', assert.ok);
	}
	assert.ok = ok;
	
	// 5. The equality assertion tests shallow, coercive equality with
	// ==.
	// assert.equal(actual, expected, message_opt);
	
	assert.equal = function equal(actual, expected, message) {
	  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
	};
	
	// 6. The non-equality assertion tests for whether two objects are not equal
	// with != assert.notEqual(actual, expected, message_opt);
	
	assert.notEqual = function notEqual(actual, expected, message) {
	  if (actual == expected) {
	    fail(actual, expected, message, '!=', assert.notEqual);
	  }
	};
	
	// 7. The equivalence assertion tests a deep equality relation.
	// assert.deepEqual(actual, expected, message_opt);
	
	assert.deepEqual = function deepEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected, false)) {
	    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
	  }
	};
	
	assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
	  if (!_deepEqual(actual, expected, true)) {
	    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
	  }
	};
	
	function _deepEqual(actual, expected, strict, memos) {
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;
	  } else if (isBuffer(actual) && isBuffer(expected)) {
	    return compare(actual, expected) === 0;
	
	  // 7.2. If the expected value is a Date object, the actual value is
	  // equivalent if it is also a Date object that refers to the same time.
	  } else if (util.isDate(actual) && util.isDate(expected)) {
	    return actual.getTime() === expected.getTime();
	
	  // 7.3 If the expected value is a RegExp object, the actual value is
	  // equivalent if it is also a RegExp object with the same source and
	  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
	  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
	    return actual.source === expected.source &&
	           actual.global === expected.global &&
	           actual.multiline === expected.multiline &&
	           actual.lastIndex === expected.lastIndex &&
	           actual.ignoreCase === expected.ignoreCase;
	
	  // 7.4. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if ((actual === null || typeof actual !== 'object') &&
	             (expected === null || typeof expected !== 'object')) {
	    return strict ? actual === expected : actual == expected;
	
	  // If both values are instances of typed arrays, wrap their underlying
	  // ArrayBuffers in a Buffer each to increase performance
	  // This optimization requires the arrays to have the same type as checked by
	  // Object.prototype.toString (aka pToString). Never perform binary
	  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
	  // bit patterns are not identical.
	  } else if (isView(actual) && isView(expected) &&
	             pToString(actual) === pToString(expected) &&
	             !(actual instanceof Float32Array ||
	               actual instanceof Float64Array)) {
	    return compare(new Uint8Array(actual.buffer),
	                   new Uint8Array(expected.buffer)) === 0;
	
	  // 7.5 For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else if (isBuffer(actual) !== isBuffer(expected)) {
	    return false;
	  } else {
	    memos = memos || {actual: [], expected: []};
	
	    var actualIndex = memos.actual.indexOf(actual);
	    if (actualIndex !== -1) {
	      if (actualIndex === memos.expected.indexOf(expected)) {
	        return true;
	      }
	    }
	
	    memos.actual.push(actual);
	    memos.expected.push(expected);
	
	    return objEquiv(actual, expected, strict, memos);
	  }
	}
	
	function isArguments(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	}
	
	function objEquiv(a, b, strict, actualVisitedObjects) {
	  if (a === null || a === undefined || b === null || b === undefined)
	    return false;
	  // if one is a primitive, the other must be same
	  if (util.isPrimitive(a) || util.isPrimitive(b))
	    return a === b;
	  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
	    return false;
	  var aIsArgs = isArguments(a);
	  var bIsArgs = isArguments(b);
	  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
	    return false;
	  if (aIsArgs) {
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return _deepEqual(a, b, strict);
	  }
	  var ka = objectKeys(a);
	  var kb = objectKeys(b);
	  var key, i;
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length !== kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] !== kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
	      return false;
	  }
	  return true;
	}
	
	// 8. The non-equivalence assertion tests for any deep inequality.
	// assert.notDeepEqual(actual, expected, message_opt);
	
	assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected, false)) {
	    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
	  }
	};
	
	assert.notDeepStrictEqual = notDeepStrictEqual;
	function notDeepStrictEqual(actual, expected, message) {
	  if (_deepEqual(actual, expected, true)) {
	    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
	  }
	}
	
	
	// 9. The strict equality assertion tests strict equality, as determined by ===.
	// assert.strictEqual(actual, expected, message_opt);
	
	assert.strictEqual = function strictEqual(actual, expected, message) {
	  if (actual !== expected) {
	    fail(actual, expected, message, '===', assert.strictEqual);
	  }
	};
	
	// 10. The strict non-equality assertion tests for strict inequality, as
	// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);
	
	assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
	  if (actual === expected) {
	    fail(actual, expected, message, '!==', assert.notStrictEqual);
	  }
	};
	
	function expectedException(actual, expected) {
	  if (!actual || !expected) {
	    return false;
	  }
	
	  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
	    return expected.test(actual);
	  }
	
	  try {
	    if (actual instanceof expected) {
	      return true;
	    }
	  } catch (e) {
	    // Ignore.  The instanceof check doesn't work for arrow functions.
	  }
	
	  if (Error.isPrototypeOf(expected)) {
	    return false;
	  }
	
	  return expected.call({}, actual) === true;
	}
	
	function _tryBlock(block) {
	  var error;
	  try {
	    block();
	  } catch (e) {
	    error = e;
	  }
	  return error;
	}
	
	function _throws(shouldThrow, block, expected, message) {
	  var actual;
	
	  if (typeof block !== 'function') {
	    throw new TypeError('"block" argument must be a function');
	  }
	
	  if (typeof expected === 'string') {
	    message = expected;
	    expected = null;
	  }
	
	  actual = _tryBlock(block);
	
	  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
	            (message ? ' ' + message : '.');
	
	  if (shouldThrow && !actual) {
	    fail(actual, expected, 'Missing expected exception' + message);
	  }
	
	  var userProvidedMessage = typeof message === 'string';
	  var isUnwantedException = !shouldThrow && util.isError(actual);
	  var isUnexpectedException = !shouldThrow && actual && !expected;
	
	  if ((isUnwantedException &&
	      userProvidedMessage &&
	      expectedException(actual, expected)) ||
	      isUnexpectedException) {
	    fail(actual, expected, 'Got unwanted exception' + message);
	  }
	
	  if ((shouldThrow && actual && expected &&
	      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
	    throw actual;
	  }
	}
	
	// 11. Expected to throw an error:
	// assert.throws(block, Error_opt, message_opt);
	
	assert.throws = function(block, /*optional*/error, /*optional*/message) {
	  _throws(true, block, error, message);
	};
	
	// EXTENSION! This is annoying to write outside this module.
	assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
	  _throws(false, block, error, message);
	};
	
	assert.ifError = function(err) { if (err) throw err; };
	
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    if (hasOwn.call(obj, key)) keys.push(key);
	  }
	  return keys;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	module.exports = now
	
	function now() {
	    return new Date().getTime()
	}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(console, global) {'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	(function (global, factory) {
	  ( false ? 'undefined' : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) :  true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : factory(global.SiftSdkWeb = {});
	})(undefined, function (exports) {
	  'use strict';
	
	  var classCallCheck = function classCallCheck(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  };
	
	  var createClass = function () {
	    function defineProperties(target, props) {
	      for (var i = 0; i < props.length; i++) {
	        var descriptor = props[i];
	        descriptor.enumerable = descriptor.enumerable || false;
	        descriptor.configurable = true;
	        if ("value" in descriptor) descriptor.writable = true;
	        Object.defineProperty(target, descriptor.key, descriptor);
	      }
	    }
	
	    return function (Constructor, protoProps, staticProps) {
	      if (protoProps) defineProperties(Constructor.prototype, protoProps);
	      if (staticProps) defineProperties(Constructor, staticProps);
	      return Constructor;
	    };
	  }();
	
	  var inherits = function inherits(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
	    }
	
	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	  };
	
	  var possibleConstructorReturn = function possibleConstructorReturn(self, call) {
	    if (!self) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }
	
	    return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	  };
	
	  var EmailClientController = function () {
	    function EmailClientController() {
	      classCallCheck(this, EmailClientController);
	      this._proxy = self;
	      this._registerMessageListeners();
	    }
	    createClass(EmailClientController, [{
	      key: '_registerMessageListeners',
	      value: function _registerMessageListeners() {
	        var _this = this;
	        if (!this._proxy) return;
	        this._proxy.onmessage = function (e) {
	          var method = e.data.method;
	          if (_this['_' + method]) {
	            _this['_' + method](e.data.params);
	          } else {}
	        };
	      }
	    }, {
	      key: '_emailStats',
	      value: function _emailStats(stats) {
	        if (this.onstats) {
	          this.onstats(stats.name, stats.value);
	        }
	      }
	    }, {
	      key: '_getThreadRowDisplayInfo',
	      value: function _getThreadRowDisplayInfo(params) {
	        var _this2 = this;
	        var trdis = {};
	        params.tris.forEach(function (thread) {
	          if (thread.value !== undefined && thread.value.list !== undefined && _this2.loadThreadListView) {
	            trdis[thread.key] = _this2.loadThreadListView(thread.value.list, params.supportedTemplates);
	          }
	        });
	        this._proxy.postMessage({
	          method: 'getThreadRowDisplayInfoCallback',
	          params: trdis
	        });
	      }
	    }]);
	    return EmailClientController;
	  }();
	
	  var classCallCheck$1 = function classCallCheck$1(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  };
	  var createClass$1 = function () {
	    function defineProperties(target, props) {
	      for (var i = 0; i < props.length; i++) {
	        var descriptor = props[i];
	        descriptor.enumerable = descriptor.enumerable || false;
	        descriptor.configurable = true;
	        if ("value" in descriptor) descriptor.writable = true;
	        Object.defineProperty(target, descriptor.key, descriptor);
	      }
	    }
	    return function (Constructor, protoProps, staticProps) {
	      if (protoProps) defineProperties(Constructor.prototype, protoProps);
	      if (staticProps) defineProperties(Constructor, staticProps);
	      return Constructor;
	    };
	  }();
	  var Observable = function () {
	    function Observable() {
	      classCallCheck$1(this, Observable);
	      this._observers = [];
	    }
	    createClass$1(Observable, [{
	      key: 'subscribe',
	      value: function subscribe(topic, observer) {
	        this._op('_sub', topic, observer);
	      }
	    }, {
	      key: 'unsubscribe',
	      value: function unsubscribe(topic, observer) {
	        this._op('_unsub', topic, observer);
	      }
	    }, {
	      key: 'unsubscribeAll',
	      value: function unsubscribeAll(topic) {
	        if (!this._observers[topic]) {
	          return;
	        }
	        delete this._observers[topic];
	      }
	    }, {
	      key: 'publish',
	      value: function publish(topic, message) {
	        this._op('_pub', topic, message);
	      }
	    }, {
	      key: '_op',
	      value: function _op(op, topic, value) {
	        var _this = this;
	        if (Array.isArray(topic)) {
	          topic.forEach(function (t) {
	            _this[op](t, value);
	          });
	        } else {
	          this[op](topic, value);
	        }
	      }
	    }, {
	      key: '_sub',
	      value: function _sub(topic, observer) {
	        this._observers[topic] || (this._observers[topic] = []);
	        if (observer && this._observers[topic].indexOf(observer) === -1) {
	          this._observers[topic].push(observer);
	        }
	      }
	    }, {
	      key: '_unsub',
	      value: function _unsub(topic, observer) {
	        if (!this._observers[topic]) {
	          return;
	        }
	        var index = this._observers[topic].indexOf(observer);
	        if (~index) {
	          this._observers[topic].splice(index, 1);
	        }
	      }
	    }, {
	      key: '_pub',
	      value: function _pub(topic, message) {
	        if (!this._observers[topic]) {
	          return;
	        }
	        for (var i = this._observers[topic].length - 1; i >= 0; i--) {
	          this._observers[topic][i](message);
	        }
	      }
	    }]);
	    return Observable;
	  }();
	
	  var SiftView = function () {
	    function SiftView() {
	      classCallCheck(this, SiftView);
	      this._resizeHandler = null;
	      this._proxy = parent;
	      this.controller = new Observable();
	      this._registerMessageListeners();
	    }
	    createClass(SiftView, [{
	      key: 'publish',
	      value: function publish(topic, value) {
	        this._proxy.postMessage({
	          method: 'notifyController',
	          params: {
	            topic: topic,
	            value: value } }, '*');
	      }
	    }, {
	      key: 'notifyClient',
	      value: function notifyClient(topic, value) {
	        this._proxy.postMessage({
	          method: 'notifyClient',
	          params: {
	            topic: topic,
	            value: value
	          }
	        }, '*');
	      }
	    }, {
	      key: 'showOAuthPopup',
	      value: function showOAuthPopup(_ref) {
	        var provider = _ref.provider,
	            _ref$options = _ref.options,
	            options = _ref$options === undefined ? null : _ref$options;
	        var topic = 'showOAuthPopup';
	        var value = { provider: provider, options: options };
	        this.notifyClient(topic, value);
	      }
	    }, {
	      key: 'login',
	      value: function login() {
	        var topic = 'login';
	        var value = {};
	        this.notifyClient(topic, value);
	      }
	    }, {
	      key: 'logout',
	      value: function logout() {
	        var topic = 'logout';
	        var value = {};
	        this.notifyClient(topic, value);
	      }
	    }, {
	      key: 'navigate',
	      value: function navigate(_ref2) {
	        var href = _ref2.href,
	            _ref2$openInNewTab = _ref2.openInNewTab,
	            openInNewTab = _ref2$openInNewTab === undefined ? false : _ref2$openInNewTab;
	        var topic = 'navigate';
	        var value = { href: href, openInNewTab: openInNewTab };
	        this.notifyClient(topic, value);
	      }
	    }, {
	      key: '_registerMessageListeners',
	      value: function _registerMessageListeners() {
	        var _this = this;
	        window.addEventListener('message', function (e) {
	          var method = e.data.method;
	          var params = e.data.params;
	          if (method === 'notifyView') {
	            _this.controller.publish(params.topic, params.value);
	          } else if (_this[method]) {
	            _this[method](params);
	          } else {
	            console.warn('[SiftView]: method not implemented: ', method);
	          }
	        }, false);
	      }
	    }]);
	    return SiftView;
	  }();
	
	  var EmailClient = function (_Observable) {
	    inherits(EmailClient, _Observable);
	    function EmailClient(proxy) {
	      classCallCheck(this, EmailClient);
	      var _this = possibleConstructorReturn(this, (EmailClient.__proto__ || Object.getPrototypeOf(EmailClient)).call(this));
	      _this._proxy = proxy;
	      return _this;
	    }
	    createClass(EmailClient, [{
	      key: 'goto',
	      value: function goto(params) {
	        this._postMessage('goto', params);
	      }
	    }, {
	      key: 'close',
	      value: function close() {
	        this._postMessage('close');
	      }
	    }, {
	      key: '_postMessage',
	      value: function _postMessage(topic, value) {
	        this._proxy.postMessage({
	          method: 'notifyClient',
	          params: {
	            topic: topic,
	            value: value
	          }
	        });
	      }
	    }]);
	    return EmailClient;
	  }(Observable);
	
	  var SiftStorage = function (_Observable) {
	    inherits(SiftStorage, _Observable);
	    function SiftStorage() {
	      classCallCheck(this, SiftStorage);
	      var _this = possibleConstructorReturn(this, (SiftStorage.__proto__ || Object.getPrototypeOf(SiftStorage)).call(this));
	      _this._storage = null;
	      return _this;
	    }
	    createClass(SiftStorage, [{
	      key: 'init',
	      value: function init(storage) {
	        this._storage = storage;
	      }
	    }, {
	      key: 'get',
	      value: function get$$1(d) {
	        return this._storage.get(d);
	      }
	    }, {
	      key: 'getIndexKeys',
	      value: function getIndexKeys(d) {
	        return this._storage.getIndexKeys(d);
	      }
	    }, {
	      key: 'getIndex',
	      value: function getIndex(d) {
	        return this._storage.getIndex(d);
	      }
	    }, {
	      key: 'getWithIndex',
	      value: function getWithIndex(d) {
	        return this._storage.getWithIndex(d);
	      }
	    }, {
	      key: 'getAllKeys',
	      value: function getAllKeys(d) {
	        return this._storage.getAllKeys(d);
	      }
	    }, {
	      key: 'getAll',
	      value: function getAll(d) {
	        return this._storage.getAll(d);
	      }
	    }, {
	      key: 'getUser',
	      value: function getUser(d) {
	        return this._storage.getUser(d);
	      }
	    }, {
	      key: 'putUser',
	      value: function putUser(d) {
	        return this._storage.putUser(d);
	      }
	    }, {
	      key: 'delUser',
	      value: function delUser(d) {
	        return this._storage.delUser(d);
	      }
	    }]);
	    return SiftStorage;
	  }(Observable);
	
	  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
	  function unwrapExports(x) {
	    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	  }
	  function createCommonjsModule(fn, module) {
	    return module = { exports: {} }, fn(module, module.exports), module.exports;
	  }
	  var loglevel = createCommonjsModule(function (module) {
	    (function (root, definition) {
	      if (false) {
	        undefined(definition);
	      } else if ('object' === 'object' && module.exports) {
	        module.exports = definition();
	      } else {
	        root.log = definition();
	      }
	    })(commonjsGlobal, function () {
	      var noop = function noop() {};
	      var undefinedType = "undefined";
	      var logMethods = ["trace", "debug", "info", "warn", "error"];
	      function bindMethod(obj, methodName) {
	        var method = obj[methodName];
	        if (typeof method.bind === 'function') {
	          return method.bind(obj);
	        } else {
	          try {
	            return Function.prototype.bind.call(method, obj);
	          } catch (e) {
	            return function () {
	              return Function.prototype.apply.apply(method, [obj, arguments]);
	            };
	          }
	        }
	      }
	      function realMethod(methodName) {
	        if (methodName === 'debug') {
	          methodName = 'log';
	        }
	        if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) === undefinedType) {
	          return false;
	        } else if (console[methodName] !== undefined) {
	          return bindMethod(console, methodName);
	        } else if (console.log !== undefined) {
	          return bindMethod(console, 'log');
	        } else {
	          return noop;
	        }
	      }
	      function replaceLoggingMethods(level, loggerName) {
	        for (var i = 0; i < logMethods.length; i++) {
	          var methodName = logMethods[i];
	          this[methodName] = i < level ? noop : this.methodFactory(methodName, level, loggerName);
	        }
	        this.log = this.debug;
	      }
	      function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
	        return function () {
	          if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) !== undefinedType) {
	            replaceLoggingMethods.call(this, level, loggerName);
	            this[methodName].apply(this, arguments);
	          }
	        };
	      }
	      function defaultMethodFactory(methodName, level, loggerName) {
	        return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
	      }
	      function Logger(name, defaultLevel, factory) {
	        var self = this;
	        var currentLevel;
	        var storageKey = "loglevel";
	        if (name) {
	          storageKey += ":" + name;
	        }
	        function persistLevelIfPossible(levelNum) {
	          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();
	          if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === undefinedType) return;
	          try {
	            window.localStorage[storageKey] = levelName;
	            return;
	          } catch (ignore) {}
	          try {
	            window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
	          } catch (ignore) {}
	        }
	        function getPersistedLevel() {
	          var storedLevel;
	          if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === undefinedType) return;
	          try {
	            storedLevel = window.localStorage[storageKey];
	          } catch (ignore) {}
	          if ((typeof storedLevel === 'undefined' ? 'undefined' : _typeof(storedLevel)) === undefinedType) {
	            try {
	              var cookie = window.document.cookie;
	              var location = cookie.indexOf(encodeURIComponent(storageKey) + "=");
	              if (location !== -1) {
	                storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
	              }
	            } catch (ignore) {}
	          }
	          if (self.levels[storedLevel] === undefined) {
	            storedLevel = undefined;
	          }
	          return storedLevel;
	        }
	        self.name = name;
	        self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
	          "ERROR": 4, "SILENT": 5 };
	        self.methodFactory = factory || defaultMethodFactory;
	        self.getLevel = function () {
	          return currentLevel;
	        };
	        self.setLevel = function (level, persist) {
	          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
	            level = self.levels[level.toUpperCase()];
	          }
	          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
	            currentLevel = level;
	            if (persist !== false) {
	              persistLevelIfPossible(level);
	            }
	            replaceLoggingMethods.call(self, level, name);
	            if ((typeof console === 'undefined' ? 'undefined' : _typeof(console)) === undefinedType && level < self.levels.SILENT) {
	              return "No console available for logging";
	            }
	          } else {
	            throw "log.setLevel() called with invalid level: " + level;
	          }
	        };
	        self.setDefaultLevel = function (level) {
	          if (!getPersistedLevel()) {
	            self.setLevel(level, false);
	          }
	        };
	        self.enableAll = function (persist) {
	          self.setLevel(self.levels.TRACE, persist);
	        };
	        self.disableAll = function (persist) {
	          self.setLevel(self.levels.SILENT, persist);
	        };
	        var initialLevel = getPersistedLevel();
	        if (initialLevel == null) {
	          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
	        }
	        self.setLevel(initialLevel, false);
	      }
	      var defaultLogger = new Logger();
	      var _loggersByName = {};
	      defaultLogger.getLogger = function getLogger(name) {
	        if (typeof name !== "string" || name === "") {
	          throw new TypeError("You must supply a name when creating a logger.");
	        }
	        var logger = _loggersByName[name];
	        if (!logger) {
	          logger = _loggersByName[name] = new Logger(name, defaultLogger.getLevel(), defaultLogger.methodFactory);
	        }
	        return logger;
	      };
	      var _log = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== undefinedType ? window.log : undefined;
	      defaultLogger.noConflict = function () {
	        if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== undefinedType && window.log === defaultLogger) {
	          window.log = _log;
	        }
	        return defaultLogger;
	      };
	      defaultLogger.getLoggers = function getLoggers() {
	        return _loggersByName;
	      };
	      return defaultLogger;
	    });
	  });
	  var toString = Object.prototype.toString;
	  var componentType = function componentType(val) {
	    switch (toString.call(val)) {
	      case '[object Date]':
	        return 'date';
	      case '[object RegExp]':
	        return 'regexp';
	      case '[object Arguments]':
	        return 'arguments';
	      case '[object Array]':
	        return 'array';
	      case '[object Error]':
	        return 'error';
	    }
	    if (val === null) return 'null';
	    if (val === undefined) return 'undefined';
	    if (val !== val) return 'nan';
	    if (val && val.nodeType === 1) return 'element';
	    val = val.valueOf ? val.valueOf() : Object.prototype.valueOf.apply(val);
	    return typeof val === 'undefined' ? 'undefined' : _typeof(val);
	  };
	  var toString$1 = Object.prototype.toString;
	  var isPlainObj = function isPlainObj(x) {
	    var prototype;
	    return toString$1.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
	  };
	  var lib = createCommonjsModule(function (module, exports) {
	    Object.defineProperty(exports, "__esModule", {
	      value: true
	    });
	    exports.default = range;
	    var _isPlainObj2 = _interopRequireDefault(isPlainObj);
	    function _interopRequireDefault(obj) {
	      return obj && obj.__esModule ? obj : { default: obj };
	    }
	    function range(opts) {
	      var IDBKeyRange = commonjsGlobal.IDBKeyRange || commonjsGlobal.webkitIDBKeyRange;
	      if (opts instanceof IDBKeyRange) return opts;
	      if (typeof opts === 'undefined' || opts === null) return null;
	      if (!(0, _isPlainObj2.default)(opts)) return IDBKeyRange.only(opts);
	      var keys = Object.keys(opts).sort();
	      if (keys.length === 1) {
	        var key = keys[0];
	        var val = opts[key];
	        switch (key) {
	          case 'eq':
	            return IDBKeyRange.only(val);
	          case 'gt':
	            return IDBKeyRange.lowerBound(val, true);
	          case 'lt':
	            return IDBKeyRange.upperBound(val, true);
	          case 'gte':
	            return IDBKeyRange.lowerBound(val);
	          case 'lte':
	            return IDBKeyRange.upperBound(val);
	          default:
	            throw new TypeError('"' + key + '" is not valid key');
	        }
	      } else {
	        var x = opts[keys[0]];
	        var y = opts[keys[1]];
	        var pattern = keys.join('-');
	        switch (pattern) {
	          case 'gt-lt':
	            return IDBKeyRange.bound(x, y, true, true);
	          case 'gt-lte':
	            return IDBKeyRange.bound(x, y, true, false);
	          case 'gte-lt':
	            return IDBKeyRange.bound(x, y, false, true);
	          case 'gte-lte':
	            return IDBKeyRange.bound(x, y, false, false);
	          default:
	            throw new TypeError('"' + pattern + '" are conflicted keys');
	        }
	      }
	    }
	    module.exports = exports['default'];
	  });
	  unwrapExports(lib);
	  var idbStore = Store;
	  function Store(name, opts) {
	    this.db = null;
	    this.name = name;
	    this.indexes = {};
	    this.opts = opts;
	    this.key = opts.key || opts.keyPath || undefined;
	    this.increment = opts.increment || opts.autoIncretement || undefined;
	  }
	  Store.prototype.index = function (name) {
	    return this.indexes[name];
	  };
	  Store.prototype.put = function (key, val, cb) {
	    var name = this.name;
	    var keyPath = this.key;
	    if (keyPath) {
	      if (componentType(key) == 'object') {
	        cb = val;
	        val = key;
	        key = null;
	      } else {
	        val[keyPath] = key;
	      }
	    }
	    this.db.transaction('readwrite', [name], function (err, tr) {
	      if (err) return cb(err);
	      var objectStore = tr.objectStore(name);
	      var req = keyPath ? objectStore.put(val) : objectStore.put(val, key);
	      tr.onerror = tr.onabort = req.onerror = cb;
	      tr.oncomplete = function oncomplete() {
	        cb(null, req.result);
	      };
	    });
	  };
	  Store.prototype.get = function (key, cb) {
	    var name = this.name;
	    this.db.transaction('readonly', [name], function (err, tr) {
	      if (err) return cb(err);
	      var objectStore = tr.objectStore(name);
	      var req = objectStore.get(key);
	      req.onerror = cb;
	      req.onsuccess = function onsuccess(e) {
	        cb(null, e.target.result);
	      };
	    });
	  };
	  Store.prototype.del = function (key, cb) {
	    var name = this.name;
	    this.db.transaction('readwrite', [name], function (err, tr) {
	      if (err) return cb(err);
	      var objectStore = tr.objectStore(name);
	      var req = objectStore.delete(key);
	      tr.onerror = tr.onabort = req.onerror = cb;
	      tr.oncomplete = function oncomplete() {
	        cb();
	      };
	    });
	  };
	  Store.prototype.count = function (cb) {
	    var name = this.name;
	    this.db.transaction('readonly', [name], function (err, tr) {
	      if (err) return cb(err);
	      var objectStore = tr.objectStore(name);
	      var req = objectStore.count();
	      req.onerror = cb;
	      req.onsuccess = function onsuccess(e) {
	        cb(null, e.target.result);
	      };
	    });
	  };
	  Store.prototype.clear = function (cb) {
	    var name = this.name;
	    this.db.transaction('readwrite', [name], function (err, tr) {
	      if (err) return cb(err);
	      var objectStore = tr.objectStore(name);
	      var req = objectStore.clear();
	      tr.onerror = tr.onabort = req.onerror = cb;
	      tr.oncomplete = function oncomplete() {
	        cb();
	      };
	    });
	  };
	  Store.prototype.batch = function (vals, cb) {
	    var name = this.name;
	    var keyPath = this.key;
	    var keys = Object.keys(vals);
	    this.db.transaction('readwrite', [name], function (err, tr) {
	      if (err) return cb(err);
	      var store = tr.objectStore(name);
	      var current = 0;
	      tr.onerror = tr.onabort = cb;
	      tr.oncomplete = function oncomplete() {
	        cb();
	      };
	      next();
	      function next() {
	        if (current >= keys.length) return;
	        var currentKey = keys[current];
	        var currentVal = vals[currentKey];
	        var req;
	        if (currentVal === null) {
	          req = store.delete(currentKey);
	        } else if (keyPath) {
	          if (!currentVal[keyPath]) currentVal[keyPath] = currentKey;
	          req = store.put(currentVal);
	        } else {
	          req = store.put(currentVal, currentKey);
	        }
	        req.onerror = cb;
	        req.onsuccess = next;
	        current += 1;
	      }
	    });
	  };
	  Store.prototype.all = function (cb) {
	    var result = [];
	    this.cursor({ iterator: iterator }, function (err) {
	      err ? cb(err) : cb(null, result);
	    });
	    function iterator(cursor) {
	      result.push(cursor.value);
	      cursor.continue();
	    }
	  };
	  Store.prototype.cursor = function (opts, cb) {
	    var name = this.name;
	    this.db.transaction('readonly', [name], function (err, tr) {
	      if (err) return cb(err);
	      var store = opts.index ? tr.objectStore(name).index(opts.index) : tr.objectStore(name);
	      var req = store.openCursor(lib(opts.range));
	      req.onerror = cb;
	      req.onsuccess = function onsuccess(e) {
	        var cursor = e.target.result;
	        cursor ? opts.iterator(cursor) : cb();
	      };
	    });
	  };
	  var idbIndex = Index;
	  function Index(store, name, field, opts) {
	    this.store = store;
	    this.name = name;
	    this.field = field;
	    this.opts = opts;
	    this.multi = opts.multi || opts.multiEntry || false;
	    this.unique = opts.unique || false;
	  }
	  Index.prototype.get = function (key, cb) {
	    var result = [];
	    var isUnique = this.unique;
	    var opts = { range: key, iterator: iterator };
	    this.cursor(opts, function (err) {
	      if (err) return cb(err);
	      isUnique ? cb(null, result[0]) : cb(null, result);
	    });
	    function iterator(cursor) {
	      result.push(cursor.value);
	      cursor.continue();
	    }
	  };
	  Index.prototype.count = function (key, cb) {
	    var name = this.store.name;
	    var indexName = this.name;
	    this.store.db.transaction('readonly', [name], function (err, tr) {
	      if (err) return cb(err);
	      var index = tr.objectStore(name).index(indexName);
	      var req = index.count(lib(key));
	      req.onerror = cb;
	      req.onsuccess = function onsuccess(e) {
	        cb(null, e.target.result);
	      };
	    });
	  };
	  Index.prototype.cursor = function (opts, cb) {
	    opts.index = this.name;
	    this.store.cursor(opts, cb);
	  };
	  var schema = Schema;
	  function Schema() {
	    if (!(this instanceof Schema)) return new Schema();
	    this._stores = {};
	    this._current = {};
	    this._versions = {};
	  }
	  Schema.prototype.version = function (version) {
	    if (componentType(version) != 'number' || version < 1 || version < this.getVersion()) throw new TypeError('not valid version');
	    this._current = { version: version, store: null };
	    this._versions[version] = {
	      stores: [],
	      dropStores: [],
	      indexes: [],
	      dropIndexes: [],
	      version: version
	    };
	    return this;
	  };
	  Schema.prototype.addStore = function (name, opts) {
	    if (componentType(name) != 'string') throw new TypeError('`name` is required');
	    if (this._stores[name]) throw new TypeError('store is already defined');
	    var store = new idbStore(name, opts || {});
	    this._stores[name] = store;
	    this._versions[this.getVersion()].stores.push(store);
	    this._current.store = store;
	    return this;
	  };
	  Schema.prototype.dropStore = function (name) {
	    if (componentType(name) != 'string') throw new TypeError('`name` is required');
	    var store = this._stores[name];
	    if (!store) throw new TypeError('store is not defined');
	    delete this._stores[name];
	    this._versions[this.getVersion()].dropStores.push(store);
	    return this;
	  };
	  Schema.prototype.addIndex = function (name, field, opts) {
	    if (componentType(name) != 'string') throw new TypeError('`name` is required');
	    if (componentType(field) != 'string' && componentType(field) != 'array') throw new TypeError('`field` is required');
	    var store = this._current.store;
	    if (store.indexes[name]) throw new TypeError('index is already defined');
	    var index = new idbIndex(store, name, field, opts || {});
	    store.indexes[name] = index;
	    this._versions[this.getVersion()].indexes.push(index);
	    return this;
	  };
	  Schema.prototype.dropIndex = function (name) {
	    if (componentType(name) != 'string') throw new TypeError('`name` is required');
	    var index = this._current.store.indexes[name];
	    if (!index) throw new TypeError('index is not defined');
	    delete this._current.store.indexes[name];
	    this._versions[this.getVersion()].dropIndexes.push(index);
	    return this;
	  };
	  Schema.prototype.getStore = function (name) {
	    if (componentType(name) != 'string') throw new TypeError('`name` is required');
	    if (!this._stores[name]) throw new TypeError('store is not defined');
	    this._current.store = this._stores[name];
	    return this;
	  };
	  Schema.prototype.getVersion = function () {
	    return this._current.version;
	  };
	  Schema.prototype.callback = function () {
	    var versions = Object.keys(this._versions).map(function (v) {
	      return this._versions[v];
	    }, this).sort(function (a, b) {
	      return a.version - b.version;
	    });
	    return function onupgradeneeded(e) {
	      var db = e.target.result;
	      var tr = e.target.transaction;
	      versions.forEach(function (versionSchema) {
	        if (e.oldVersion >= versionSchema.version) return;
	        versionSchema.stores.forEach(function (s) {
	          var options = {};
	          if (typeof s.key !== 'undefined') options.keyPath = s.key;
	          if (typeof s.increment !== 'undefined') options.autoIncrement = s.increment;
	          db.createObjectStore(s.name, options);
	        });
	        versionSchema.dropStores.forEach(function (s) {
	          db.deleteObjectStore(s.name);
	        });
	        versionSchema.indexes.forEach(function (i) {
	          var store = tr.objectStore(i.store.name);
	          store.createIndex(i.name, i.field, {
	            unique: i.unique,
	            multiEntry: i.multi
	          });
	        });
	        versionSchema.dropIndexes.forEach(function (i) {
	          var store = tr.objectStore(i.store.name);
	          store.deleteIndex(i.name);
	        });
	      });
	    };
	  };
	  var lib$1 = createCommonjsModule(function (module, exports) {
	    exports = module.exports = Treo;
	    function Treo(name, schema$$1) {
	      if (!(this instanceof Treo)) return new Treo(name, schema$$1);
	      if (componentType(name) != 'string') throw new TypeError('`name` required');
	      if (!(schema$$1 instanceof schema)) throw new TypeError('not valid schema');
	      this.name = name;
	      this.status = 'close';
	      this.origin = null;
	      this.stores = schema$$1._stores;
	      this.version = schema$$1.getVersion();
	      this.onupgradeneeded = schema$$1.callback();
	      Object.keys(this.stores).forEach(function (storeName) {
	        this.stores[storeName].db = this;
	      }, this);
	    }
	    exports.schema = schema;
	    exports.cmp = cmp;
	    exports.Treo = Treo;
	    exports.Schema = schema;
	    exports.Store = idbStore;
	    exports.Index = idbIndex;
	    Treo.prototype.use = function (fn) {
	      fn(this, exports);
	      return this;
	    };
	    Treo.prototype.drop = function (cb) {
	      var name = this.name;
	      this.close(function (err) {
	        if (err) return cb(err);
	        var req = indexedDB().deleteDatabase(name);
	        req.onerror = cb;
	        req.onsuccess = function onsuccess() {
	          cb();
	        };
	      });
	    };
	    Treo.prototype.close = function (cb) {
	      if (this.status == 'close') return cb();
	      this.getInstance(function (err, db) {
	        if (err) return cb(err);
	        db.origin = null;
	        db.status = 'close';
	        db.close();
	        cb();
	      });
	    };
	    Treo.prototype.store = function (name) {
	      return this.stores[name];
	    };
	    Treo.prototype.getInstance = function (cb) {
	      if (this.status == 'open') return cb(null, this.origin);
	      if (this.status == 'opening') return this.queue.push(cb);
	      this.status = 'opening';
	      this.queue = [cb];
	      var that = this;
	      var req = indexedDB().open(this.name, this.version);
	      req.onupgradeneeded = this.onupgradeneeded;
	      req.onerror = req.onblocked = function onerror(e) {
	        that.status = 'error';
	        that.queue.forEach(function (cb) {
	          cb(e);
	        });
	        delete that.queue;
	      };
	      req.onsuccess = function onsuccess(e) {
	        that.origin = e.target.result;
	        that.status = 'open';
	        that.origin.onversionchange = function onversionchange() {
	          that.close(function () {});
	        };
	        that.queue.forEach(function (cb) {
	          cb(null, that.origin);
	        });
	        delete that.queue;
	      };
	    };
	    Treo.prototype.transaction = function (type, stores, cb) {
	      this.getInstance(function (err, db) {
	        err ? cb(err) : cb(null, db.transaction(stores, type));
	      });
	    };
	    function cmp() {
	      return indexedDB().cmp.apply(indexedDB(), arguments);
	    }
	    function indexedDB() {
	      return commonjsGlobal._indexedDB || commonjsGlobal.indexedDB || commonjsGlobal.msIndexedDB || commonjsGlobal.mozIndexedDB || commonjsGlobal.webkitIndexedDB;
	    }
	  });
	  var lib_1 = lib$1.schema;
	  var lib_2 = lib$1.cmp;
	  var lib_3 = lib$1.Treo;
	  var lib_4 = lib$1.Schema;
	  var lib_5 = lib$1.Store;
	  var lib_6 = lib$1.Index;
	  var logger = loglevel.getLogger('RSStorage:operations');
	  logger.setLevel('warn');
	  var EMAIL_BUCKETS = ['_email.id', '_email.tid'];
	  var MSG_DB_VERSIONED_SCHEMA = [[{ name: '_id.list', indexes: ['sift.guid'] }, { name: '_tid.list', indexes: ['sift.guid'] }], [{ name: '_email.id', indexes: ['sift.guid'] }, { name: '_email.tid', indexes: ['sift.guid'] }, { name: '_id.list', drop: true }, { name: '_tid.list', drop: true }]];
	  var SYNC_DB_SCHEMA = [{ name: 'events', indexes: ['value.sift.guid'] }, { name: 'admin' }];
	  var CLIENT_DB_SCHEMA = [{ name: 'tour' }, { name: 'spm' }, { name: 'auth' }];
	  function opCreateDb(dbInfo) {
	    logger.trace('[opCreateDb]: ', dbInfo);
	    var dbs = {};
	    switch (dbInfo.type) {
	      case 'MSG':
	        dbs.msg = lib$1('rs_msg_db-' + dbInfo.accountGuid, _getVersionedTreoSchema(MSG_DB_VERSIONED_SCHEMA));
	        break;
	      case 'SIFT':
	        if (!dbInfo.siftGuid) {
	          throw new Error('[opCreateDb]: dbInfo.siftGuid undefined');
	        }
	        logger.trace('[opCreateDb]: creating SIFT db');
	        var schema = _getTreoSchema(dbInfo.schema, true);
	        schema = schema.addStore('_user.default').addStore('_redsift').addStore('_org');
	        dbs.db = lib$1(dbInfo.siftGuid + '-' + dbInfo.accountGuid, schema);
	        dbs.msg = lib$1('rs_msg_db-' + dbInfo.accountGuid, _getVersionedTreoSchema(MSG_DB_VERSIONED_SCHEMA));
	        break;
	      case 'SYNC':
	        logger.trace('[opCreateDb]: creating SYNC db');
	        dbs.db = lib$1('rs_sync_log-' + dbInfo.accountGuid, _getTreoSchema(SYNC_DB_SCHEMA));
	        break;
	      case 'CLIENT':
	        dbs.db = lib$1('rs_client_db-' + dbInfo.clientName, _getTreoSchema(CLIENT_DB_SCHEMA));
	        break;
	      default:
	        throw new Error('[opCreateDb]: unsupported db type: ' + dbInfo.type);
	    }
	    return dbs;
	  }
	  function opCursor(db, params, done) {
	    logger.trace('[opCursor]', params);
	    if (!params.bucket) {
	      throw new Error('[opCursor: params.bucket undefined');
	    } else {
	      var bucket = db.store(params.bucket);
	      bucket.cursor({ iterator: params.iterator }, done);
	    }
	  }
	  function opDeleteDatabase(db) {
	    logger.trace('[opDeleteDatabase]');
	    return new Promise(function (resolve, reject) {
	      db.drop(function (err) {
	        if (!err) {
	          resolve();
	        } else {
	          reject(err);
	        }
	      });
	    });
	  }
	  function opDel(dbs, params, siftGuid) {
	    logger.trace('[opDel]: ', params, siftGuid);
	    if (!params.bucket) {
	      return Promise.reject('[opDel]: params.bucket undefined');
	    }
	    if (!params.keys || params.keys.length === 0) {
	      logger.trace('[opDel]: params.keys undefined');
	      return Promise.resolve();
	    }
	    if (EMAIL_BUCKETS.indexOf(params.bucket) !== -1) {
	      var keys = params.keys.map(function (k) {
	        return siftGuid + '/' + k;
	      });
	      return _batchDelete(dbs.msg, { bucket: params.bucket, keys: keys });
	    }
	    return _batchDelete(dbs.db, params);
	  }
	  function opGet(dbs, params, siftGuid) {
	    logger.trace('[opGet]: ', params);
	    if (!params.bucket) {
	      return Promise.reject('[opGet]: params.bucket undefined');
	    }
	    if (!params.keys) {
	      return Promise.reject('[opGet]: param.keys undefined');
	    }
	    if (params.keys.length === 0) {
	      return Promise.resolve([]);
	    }
	    if (EMAIL_BUCKETS.indexOf(params.bucket) !== -1) {
	      var keys = params.keys.map(function (k) {
	        return siftGuid + '/' + k;
	      });
	      return _findIn(dbs.msg, { bucket: params.bucket, keys: keys }).then(function (result) {
	        return result.map(function (r) {
	          return { key: r.key.split('/')[1], value: r.value };
	        });
	      });
	    }
	    return _findIn(dbs.db, params);
	  }
	  function opGetAll(dbs, params, siftGuid) {
	    logger.trace('[opGetAll]: ', params, siftGuid);
	    if (!params.bucket) {
	      return Promise.reject('[opGetAll]: params.bucket undefined');
	    }
	    if (EMAIL_BUCKETS.indexOf(params.bucket) !== -1) {
	      return _getAll(dbs.msg, { bucket: params.bucket, index: 'sift.guid', range: siftGuid }, true).then(function (result) {
	        return result.map(function (r) {
	          return { key: r.key.split('/')[1], value: r.value };
	        });
	      });
	    }
	    return _getAll(dbs.db, params, true);
	  }
	  function opGetAllKeys(dbs, params, siftGuid) {
	    logger.trace('[opGetAllKeys]: ', params, siftGuid);
	    if (!params.bucket) {
	      return Promise.reject('[opGetAllKeys]: params.bucket undefined');
	    }
	    if (EMAIL_BUCKETS.indexOf(params.bucket) !== -1) {
	      return _getAll(dbs.msg, { bucket: params.bucket, index: 'sift.guid', range: siftGuid }, false).then(function (result) {
	        return result.map(function (r) {
	          return r.key.split('/')[1];
	        });
	      });
	    }
	    return _getAll(dbs.db, params, false);
	  }
	  function opGetIndex(dbs, params, siftGuid) {
	    logger.trace('[opGetIndex]: ', params, siftGuid);
	    if (!params.bucket) {
	      return Promise.reject('[opGetIndex]:params.bucket undefined');
	    }
	    if (EMAIL_BUCKETS.indexOf(params.bucket) !== -1) {
	      return _getAll(dbs.msg, { bucket: params.bucket, index: 'sift.guid', range: siftGuid }, true).then(function (result) {
	        return result.map(function (r) {
	          return { key: r.key.split('/')[1], value: r.value };
	        });
	      });
	    }
	    if (!params.index) {
	      return Promise.reject('[opGetIndex]:params.index undefined');
	    }
	    return _getAll(dbs.db, params, true);
	  }
	  function opGetIndexKeys(dbs, params, siftGuid) {
	    logger.trace('[opGetIndexKeys]: ', params, siftGuid);
	    if (!params.bucket) {
	      return Promise.reject('[opGetIndexKeys]: params.bucket undefined');
	    }
	    if (EMAIL_BUCKETS.indexOf(params.bucket) !== -1) {
	      return _getAll(dbs.msg, { bucket: params.bucket, index: 'sift.guid', range: siftGuid }, false).then(function (result) {
	        return result.map(function (r) {
	          return { key: r.key.split('/')[1], value: r.value };
	        });
	      });
	    }
	    if (!params.index) {
	      return Promise.reject('[opGetIndexKeys]: params.index undefined');
	    }
	    return _getAll(dbs.db, params, false);
	  }
	  function opGetWithIndex(dbs, params, siftGuid) {
	    logger.trace('[opGetWithIndex]: ', params, siftGuid);
	    if (!params.bucket) {
	      return Promise.reject('[opGetWithIndex]:params.bucket undefined');
	    }
	    if (!params.keys) {
	      return Promise.reject('[opGetWithIndex]:params.keys undefined');
	    }
	    if (EMAIL_BUCKETS.indexOf(params.bucket) !== -1) {
	      var keys = params.keys.map(function (k) {
	        return siftGuid + '/' + k;
	      });
	      return _getWithIndexRange(dbs.msg, { bucket: params.bucket, keys: keys, index: 'sift.guid', range: siftGuid }).then(function (result) {
	        return result.map(function (r) {
	          return { key: r.key.split('/')[1], value: r.value };
	        });
	      });
	    }
	    if (!params.index) {
	      return Promise.reject('[opGetWithIndex]:params.index undefined');
	    }
	    if (!params.range) {
	      return Promise.reject('[opGetWithIndex]:params.range undefined');
	    }
	    return _getWithIndexRange(dbs.db, params);
	  }
	  function opPut(dbs, params, raw, siftGuid) {
	    logger.trace('[opPut]: ', params, raw, siftGuid);
	    var db = dbs.db;
	    if (!params.bucket) {
	      return Promise.reject('[opPut]: params.bucket undefined');
	    }
	    if (!params.kvs || params.kvs.length === 0) {
	      logger.warn('[opPut]: params.kvs undefined');
	      return Promise.resolve();
	    }
	    var kvs = params.kvs;
	    if (!raw) {
	      kvs = kvs.map(function (kv) {
	        return { key: kv.key, value: { value: kv.value } };
	      });
	    }
	    if (EMAIL_BUCKETS.indexOf(params.bucket) !== -1) {
	      db = dbs.msg;
	      var kvs = kvs.map(function (kv) {
	        return { key: siftGuid + '/' + kv.key, value: kv.value };
	      });
	    }
	    return _batchPut(db, { bucket: params.bucket, kvs: kvs }, raw);
	  }
	  function opClose(dbs, cb) {
	    logger.trace('[opClose]');
	    if (!cb) {
	      cb = function cb() {};
	    }
	    dbs.db.close(cb);
	  }
	  function _getTreoSchema(stores, sift) {
	    logger.trace('[_getTreoSchema]: ', stores, sift);
	    var schema = lib$1.schema().version(1);
	    stores.forEach(function (os) {
	      if (!(sift && EMAIL_BUCKETS.indexOf(os.name) !== -1)) {
	        if (os.keypath) {
	          schema = schema.addStore(os.name, { key: os.keypath });
	        } else {
	          schema = schema.addStore(os.name);
	        }
	        if (os.indexes) {
	          os.indexes.forEach(function (idx) {
	            schema = schema.addIndex(idx, 'twoI.' + idx, { unique: false });
	          });
	        }
	      }
	    });
	    return schema;
	  }
	  function _getVersionedTreoSchema(versions, sift) {
	    logger.trace('[_getVersionedTreoSchema]: ', versions, sift);
	    var schema = lib$1.schema();
	    versions.forEach(function (stores, i) {
	      schema = schema.version(i + 1);
	      stores.forEach(function (os) {
	        if (!(sift && EMAIL_BUCKETS.indexOf(os.name) !== -1)) {
	          if (os.drop) {
	            logger.trace('[_getVersionedTreoSchema]: dropping store: ', os.name);
	            schema = schema.dropStore(os.name);
	          } else if (os.keypath) {
	            schema = schema.addStore(os.name, { key: os.keypath });
	          } else {
	            schema = schema.addStore(os.name);
	          }
	          if (os.indexes) {
	            os.indexes.forEach(function (idx) {
	              if (os.drop) {
	                logger.trace('[_getVersionedTreoSchema]: dropping store/index: ' + os.name + '/' + idx);
	                schema = schema.dropIndex(idx);
	              } else {
	                schema = schema.addIndex(idx, idx, { unique: false });
	              }
	            });
	          }
	        }
	      });
	    });
	    return schema;
	  }
	  function _batchDelete(db, params) {
	    logger.trace('[_batchDelete]: ', params);
	    return new Promise(function (resolve, reject) {
	      db.transaction('readwrite', [params.bucket], function (err, tr) {
	        if (err) {
	          return reject(err);
	        }
	        var store = tr.objectStore(params.bucket);
	        var current = 0;
	        var next = function next() {
	          if (current >= params.keys.length) {
	            return;
	          }
	          var currentKey = params.keys[current];
	          var req;
	          req = store.delete(currentKey);
	          req.onerror = reject;
	          req.onsuccess = next;
	          current += 1;
	        };
	        tr.onerror = tr.onabort = reject;
	        tr.oncomplete = function () {
	          resolve();
	        };
	        next();
	      });
	    });
	  }
	  function _batchPut(db, params) {
	    logger.trace('[_batchPut]: ', params);
	    return new Promise(function (resolve, reject) {
	      var count = params.kvs.length;
	      db.transaction('readwrite', [params.bucket], function (err, tr) {
	        if (err) {
	          return reject(err);
	        }
	        var store = tr.objectStore(params.bucket);
	        var current = 0;
	        var next = function next() {
	          if (current >= count) {
	            return;
	          }
	          logger.trace('[_batchPut: put: ', params.kvs[current]);
	          var req;
	          req = store.put(params.kvs[current].value, params.kvs[current].key);
	          req.onerror = reject;
	          req.onsuccess = next;
	          current += 1;
	        };
	        tr.onerror = tr.onabort = reject;
	        tr.oncomplete = function () {
	          resolve();
	        };
	        next();
	      });
	    });
	  }
	  function _getWithIndexRange(db, params) {
	    logger.trace('[_getWithIndexRange]: ', params);
	    return new Promise(function (resolve, reject) {
	      var store = db.store(params.bucket);
	      var result = [];
	      var found = 0;
	      var iterator = function iterator(cursor) {
	        var ki = params.keys.indexOf(cursor.primaryKey);
	        if (ki !== -1) {
	          logger.trace('[found key: ', cursor.primaryKey);
	          result[ki].value = cursor.value.value;
	          found++;
	        }
	        if (found === params.keys.length) {
	          return done();
	        }
	        cursor.continue();
	      };
	      var done = function done(err) {
	        logger.trace('[_getWithIndexRange: result: ', result);
	        err ? reject(err) : resolve(result);
	      };
	      params.keys.forEach(function (k) {
	        result.push({ key: k, value: undefined });
	      });
	      store.cursor({ index: params.index, range: params.range, iterator: iterator }, done);
	    });
	  }
	  function _findIn(db, params) {
	    logger.trace('[_findIn]: ', params);
	    return new Promise(function (resolve, reject) {
	      var store = db.store(params.bucket);
	      var result = [];
	      var current = 0;
	      var iterator = function iterator(cursor) {
	        logger.trace('[_findIn]: iterator: ', cursor);
	        if (cursor.key > sKeys[current]) {
	          logger.trace('[_findIn]: cursor ahead: ', cursor.key, sKeys[current]);
	          while (cursor.key > sKeys[current] && current < sKeys.length) {
	            current += 1;
	            logger.trace('[_findIn]: moving to next key: ', cursor.key, sKeys[current]);
	          }
	          if (current > sKeys.length) {
	            logger.trace('[_findIn]: exhausted keys. done.');
	            return done();
	          }
	        }
	        if (cursor.key === sKeys[current]) {
	          logger.trace('[_findIn]: found key: ', cursor.key, cursor.value);
	          result[params.keys.indexOf(sKeys[current])] = { key: cursor.key, value: cursor.value.value };
	          current += 1;
	          current < sKeys.length ? cursor.continue(sKeys[current]) : done();
	        } else {
	          logger.trace('[_findIn]: continuing to next key: ', sKeys[current]);
	          current < sKeys.length ? cursor.continue(sKeys[current]) : done();
	        }
	      };
	      var done = function done(err) {
	        logger.trace('[findIn]: result: ', result);
	        err ? reject(err) : resolve(result);
	      };
	      var sKeys = params.keys.slice();
	      sKeys = sKeys.sort(lib$1.cmp);
	      logger.trace('[findIn: sorted keys: ', sKeys);
	      params.keys.forEach(function (k) {
	        result.push({ key: k, value: undefined });
	      });
	      store.cursor({ iterator: iterator }, done);
	    });
	  }
	  function _getAll(db, params, loadValue) {
	    logger.trace('[_getAll]: ', params, loadValue);
	    return new Promise(function (resolve, reject) {
	      var result = [];
	      var keys = [];
	      var store = db.store(params.bucket);
	      var iterator = function iterator(cursor) {
	        var kv = { key: cursor.primaryKey };
	        logger.trace('[_getAll]: cursor', cursor);
	        if (loadValue) {
	          kv.value = cursor.value.value;
	        }
	        if (params.index) {
	          kv.index = cursor.key;
	        }
	        result.push(kv);
	        keys.push(cursor.primaryKey);
	        cursor.continue();
	      };
	      var opts = { iterator: iterator };
	      if (params.index) {
	        opts.index = params.index;
	      }
	      if (params.range) {
	        opts.range = params.range;
	      }
	      store.cursor(opts, function (err) {
	        if (err) {
	          reject(err);
	        } else {
	          if (!params.index && !params.range && !loadValue) {
	            logger.trace('[_getAll]: resolving: ', keys);
	            resolve(keys);
	          } else {
	            logger.trace('[_getAll]: resolving: ', result);
	            resolve(result);
	          }
	        }
	      });
	    });
	  }
	  var classCallCheck$2 = function classCallCheck$2(instance, Constructor) {
	    if (!(instance instanceof Constructor)) {
	      throw new TypeError("Cannot call a class as a function");
	    }
	  };
	  var createClass$2 = function () {
	    function defineProperties(target, props) {
	      for (var i = 0; i < props.length; i++) {
	        var descriptor = props[i];
	        descriptor.enumerable = descriptor.enumerable || false;
	        descriptor.configurable = true;
	        if ("value" in descriptor) descriptor.writable = true;
	        Object.defineProperty(target, descriptor.key, descriptor);
	      }
	    }
	    return function (Constructor, protoProps, staticProps) {
	      if (protoProps) defineProperties(Constructor.prototype, protoProps);
	      if (staticProps) defineProperties(Constructor, staticProps);
	      return Constructor;
	    };
	  }();
	  var inherits$1 = function inherits$1(subClass, superClass) {
	    if (typeof superClass !== "function" && superClass !== null) {
	      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
	    }
	    subClass.prototype = Object.create(superClass && superClass.prototype, {
	      constructor: {
	        value: subClass,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	  };
	  var possibleConstructorReturn$1 = function possibleConstructorReturn$1(self, call) {
	    if (!self) {
	      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	    }
	    return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
	  };
	  var _siftGuid = new WeakMap();
	  var _dbs = new WeakMap();
	  var Storage = function () {
	    function Storage(dbInfo, ll) {
	      classCallCheck$2(this, Storage);
	      this._logger = loglevel.getLogger('RSStorage');
	      this._logger.setLevel(ll || 'warn');
	      if (!dbInfo.accountGuid) {
	        throw new Error('[Storage]: dbInfo.accountGuid undefined');
	      }
	      _siftGuid.set(this, dbInfo.siftGuid);
	      _dbs.set(this, opCreateDb(dbInfo));
	    }
	    createClass$2(Storage, [{
	      key: 'get',
	      value: function get$$1(params) {
	        this._logger.trace('[Storage::get]: ', params);
	        return opGet(_dbs.get(this), params, _siftGuid.get(this));
	      }
	    }, {
	      key: 'getAll',
	      value: function getAll(params) {
	        this._logger.trace('[Storage::getAll]: ', params);
	        return opGetAll(_dbs.get(this), params, _siftGuid.get(this));
	      }
	    }, {
	      key: 'getAllKeys',
	      value: function getAllKeys(params) {
	        this._logger.trace('[Storage::getAllKeys]: ', params);
	        return opGetAllKeys(_dbs.get(this), params, _siftGuid.get(this));
	      }
	    }, {
	      key: 'getIndex',
	      value: function getIndex(params) {
	        this._logger.trace('[Storage::getIndex]: ', params);
	        return opGetIndex(_dbs.get(this), params, _siftGuid.get(this));
	      }
	    }, {
	      key: 'getIndexKeys',
	      value: function getIndexKeys(params) {
	        this._logger.trace('[Storage::getIndexKeys]: ', params);
	        return opGetIndexKeys(_dbs.get(this), params, _siftGuid.get(this));
	      }
	    }, {
	      key: 'getWithIndex',
	      value: function getWithIndex(params) {
	        this._logger.trace('[Storage::getWithIndex]: ', params);
	        return opGetWithIndex(_dbs.get(this), params, _siftGuid.get(this));
	      }
	    }, {
	      key: 'delUser',
	      value: function delUser(params) {
	        params.bucket = '_user.default';
	        this._logger.trace('[Storage::delUser]: ', params);
	        return opDel(_dbs.get(this), params, _siftGuid.get(this));
	      }
	    }, {
	      key: 'getUser',
	      value: function getUser(params) {
	        params.bucket = '_user.default';
	        this._logger.trace('[Storage::getUser]: ', params);
	        return opGet(_dbs.get(this), params, _siftGuid.get(this));
	      }
	    }, {
	      key: 'putUser',
	      value: function putUser(params) {
	        params.bucket = '_user.default';
	        this._logger.trace('[Storage::putUser]: ', params);
	        if (!params.kvs || params.kvs.length === 0) {
	          return Promise.reject('[Storage::putUser]: params.kvs undefined');
	        }
	        return opPut(_dbs.get(this), params, false, _siftGuid.get(this));
	      }
	    }, {
	      key: 'close',
	      value: function close(cb) {
	        opClose(_dbs.get(this), cb);
	      }
	    }]);
	    return Storage;
	  }();
	  var InternalStorage = function (_Storage) {
	    inherits$1(InternalStorage, _Storage);
	    function InternalStorage(dbInfo, ll) {
	      classCallCheck$2(this, InternalStorage);
	      return possibleConstructorReturn$1(this, (InternalStorage.__proto__ || Object.getPrototypeOf(InternalStorage)).call(this, dbInfo, ll));
	    }
	    createClass$2(InternalStorage, [{
	      key: 'get',
	      value: function get$$1(params, siftGuid) {
	        this._logger.trace('[InternalStorage::get]: ', params, siftGuid);
	        return opGet(_dbs.get(this), params, siftGuid || _siftGuid.get(this));
	      }
	    }, {
	      key: 'getAll',
	      value: function getAll(params, siftGuid) {
	        this._logger.trace('[InternalStorage::getAll]: ', params, siftGuid);
	        return opGetAll(_dbs.get(this), params, siftGuid || _siftGuid.get(this));
	      }
	    }, {
	      key: 'getAllKeys',
	      value: function getAllKeys(params, siftGuid) {
	        this._logger.trace('[InternalStorage::getAllKeys]: ', params, siftGuid);
	        return opGetAllKeys(_dbs.get(this), params, siftGuid || _siftGuid.get(this));
	      }
	    }, {
	      key: 'getIndex',
	      value: function getIndex(params, siftGuid) {
	        this._logger.trace('[InternalStorage::getIndex]: ', params, siftGuid);
	        return opGetIndex(_dbs.get(this), params, siftGuid || _siftGuid.get(this));
	      }
	    }, {
	      key: 'getIndexKeys',
	      value: function getIndexKeys(params, siftGuid) {
	        this._logger.trace('[InternalStorage::getIndexKeys]: ', params, siftGuid);
	        return opGetIndexKeys(_dbs.get(this), params, siftGuid || _siftGuid.get(this));
	      }
	    }, {
	      key: 'getWithIndex',
	      value: function getWithIndex(params, siftGuid) {
	        this._logger.trace('[InternalStorage::getWithIndex]: ', params, siftGuid);
	        return opGetWithIndex(_dbs.get(this), params, siftGuid || _siftGuid.get(this));
	      }
	    }, {
	      key: 'cursor',
	      value: function cursor(params, done) {
	        this._logger.trace('[InternalStorage::cursor]: ', params);
	        opCursor(_dbs.get(this).db, params, done);
	      }
	    }, {
	      key: 'del',
	      value: function del(params, siftGuid) {
	        this._logger.trace('[InternalStorage::del]: ', params, siftGuid);
	        return opDel(_dbs.get(this), params, siftGuid || _siftGuid.get(this));
	      }
	    }, {
	      key: 'deleteDatabase',
	      value: function deleteDatabase() {
	        this._logger.trace('[InternalStorage::deleteDatabase]');
	        return opDeleteDatabase(_dbs.get(this).db);
	      }
	    }, {
	      key: 'getDbs',
	      value: function getDbs() {
	        return _dbs.get(this);
	      }
	    }, {
	      key: 'put',
	      value: function put(params, raw, siftGuid) {
	        this._logger.trace('[InternalStorage::put]: ', params, raw, siftGuid);
	        return opPut(_dbs.get(this), params, raw, siftGuid || _siftGuid.get(this));
	      }
	    }]);
	    return InternalStorage;
	  }(Storage);
	
	  var SiftController = function () {
	    function SiftController() {
	      classCallCheck(this, SiftController);
	      this._proxy = self;
	      this.view = new Observable();
	      this.emailclient = new EmailClient(self);
	      this._registerMessageListeners();
	    }
	    createClass(SiftController, [{
	      key: 'publish',
	      value: function publish(topic, value) {
	        this._proxy.postMessage({
	          method: 'notifyView',
	          params: {
	            topic: topic,
	            value: value
	          }
	        });
	      }
	    }, {
	      key: '_registerMessageListeners',
	      value: function _registerMessageListeners() {
	        var _this = this;
	        if (!this._proxy) return;
	        this._proxy.onmessage = function (e) {
	          var method = e.data.method;
	          if (_this['_' + method]) {
	            _this['_' + method](e.data.params);
	          } else {}
	        };
	      }
	    }, {
	      key: '_init',
	      value: function _init(params) {
	        this.storage = new SiftStorage();
	        this.storage.init(new Storage({
	          type: 'SIFT',
	          siftGuid: params.siftGuid,
	          accountGuid: params.accountGuid,
	          schema: params.dbSchema
	        }));
	        this._guid = params.siftGuid;
	        this._account = params.accountGuid;
	        this._proxy.postMessage({
	          method: 'initCallback',
	          result: params
	        });
	      }
	    }, {
	      key: '_terminate',
	      value: function _terminate() {
	        if (!this._proxy) return;
	        this._proxy.close();
	      }
	    }, {
	      key: '_postCallback',
	      value: function _postCallback(params, _result) {
	        this._proxy.postMessage({
	          method: 'loadViewCallback',
	          params: {
	            user: { guid: this._account },
	            sift: { guid: this._guid },
	            type: params.type,
	            sizeClass: params.sizeClass,
	            result: _result
	          }
	        });
	      }
	    }, {
	      key: '_loadView',
	      value: function _loadView(params) {
	        var _this2 = this;
	        if (!this.loadView) {
	          console.error('[SiftController::_loadView]: Sift controller must implement the loadView method');
	          return;
	        }
	        var result = this.loadView({
	          sizeClass: params.sizeClass,
	          type: params.type,
	          params: params.data
	        });
	        if (result.data && 'function' === typeof result.data.then) {
	          if (result.html) {
	            this._postCallback(params, { html: result.html });
	          }
	          result.data.then(function (data) {
	            _this2._postCallback(params, { html: result.html, data: data });
	          }).catch(function (error) {
	            console.error('[SiftController::loadView]: promise rejected: ', error);
	          });
	        } else {
	          this._postCallback(params, result);
	        }
	      }
	    }, {
	      key: '_storageUpdated',
	      value: function _storageUpdated(params) {
	        var _this3 = this;
	        this.storage.publish('*', params);
	        params.forEach(function (b) {
	          _this3.storage.publish(b, [b]);
	        });
	      }
	    }, {
	      key: '_notifyController',
	      value: function _notifyController(params) {
	        this.view.publish(params.topic, params.value);
	      }
	    }, {
	      key: '_emailComposer',
	      value: function _emailComposer(params) {
	        this.emailclient.publish(params.topic, params.value);
	      }
	    }]);
	    return SiftController;
	  }();
	
	  function registerSiftView(siftView) {
	    console.log('[Redsift::registerSiftView]: registered');
	  }
	  function createSiftView(instanceMethods) {
	    return _create(SiftView, instanceMethods);
	  }
	  function createSiftController(instanceMethods) {
	    return _create(SiftController, instanceMethods);
	  }
	  function registerSiftController(siftController) {
	    console.log('[Redsift::registerSiftController]: registered');
	  }
	  function createEmailClientController(instanceMethods) {
	    return _create(EmailClientController, instanceMethods);
	  }
	  function registerEmailClientController(emailClientController) {
	    console.log('[Redsift::registerEmailClientController]: registered');
	  }
	  function _create(Base, methods) {
	    var Creature = function Creature() {
	      Base.call(this);
	      if (this.init && typeof this.init === 'function') {
	        this.init();
	      }
	    };
	    Creature.prototype = Object.create(Base.prototype);
	    Creature.constructor = Creature;
	    Object.keys(methods).forEach(function (method) {
	      Creature.prototype[method] = methods[method];
	    });
	    return new Creature();
	  }
	
	  exports.EmailClientController = EmailClientController;
	  exports.SiftController = SiftController;
	  exports.SiftStorage = SiftStorage;
	  exports.SiftView = SiftView;
	  exports.registerSiftView = registerSiftView;
	  exports.createSiftView = createSiftView;
	  exports.createSiftController = createSiftController;
	  exports.registerSiftController = registerSiftController;
	  exports.createEmailClientController = createEmailClientController;
	  exports.registerEmailClientController = registerEmailClientController;
	
	  Object.defineProperty(exports, '__esModule', { value: true });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1), (function() { return this; }())))

/***/ })
/******/ ]);
//# sourceMappingURL=controller.umd-es2015.js.map