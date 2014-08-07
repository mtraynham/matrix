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



},{}],3:[function(require,module,exports){
var Arrayable, Matrix, Vector,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Vector = require('./vector.coffee');

Arrayable = require('./arrayable.coffee');

Matrix = (function(_super) {
  __extends(Matrix, _super);

  function Matrix() {
    return Matrix.__super__.constructor.apply(this, arguments);
  }

  Matrix.name = 'Matrix';

  Matrix.create = function(rows, columns, valueFn) {
    var m, matrix, n, row;
    if (rows == null) {
      rows = 0;
    }
    if (columns == null) {
      columns = 0;
    }
    if (valueFn == null) {
      valueFn = function() {
        return 0.0;
      };
    }
    matrix = new this(rows);
    n = rows;
    while (n--) {
      row = new Arrayable(columns);
      m = columns;
      while (m--) {
        row.set(m, valueFn(n, m));
      }
      matrix.set(n, row);
    }
    return matrix;
  };

  Matrix.zeros = function(rows, columns) {
    return this.create(rows, columns, function() {
      return 0.0;
    });
  };

  Matrix.ones = function(rows, columns) {
    return this.create(rows, columns, function() {
      return 1.0;
    });
  };

  Matrix.random = function(rows, columns) {
    return this.create(rows, columns, function() {
      return Math.random();
    });
  };

  Matrix.identity = function(rows, columns) {
    return this.create(rows, columns, function(n, m) {
      if (n === m) {
        return 1.0;
      } else {
        return 0.0;
      }
    });
  };

  Matrix.diagonal = function(vector) {
    var length;
    length = vector.size();
    return this.create(length, length, function(n, m) {
      if (n === m) {
        return vector.get(n);
      } else {
        return 0.0;
      }
    });
  };

  return Matrix;

})(Arrayable);

module.exports = Matrix;



},{"./arrayable.coffee":2,"./vector.coffee":4}],4:[function(require,module,exports){
var Arrayable, Vector,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Arrayable = require('./arrayable.coffee');

Vector = (function(_super) {
  __extends(Vector, _super);

  function Vector() {
    return Vector.__super__.constructor.apply(this, arguments);
  }

  Vector.name = 'Vector';

  Vector.create = function(length, valueFn) {
    var i, vector, _i, _ref;
    if (length == null) {
      length = 0;
    }
    if (valueFn == null) {
      valueFn = function() {
        return 0.0;
      };
    }
    vector = new this(length);
    for (i = _i = 0, _ref = length - 1; _i <= _ref; i = _i += 1) {
      vector.set(i, valueFn(i));
    }
    return vector;
  };

  Vector.zeros = function(length) {
    return this.create(length, function() {
      return 0.0;
    });
  };

  Vector.ones = function(length) {
    return this.create(length, function() {
      return 1.0;
    });
  };

  Vector.random = function(length) {
    return this.create(length, function() {
      return Math.random();
    });
  };

  Vector.prototype.equals = function(other) {
    var otherElements;
    otherElements = other.getElements();
    if (this.size() !== otherElements.length) {
      return false;
    }
    return this.every(function(element, index) {
      return Math.abs(element - otherElements[index]) > precision;
    });
  };

  Vector.prototype.dot = function(other) {
    var otherElements;
    otherElements = other.getElements();
    if (this.size() !== otherElements.length) {
      return null;
    }
    return this.reduce((function(previous, element, index) {
      return previous += element * otherElements[index];
    }), 0);
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
    var mod3, otherElements, vals;
    otherElements = other.getElements();
    if (this.size() !== otherElements.length) {
      return null;
    }
    vals = this.reduce(function(previous, element, index) {
      var otherElement;
      otherElement = otherElements[index];
      previous.dot += element * otherElement;
      previous.mod1 += Math.pow(element, 2);
      previous.mod2 += Math.pow(otherElement, 2);
      return previous;
    }, {
      dot: 0,
      mod1: 0,
      mod2: 0
    });
    vals.mod1 = Math.sqrt(vals.mod1);
    vals.mod2 = Math.sqrt(vals.mod2);
    mod3 = mod1 * mod2;
    if (mod3 !== 0) {
      return Math.acos(Math.max(-1.0, Math.min(1.0, vals.dot / mod3)));
    } else {
      return null;
    }
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
    if (this.size() !== otherElements.length) {
      return null;
    }
    return this.map(function(element, index) {
      return element + otherElements[index];
    });
  };

  Vector.prototype.subtract = function(other) {
    var otherElements;
    otherElements = other.getElements();
    if (this.size() !== otherElements.length) {
      return null;
    }
    return this.map(function(element, index) {
      return element - otherElements[index];
    });
  };

  Vector.prototype.multiply = function(k) {
    return this.map(function(element) {
      return element * k;
    });
  };

  Vector.prototype.max = function() {
    return this.reduce((function(previous, element) {
      return Math.max(previous, element);
    }), 0);
  };

  Vector.prototype.min = function() {
    var min;
    min = this.reduce((function(previous, element) {
      return Math.min(previous, element);
    }), Number.POSITIVE_INFINITY);
    if (min === Number.POSITIVE_INFINITY) {
      return 0;
    } else {
      return min;
    }
  };

  return Vector;

})(Arrayable);

module.exports = Vector;



},{"./arrayable.coffee":2}]},{},[1]);
