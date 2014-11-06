var zero = function (datun) {
    return datun | 0;
};

var constructVarArgs = function (constructor, args) {
    function F() {
        return constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;
    return new F();
};

var nilDFactory = function (dataType) {
    function Constructor (a) {
        this.data = a;
    }
    var proto = Constructor.prototype;
    proto.dtype = dataType;
    proto.index = function () {
        return -1;
    };
    proto.size = 0;
    proto.dimension = -1;
    proto.shape = proto.stride = proto.order = [];
    proto.lo = proto.hi = proto.transpose = proto.step = function () {
        return new Constructor (this.data);
    };
    proto.get = proto.set = function () {};
    proto.pick = function () { return null; };
    return function (a) {
        return new Constructor(a);
    };
};

var zeroDFactory = function (dataType) {
    var useGetters = (dataType === 'generic');

    function Constructor (a, d) {
        this.data = a;
        this.offset = d;
    }
    var proto = Constructor.prototype;
    proto.dtype = dataType;
    proto.index = function () {
        return this.offset;
    };
    proto.dimension = 0;
    proto.size = 1;
    proto.shape = proto.stride = proto.order = [];
    proto.lo = proto.hi = proto.transpose = proto.step = function () {
        return new Constructor (this.data, this.offset);
    };
    proto.pick = function () {
        return new Constructor(this.data);
    };
    if (useGetters) {
        proto.valueOf = proto.get = function () {
            return this.data.get(this.offset);
        };
        proto.set = function (v) {
            return (this.data.set(this.offset, v));
        };
    } else {
        proto.valueOf = proto.get = function () {
            return this.data[this.offset];
        };
        proto.set = function (v) {
            return (this.data[this.offset] = v);
        };
    }
    return function (a, b, c, d) {
        return new Constructor(a, d);
    };
};

var ssFactory = function (property, dimensions) {
    function Constructor (v) {
        this.v = v;
    }
    var aproto = Constructor.prototype;
    aproto.length = dimensions;
    aproto.toJSON = function () {
        return this.v[property];
    };
    aproto.valueOf = function () {
        return this.v[property].join();
    };
    for (var i = 0; i < dimensions; i++) {
        Object.defineProperty(aproto, i, {
            get: function () {
                return this.v[property][i];
            },
            set: function (v) {
                return (this.v[property] = zero(v));
            },
            enumerable: true
        });
    }
    aproto.concat = Array.prototype.concat;
    aproto.join = Array.prototype.join;
    aproto.slice = Array.prototype.slice;
    aproto.toString = Array.prototype.toString;
    aproto.indexOf = Array.prototype.indexOf;
    aproto.lastIndexOf = Array.prototype.lastIndexOf;
    aproto.forEach = Array.prototype.forEach;
    aproto.every = Array.prototype.every;
    aproto.some = Array.prototype.some;
    aproto.filter = Array.prototype.filter;
    aproto.map = Array.prototype.map;
    aproto.reduce = Array.prototype.reduce;
    aproto.reduceRight = Array.prototype.reduceRight;
    return Constructor;
};

var nDFactory = function (dataType, dimensions) {
    var useGetters = (dataType === 'generic');

    // Constructor
    function Constructor () {
        if (arguments.length > 0) {
            this.data = arguments[0];
            this.shape = arguments.slice(1, dimensions).map(zero);
            this.stride = arguments.slice(dimensions + 1, arguments.length - 2).map(zero);
            this.offset = zero(this.arguments[arguments.length - 1]);
        }
    }
    var proto = Constructor.prototype;
    proto.dtype = dataType;
    proto.dimension = dimensions;

    // Stride constructor
    var StrideConstructor = ssFactory('stride', dimensions);
    Object.defineProperty(proto, 'stride', {
        get: function () {
            return new StrideConstructor(this);
        },
        set: function (v) {
            this.stride = v.map(zero);
            return v;
        }
    });

    // Shape constructor
    var ShapeConstructor = ssFactory('shape', dimensions);
    Object.defineProperty(proto, 'shape', {
        get: function () {
            return new ShapeConstructor(this);
        },
        set: function (v) {
            this.shape = v.map(zero);
            return v;
        }
    });

    // Size
    Object.defineProperty(proto, 'size', {
        get: function () {
            return this.shape.reduce(function (previous, shaped) {
                return previous *= shaped;
            }, 1);
        }
    });

    // Order
    Object.defineProperty(proto, 'order', {
        get: function () {
            if (dimensions.size === 1) {
                return [0];
            } else if (dimensions.size === 2) {
                return Math.abs(this.stride[0]) > Math.abs(this.stride[1]) ? [1, 0] : [0, 1];
            } else if (dimensions.size === 3) {
                var s0 = Math.abs(this.stride[0]),
                    s1 = Math.abs(this.stride[1]),
                    s2 = Math.abs(this.stride[2]);
                if (s0 > s1) {
                    if (s1 > s2) {
                        return [2, 1, 0];
                    } else if (s0 > s2) {
                        return [1, 2, 0];
                    } else {
                        return [1, 0, 2];
                    }
                } else {
                    if (s0 > s2) {
                        return [2, 0, 1];
                    } else if (s2 > s1) {
                        return [0, 1, 2];
                    } else {
                        return [0, 2, 1];
                    }
                }
            } else {
                var stride = this.stride,
                    terms = new Array(stride.length),
                    i;
                for (i = 0; i < terms.length; i++) {
                    terms[i] = [Math.abs(stride[i]), i];
                }
                terms.sort(function (a, b) {
                    return a[0] - b[0];
                });
                var result = new Array(terms.length);
                for (i = 0; i < result.length; ++i) {
                    result[i] = terms[i][1];
                }
                return result;
            }
        }
    });

    // index
    proto.index = function () {
        return this.offset + this.stride.reduce(function (previous, stride, index) {
            return previous += stride * index;
        }, 0);
    };

    // Set & Get
    if (useGetters) {
        proto.set = function () {
            return (this.data.set(this.index(arguments), arguments[arguments.length - 1]));
        };
        proto.get = function () {
            return this.data.get(this.index(arguments));
        };
    } else {
        proto.set = function () {
            return (this.data[this.index(arguments)] = arguments[arguments.length - 1]);
        };
        proto.get = function () {
            return this.data[this.index(arguments)];
        };
    }

    // Hi
    proto.hi = function () {
        return constructVarArgs(Constructor,
            [this.data]
            .concat(this.shape.map(function (shape, i) {
                var arg = arguments[i];
                return (typeof arg !== 'number' || arg < 0) ? shape : zero(arg);
            }))
            .concat(this.stride)
            .concat([this.offset])
        );
    };

    // Lo
    proto.lo = function () {
        var b = this.offset,
            c = this.stride,
            d = 0;
        return constructVarArgs(Constructor,
            [this.data]
            .concat(this.shape.map(function (shape, i) {
                var arg = arguments[i];
                if (typeof arg === 'number' && arg >= 0) {
                    d = zero(arg);
                    b += c[i] * d;
                    return shape - d;
                }
                return shape;
            }))
            .concat(this.stride)
            .concat([b])
        );
    };

    // Step
    proto.step = function () {
        var a = this.shape.slice(0),
            b = this.stride.slice(0),
            c = this.offset,
            d = 0,
            ceil = Math.ceil;
        arguments.forEach(function (arg, index) {
            if (typeof arg === 'number') {
                d = zero(arg);
                if (d < 0) {
                    c += b[index] * (a[index] -1);
                    a[index] = ceil(-a[index] / d);
                } else {
                    a[index] = ceil(a[index] / d);
                }
                b[index] *= d;
            }
        });
        return constructVarArgs(Constructor,
            [this.data]
            .concat(a)
            .concat(b)
            .concat([this.offset])
        );
    };

    // Transpose
    proto.transpose = function () {
        var args = arguments.map(function (arg, index) {
                return (arg === undefined) ? index : zero(arg);
            }),
            a = this.shape,
            b = this.stride;
        return constructVarArgs(Constructor,
            [this.data]
            .concat(args.map(function (arg) {
                return a[arg];
            }))
            .concat(args.map(function (arg) {
                return b[arg];
            }))
            .concat([this.offset])
        );
    };

    proto.pick = function () {
        var a = [],
            b = [],
            c = this.offset,
            stride = this.stride,
            shape = this.shape;
        arguments.forEach(function (arg, index) {
            if (typeof arg === 'number' && arg >= 0) {
                c = zero(c + stride[index] * arg);
            } else {
                a.push(shape[index]);
                b.push(stride[index]);
            }
        });
        return constructVarArgs(Constructor, [this.data, a, b, c]);
    };

    return function () {
        return new Constructor(arguments);
    };
};

function compileConstructor (dataType, dimensions) {
    if (dimensions < 0) {
        return nilDFactory(dataType, dimensions);
    } else if (dimensions === 0) {
        return zeroDFactory(dataType, dimensions);
    }
    return nDFactory(dataType, dimensions);
}

module.exports = compileConstructor;