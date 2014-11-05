var zero = function (datun) {
    return datun | 0;
};

var NilDFactory = function (dataType) {
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
        return new Constructor (a);
    };
};

var ZeroDFactory = function (dataType) {
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
    proto.valueOf = proto.get = function () {
        return this.data[this.offset];
    };
    proto.set = function (v) {
        return (this.data[this.offset] = v);
    };
};

var NDFactory = function (dataType, dimensions) {
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

    // Stride
    function StrideConstructor (v) {
        this.v = v;
    }
    var aproto = StrideConstructor.prototype;
    aproto.length = dimensions;
    aproto.toJSON = function () {
        return this.v.stride;
    };
    aproto.valueOf = function () {
        return this.v.stride.join();
    };
    for (var i = 0; i < dimensions; i++) {
        Object.defineProperty(aproto, i, {
            get: function () {
                return this.v.stride[i];
            },
            set: function (v) {
                return (this.v.stride = zero(v));
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
    function ShapeConstructor (v) {
        this.v = v;
    }
    var bproto = ShapeConstructor.prototype;
    bproto.length = dimensions;
    bproto.toJSON = function () {
        return this.v.shape;
    };
    bproto.valueOf = function () {
        return this.v.shape.join();
    };
    for (var j = 0; j < dimensions; j++) {
        Object.defineProperty(bproto, i, {
            get: function () {
                return this.v.shape[i];
            },
            set: function (v) {
                return (this.v.shape = zero(v));
            },
            enumerable: true
        });
    }
    bproto.concat = Array.prototype.concat;
    bproto.join = Array.prototype.join;
    bproto.slice = Array.prototype.slice;
    bproto.toString = Array.prototype.toString;
    bproto.indexOf = Array.prototype.indexOf;
    bproto.lastIndexOf = Array.prototype.lastIndexOf;
    bproto.forEach = Array.prototype.forEach;
    bproto.every = Array.prototype.every;
    bproto.some = Array.prototype.some;
    bproto.filter = Array.prototype.filter;
    bproto.map = Array.prototype.map;
    bproto.reduce = Array.prototype.reduce;
    bproto.reduceRight = Array.prototype.reduceRight;
    Object.defineProperty(proto, 'shape', {
        get: function () {
            return new ShapeConstructor(this);
        },
        set: function (v) {
            this.stride = v.map(zero);
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
            // TODO
            return (Math.abs(this._stride0) > Math.abs(this._stride1)) ? [1, 0] : [0, 1];
        }
    });

    // index
    proto.index = function () {
        return this.offset + this.stride.reduce(function (previous, stride, index) {
            return previous += stride * index;
        }, 0);
    };

    // Set
    proto.set = function () {
        return (this.data[this.index(arguments)] = arguments[arguments.length - 1]);
    };

    // Get
    proto.get = function () {
        return this.data[this.index(arguments)];
    };

    // Hi
    proto.hi = function () {

    };

    // Lo
    proto.lo = function () {

    };

    // Step
    proto.step = function () {

    };

    // Transpose
    proto.transpose = function () {

    };

    proto.pick = function () {

    };

    return function () {
        return new Constructor(arguments);
    };
};