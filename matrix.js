(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var precision;

precision = 1e-14;

global.Vector = require('./vector.coffee');

global.Matrix = require('./matrix.coffee');



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./matrix.coffee":3,"./vector.coffee":4}],2:[function(require,module,exports){
var Arrayable;

Arrayable = (function() {
  function Arrayable() {
    if (arguments.length > 1) {
      this.elements = arguments.slice();
    } else if (Array.isArray(arguments[0])) {
      this.elements = arguments[0].slice();
    } else {
      this.elements = new Array(arguments);
    }
  }

  Arrayable.name = 'Arrayable';

  Arrayable.from = function() {
    return new this(Array.from.apply(this.elements, arguments));
  };

  Arrayable.of = function() {
    return new this(Array.of.apply(this.elements, arguments));
  };

  Arrayable.prototype.setElements = function(elements) {
    this.elements = elements;
  };

  Arrayable.prototype.getElements = function() {
    return this.elements;
  };

  Arrayable.prototype.get = function(index) {
    return this.elements[index];
  };

  Arrayable.prototype.set = function(index, value) {
    return this.elements[index] = value;
  };

  Arrayable.prototype.size = function() {
    return this.elements.length;
  };

  Arrayable.prototype.fill = function() {
    return this.elements.fill.apply(this.elements, arguments);
  };

  Arrayable.prototype.pop = function() {
    return this.elements.pop.apply(this.elements, arguments);
  };

  Arrayable.prototype.push = function() {
    return this.elements.push.apply(this.elements, arguments);
  };

  Arrayable.prototype.reverse = function() {
    return this.elements.reverse.apply(this.elements, arguments);
  };

  Arrayable.prototype.shift = function() {
    return this.elements.shift.apply(this.elements, arguments);
  };

  Arrayable.prototype.splice = function() {
    return this.elements.splice.apply(this.elements, arguments);
  };

  Arrayable.prototype.unshift = function() {
    return this.elements.unshift.apply(this.elements, arguments);
  };

  Arrayable.prototype.concat = function() {
    return this.elements.concat.apply(this.elements, arguments);
  };

  Arrayable.prototype.join = function() {
    return this.elements.join.apply(this.elements, arguments);
  };

  Arrayable.prototype.slice = function() {
    return new this.constructor(this.elements.slice.apply(this.elements, arguments));
  };

  Arrayable.prototype.toString = function() {
    return this.constructor.name + ' [' + this.elements.toString.apply(this.elements, arguments + ']');
  };

  Arrayable.prototype.toLocaleString = function() {
    return this.constructor.name + ' [' + this.elements.toLocaleString.apply(this.elements, arguments + ']');
  };

  Arrayable.prototype.indexOf = function() {
    return this.elements.indexOf.apply(this.elements, arguments);
  };

  Arrayable.prototype.lastIndexOf = function() {
    return this.elements.lastIndexOf.apply(this.elements, arguments);
  };

  Arrayable.prototype.forEach = function() {
    return this.elements.forEach.apply(this.elements, arguments);
  };

  Arrayable.prototype.entries = function() {
    return this.elements.entries.apply(this.elements, arguments);
  };

  Arrayable.prototype.every = function() {
    return this.elements.every.apply(this.elements, arguments);
  };

  Arrayable.prototype.some = function() {
    return this.elements.some.apply(this.elements, arguments);
  };

  Arrayable.prototype.filter = function() {
    return this.elements.filter.apply(this.elements, arguments);
  };

  Arrayable.prototype.find = function() {
    return this.elements.find.apply(this.elements, arguments);
  };

  Arrayable.prototype.findIndex = function() {
    return this.elements.findIndex.apply(this.elements, arguments);
  };

  Arrayable.prototype.keys = function() {
    return this.elements.keys.apply(this.elements, arguments);
  };

  Arrayable.prototype.map = function() {
    return new this.constructor(this.elements.map.apply(this.elements, arguments));
  };

  Arrayable.prototype.reduce = function() {
    return this.elements.reduce.apply(this.elements, arguments);
  };

  Arrayable.prototype.reduceRight = function() {
    return this.elements.reduceRight.apply(this.elements, arguments);
  };

  Arrayable.prototype.clone = function() {
    return new this.constructor(this.elements);
  };

  return Arrayable;

})();

module.exports = Arrayable;



},{}]