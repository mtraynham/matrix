(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["matrix"] = factory();
	else
		root["matrix"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _NDArray = __webpack_require__(1);
	
	var _NDArray2 = _interopRequireWildcard(_NDArray);
	
	var _NilNDArray = __webpack_require__(2);
	
	var _NilNDArray2 = _interopRequireWildcard(_NilNDArray);
	
	var _ZeroNDArray = __webpack_require__(3);
	
	var _ZeroNDArray2 = _interopRequireWildcard(_ZeroNDArray);
	
	var _ArrayUtils = __webpack_require__(4);
	
	var _ArrayUtils2 = _interopRequireWildcard(_ArrayUtils);
	
	exports.NilNDArray = _NilNDArray2['default'];
	exports.ZeroNDArray = _ZeroNDArray2['default'];
	exports.NDArray = _NDArray2['default'];
	exports.ArrayUtils = _ArrayUtils2['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var NDArray = (function () {
	    function NDArray(_x, shape, stride, offset) {
	        var _this = this;
	
	        var data = arguments[0] === undefined ? [] : arguments[0];
	
	        _classCallCheck(this, NDArray);
	
	        this.data = data instanceof Array ? data : [data];
	        this.shape = shape || (this.data ? [this.data.length] : []);
	        if (!stride) {
	            stride = [];
	            var i = this.shape.length,
	                size = 1;
	            while (i--) {
	                stride[i] = size;
	                size *= this.shape[i];
	            }
	        }
	        this.stride = stride;
	        if (!offset) {
	            offset = this.shape.reduce(function (prev, shaped, idx) {
	                var strided = _this._stride[idx];
	                if (strided < 0) {
	                    prev -= (shaped - 1) * strided;
	                }
	                return prev;
	            }, 0);
	        }
	        this.offset = offset;
	    }
	
	    _createClass(NDArray, [{
	        key: 'size',
	        get: function () {
	            return this._size;
	        }
	    }, {
	        key: 'shape',
	        get: function () {
	            return this._shape;
	        },
	        set: function (shape) {
	            if (!shape || !shape.length) {
	                this._shape = [];
	                this._size = 0;
	            } else {
	                this._shape = shape.map(Math.floor);
	                this._size = this._shape.reduce(function (previous, shaped) {
	                    return previous *= shaped;
	                }, 1);
	            }
	        }
	    }, {
	        key: 'stride',
	        get: function () {
	            return this._stride;
	        },
	        set: function (stride) {
	            if (!stride || !stride.length) {
	                this._stride = [];
	                this._order = [];
	            } else {
	                this._stride = stride.map(Math.floor);
	                this._order = this._stride.map(function (stride, index) {
	                    return [Math.abs(stride), index];
	                }).sort(function (a, b) {
	                    return a[0] - b[0];
	                }).map(function (term) {
	                    return term[1];
	                });
	            }
	        }
	    }, {
	        key: 'offset',
	        get: function () {
	            return this._offset;
	        },
	        set: function (offset) {
	            this._offset = Math.floor(offset);
	        }
	    }, {
	        key: 'order',
	        get: function () {
	            return this._order;
	        }
	    }, {
	        key: 'index',
	        value: function index() {
	            for (var _len = arguments.length, indices = Array(_len), _key = 0; _key < _len; _key++) {
	                indices[_key] = arguments[_key];
	            }
	
	            return this.offset + this._stride.reduce(function (previous, stride, index) {
	                return previous += stride * Math.floor(indices[index]);
	            }, 0);
	        }
	    }, {
	        key: 'get',
	        value: function get() {
	            for (var _len2 = arguments.length, indices = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	                indices[_key2] = arguments[_key2];
	            }
	
	            var index = this.index.apply(this, indices);
	            return index > -1 ? this.data[index] : null;
	        }
	    }, {
	        key: 'set',
	        value: function set(value) {
	            for (var _len3 = arguments.length, indices = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
	                indices[_key3 - 1] = arguments[_key3];
	            }
	
	            var index = this.index.apply(this, indices);
	            if (index > -1) {
	                this.data[index] = value;
	            }
	        }
	    }, {
	        key: 'lo',
	        value: function lo() {
	            var _this2 = this;
	
	            for (var _len4 = arguments.length, indices = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	                indices[_key4] = arguments[_key4];
	            }
	
	            var index = undefined;
	            return new NDArray(this.data, this.shape.map(function (shape, idx) {
	                index = Math.floor(indices[idx]);
	                return index < 0 ? shape : shape - _this2.offset * _this2.stride[idx] * index;
	            }), this.stride, this.offset);
	        }
	    }, {
	        key: 'hi',
	        value: function hi() {
	            for (var _len5 = arguments.length, indices = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
	                indices[_key5] = arguments[_key5];
	            }
	
	            var index = undefined;
	            return new NDArray(this.data, this.shape.map(function (shape, idx) {
	                index = Math.floor(indices[idx]);
	                return index < 0 ? shape : index;
	            }), this.stride, this.offset);
	        }
	    }, {
	        key: 'step',
	        value: function step() {
	            for (var _len6 = arguments.length, indices = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
	                indices[_key6] = arguments[_key6];
	            }
	
	            var shape = this._shape.slice(),
	                stride = this._stride.slice(),
	                offset = this.offset;
	            indices.forEach(function (index, idx) {
	                if (typeof index === 'number') {
	                    index = Math.floor(index);
	                    if (index < 0) {
	                        offset += stride[index] * (shape[idx] - 1);
	                        shape[idx] = Math.ceil(-shape[idx] / index);
	                    } else {
	                        shape[idx] = Math.ceil(shape[idx] / index);
	                    }
	                    stride[idx] *= index;
	                }
	            });
	            return new NDArray(this.data, shape, stride, this.offset);
	        }
	    }, {
	        key: 'transpose',
	        value: function transpose() {
	            for (var _len7 = arguments.length, axes = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
	                axes[_key7] = arguments[_key7];
	            }
	
	            var stride = [],
	                shape = [],
	                axis = undefined;
	            this.shape.forEach(function (item, idx) {
	                axis = axes[idx] || idx;
	                shape[idx] = stride[axis];
	                stride[idx] = shape[axis];
	            });
	            return new NDArray(this.data, shape, stride, this.offset);
	        }
	    }, {
	        key: 'pick',
	        value: function pick() {
	            for (var _len8 = arguments.length, axes = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
	                axes[_key8] = arguments[_key8];
	            }
	
	            var shape = [],
	                stride = [],
	                offset = 0,
	                axis = undefined;
	            this.shape.forEach(function (item, idx) {
	                axis = axes[idx];
	                if (axis >= 0) {
	                    offset += Math.floor(stride[idx] * axis);
	                } else {
	                    shape.push(shape[idx]);
	                    stride.push(stride[idx]);
	                }
	            });
	            return new NDArray(this.data, shape, stride, offset);
	        }
	    }, {
	        key: 'toJSON',
	        value: function toJSON() {
	            return {
	                data: this.data,
	                shape: this.shape,
	                stride: this.stride,
	                offset: this.offset
	            };
	        }
	    }, {
	        key: 'toString',
	        value: function toString() {
	            return this.data.toString();
	        }
	    }, {
	        key: 'valueOf',
	        value: function valueOf() {
	            return this.data.valueOf();
	        }
	    }]);
	
	    return NDArray;
	})();
	
	exports['default'] = NDArray;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _NDArray2 = __webpack_require__(1);
	
	var _NDArray3 = _interopRequireWildcard(_NDArray2);
	
	var NilNDArray = (function (_NDArray) {
	    function NilNDArray() {
	        var data = arguments[0] === undefined ? [] : arguments[0];
	
	        _classCallCheck(this, NilNDArray);
	
	        _get(Object.getPrototypeOf(NilNDArray.prototype), 'constructor', this).call(this, data);
	    }
	
	    _inherits(NilNDArray, _NDArray);
	
	    return NilNDArray;
	})(_NDArray3['default']);
	
	exports['default'] = NilNDArray;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };
	
	var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _NDArray2 = __webpack_require__(1);
	
	var _NDArray3 = _interopRequireWildcard(_NDArray2);
	
	var ZeroNDArray = (function (_NDArray) {
	    function ZeroNDArray(data) {
	        var offset = arguments[1] === undefined ? 0 : arguments[1];
	
	        _classCallCheck(this, ZeroNDArray);
	
	        _get(Object.getPrototypeOf(ZeroNDArray.prototype), 'constructor', this).call(this, data, null, null, offset);
	    }
	
	    _inherits(ZeroNDArray, _NDArray);
	
	    return ZeroNDArray;
	})(_NDArray3['default']);
	
	exports.ZeroNDArray = ZeroNDArray;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var ArrayUtils = (function () {
	    function ArrayUtils() {
	        _classCallCheck(this, ArrayUtils);
	    }
	
	    _createClass(ArrayUtils, null, [{
	        key: "fill",
	        value: function fill(array, filler) {
	            var i = array.length;
	            while (i--) {
	                array[i] = filler(array[i], i);
	            }
	            return array;
	        }
	    }, {
	        key: "fillEmpty",
	        value: function fillEmpty(array, filler) {
	            return ArrayUtils.fill(array, function (value) {
	                return value || filler;
	            });
	        }
	    }, {
	        key: "fillValue",
	        value: function fillValue(array, filler) {
	            return ArrayUtils.fill(array, function () {
	                return filler;
	            });
	        }
	    }, {
	        key: "fillZero",
	        value: function fillZero(array) {
	            return ArrayUtils.fillValue(array, 0);
	        }
	    }, {
	        key: "fillOnes",
	        value: function fillOnes(array) {
	            return ArrayUtils.fillValue(array, 1);
	        }
	    }, {
	        key: "fillIota",
	        value: function fillIota(array) {
	            return ArrayUtils.fill(array, function (value, index) {
	                return index;
	            });
	        }
	    }, {
	        key: "fillDiagonal",
	        value: function fillDiagonal(array, diagonal, nonDiagonal) {
	            var dimensions = arguments[3] === undefined ? 2 : arguments[3];
	
	            return ArrayUtils.fill(array, function (value, index) {
	                return Math.floor(dimensions / index) === dimensions % index ? diagonal : nonDiagonal;
	            });
	        }
	    }]);
	
	    return ArrayUtils;
	})();
	
	exports["default"] = ArrayUtils;
	module.exports = exports["default"];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=matrix.js.map