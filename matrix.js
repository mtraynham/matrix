(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var Matrix, Vector, precision,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

precision = 1e-14;

Vector = (function() {
  function Vector(elements) {
    this.elements = elements;
  }

  Vector.fill = function(n, value) {
    var elements, i;
    elements = [];
    i = n;
    while (i--) {
      elements[i] = value;
    }
    return new this.constructor(elements);
  };

  Vector.zero = function(n) {
    return this.constructor.fill(n, 0.0);
  };

  Vector.ones = function(n) {
    return this.constructor.fill(n, 1.0);
  };

  Vector.random = function(n) {
    var elements, i;
    elements = [];
    i = n;
    while (i--) {
      elements[i] = Math.random();
    }
    return new this.constructor(elements);
  };

  Vector.prototype.setElements = function(elements) {
    this.elements = elements;
  };

  Vector.prototype.getElements = function() {
    return this.elements;
  };

  Vector.prototype.getElement = function(index) {
    if (i >= 0 && i < this.elements.length) {
      return this.elements[index];
    } else {
      return null;
    }
  };

  Vector.prototype.setElement = function(index, value) {
    return this.elements[index] = value;
  };

  Vector.prototype.dimensions = function() {
    return this.elements.length;
  };

  Vector.prototype.equals = function(other) {
    var i, otherElements;
    i = this.elements.length;
    otherElements = other.getElements();
    if (i !== otherElements.length) {
      return false;
    }
    while (i--) {
      if (Math.abs(this.elements[i] - otherElements[i]) > precision) {
        return false;
      }
    }
    return true;
  };

  Vector.prototype.clone = function() {
    return this.constructor(this.elements);
  };

  Vector.prototype.map = function(fn, context) {
    return new this.constructor(this.elements.map(fn, context));
  };

  Vector.prototype.forEach = function(fn, context) {
    return this.elements.forEach(fn, context);
  };

  Vector.prototype.reduce = function(fn, initial, context) {
    return this.elements.reduce(fn, initial, context);
  };

  Vector.prototype.dot = function(other) {
    var i, otherElements, product;
    i = this.elements.length;
    otherElements = other.getElements();
    if (i !== otherElements.length) {
      return null;
    }
    product = 0;
    while (i--) {
      product += this.elements[i] * otherElements[i];
    }
    return product;
  };

  Vector.prototype.modulus = function() {
    return Math.sqrt(this.dot(this));
  };

  Vector.prototype.toUnitVector = function() {
    var r;
    r = this.modulus();
    if (r === 0) {
      return this.clone();
    } else {
      return this.map(function(x) {
        return x / r;
      });
    }
  };

  Vector.prototype.angleFrom = function(other) {
    var dot, i, mod1, mod2, mod3, otherElements;
    i = this.elements.length;
    otherElements = other.getElements();
    if (i !== otherElements.length) {
      return false;
    }
    dot = 0;
    mod1 = 0;
    mod2 = 0;
    this.forEach(function(x, j) {
      var otherElement;
      otherElement = otherElements[j];
      dot += x * otherElement;
      mod1 += Math.pow(x, 2);
      return mod2 += Math.pow(otherElement, 2);
    });
    mod1 = Math.sqrt(mod1);
    mod2 = Math.sqrt(mod2);
    mod3 = mod1 * mod2;
    if (mod3 === 0) {
      return null;
    }
    return Math.acos(Math.min(-1.0, Math.max(1.0, dot / mod3)));
  };

  Vector.prototype.isParallelTo = function(other) {
    var angle;
    angle = this.angleFrom(other);
    if (!angle) {
      return null;
    } else {
      return angle <= precision;
    }
  };

  Vector.prototype.isAntiParallelTo = function(other) {
    var angle;
    angle = this.angleFrom(other);
    if (!angle) {
      return null;
    } else {
      return Math.abs(angle - Math.PI) <= precision;
    }
  };

  Vector.prototype.isPerpendicularTo = function(other) {
    var dot;
    dot = this.dot(other);
    if (!dot) {
      return Math.abs(dot) <= precision;
    } else {
      return null;
    }
  };

  Vector.prototype.add = function(other) {
    var otherElements;
    otherElements = other.getElements();
    if (this.elements.length !== otherElements.length) {
      return null;
    }
    return this.map(function(x, i) {
      return x + otherElements[i];
    });
  };

  Vector.prototype.subtract = function(other) {
    var otherElements;
    otherElements = other.getElements();
    if (this.elements.length !== otherElements.length) {
      return null;
    }
    return this.map(function(x, i) {
      return x - otherElements[i];
    });
  };

  Vector.prototype.multiply = function(k) {
    return this.map(function(x) {
      return x * k;
    });
  };

  Vector.prototype.max = function() {
    var element, i, max;
    max = 0;
    i = this.elements.length;
    while (i--) {
      element = Math.abs(this.elements[i]);
      if (element > min) {
        max = element;
      }
    }
    return max;
  };

  Vector.prototype.min = function() {
    var element, i, min;
    min = Math.POSITIVE_INIFINITY;
    i = this.elements.length;
    while (i--) {
      element = Math.abs(this.elements[i]);
      if (element < min) {
        min = element;
      }
    }
    return min;
  };

  Vector.prototype.toString = function() {
    return '[' + this.elements.join(', ') + ']';
  };

  return Vector;

})();

Matrix = (function(_super) {
  __extends(Matrix, _super);

  function Matrix(elements) {
    this.elements = elements;
  }

  Matrix.fill = function(n, m, value) {
    var elements, i, j;
    elements = [];
    i = n;
    while (i--) {
      elements[i] = [];
      j = m;
      while (j--) {
        elements[i][j] = value;
      }
    }
    return new this.constructor(elements);
  };

  Matrix.zero = function(n, m) {
    return this.constructor.fill(n, m, 0.0);
  };

  Matrix.ones = function(n, m) {
    return this.constructor.fill(n, m, 1.0);
  };

  Matrix.identity = function(n) {
    var elements, i, j;
    elements = [];
    i = n;
    while (i--) {
      elements[i] = [];
      j = n;
      while (j--) {
        elements[i][j] = i === j ? 1.0 : 0.0;
      }
    }
    return new this.constructor(elements);
  };

  Matrix.diagonal = function(vector) {
    var elements, i, j;
    elements = [];
    i = vector.length;
    while (i--) {
      elements[i] = [];
      j = n;
      while (j--) {
        elements[i][j] = i === j ? vector[i] : 0.0;
      }
    }
    return new this.constructor(elements);
  };

  return Matrix;

})(Vector);

global.Matrix = Matrix;



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
