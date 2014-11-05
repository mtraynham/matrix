// 1 DIMENSIONS
// function View_Nilfloat32(a) {
//     this.data = a;
// };
// var proto = View_Nilfloat32.prototype;
// proto.dtype = 'float32';
// proto.index = function() {
//     return -1
// };
// proto.size = 0;
// proto.dimension = -1;
// proto.shape = proto.stride = proto.order = [];
// proto.lo = proto.hi = proto.transpose = proto.step = function() {
//     return new View_Nilfloat32(this.data);
// };
// proto.get = proto.set = function() {};
// proto.pick = function() {
//     return null
// };
// return function construct_View_Nilfloat32(a) {
//     return new View_Nilfloat32(a);
// }

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
        return new Constructor (a);
    };
};


// 0 DIMENSIONS
// function View0dfloat32(a, d) {
//     this.data = a;
//     this.offset = d
// };
// var proto = View0dfloat32.prototype;
// proto.dtype = 'float32';
// proto.index = function() {
//     return this.offset
// };
// proto.dimension = 0;
// proto.size = 1;
// proto.shape = proto.stride = proto.order = [];
// proto.lo = proto.hi = proto.transpose = proto.step = function View0dfloat32_copy() {
//     return new View0dfloat32(this.data, this.offset)
// };
// proto.pick = function View0dfloat32_pick() {
//     return TrivialArray(this.data);
// };
// proto.valueOf = proto.get = function View0dfloat32_get() {
//     return this.data[this.offset]
// };
// proto.set = function View0dfloat32_set(v) {
//     return this.data[this.offset] = v
// };
// return function construct_View0dfloat32(a, b, c, d) {
//     return new View0dfloat32(a, d)
// }

var zeroDFactory = function (dataType) {
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
        return this.data[this.offset] = v;
    };
};

// 1 DIMENSION
'use strict'

function View1dfloat32(a, b0, c0, d) {
    this.data = a
    this._shape0 = b0 | 0
    this._stride0 = c0 | 0
    this.offset = d | 0
}
var proto = View1dfloat32.prototype
proto.dtype = 'float32'
proto.dimension = 1

function VStride1dfloat32(v) {
    this._v = v
}
var aproto = VStride1dfloat32.prototype
aproto.length = 1
aproto.toJSON = function VStride1dfloat32_toJSON() {
    return [this._v._stride0]
}
aproto.valueOf = aproto.toString = function VStride1dfloat32_toString() {
    return [this._v._stride0].join()
}
Object.defineProperty(aproto, 0, {
    get: function() {
        return this._v._stride0
    },
    set: function(v) {
        return this._v._stride0 = v | 0
    },
    enumerable: true
})
aproto.concat = Array.prototype.concat
aproto.join = Array.prototype.join
aproto.slice = Array.prototype.slice
aproto.toString = Array.prototype.toString
aproto.indexOf = Array.prototype.indexOf
aproto.lastIndexOf = Array.prototype.lastIndexOf
aproto.forEach = Array.prototype.forEach
aproto.every = Array.prototype.every
aproto.some = Array.prototype.some
aproto.filter = Array.prototype.filter
aproto.map = Array.prototype.map
aproto.reduce = Array.prototype.reduce
aproto.reduceRight = Array.prototype.reduceRight
Object.defineProperty(proto, 'stride', {
    get: function VStride1dfloat32_get() {
        return new VStride1dfloat32(this)
    },
    set: function VStride1dfloat32_set(v) {
        this._stride0 = v[0] | 0
        return v
    }
})

function VShape1dfloat32(v) {
    this._v = v
}
var aproto = VShape1dfloat32.prototype
aproto.length = 1
aproto.toJSON = function VShape1dfloat32_toJSON() {
    return [this._v._shape0]
}
aproto.valueOf = aproto.toString = function VShape1dfloat32_toString() {
    return [this._v._shape0].join()
}
Object.defineProperty(aproto, 0, {
    get: function() {
        return this._v._shape0
    },
    set: function(v) {
        return this._v._shape0 = v | 0
    },
    enumerable: true
})
aproto.concat = Array.prototype.concat
aproto.join = Array.prototype.join
aproto.slice = Array.prototype.slice
aproto.toString = Array.prototype.toString
aproto.indexOf = Array.prototype.indexOf
aproto.lastIndexOf = Array.prototype.lastIndexOf
aproto.forEach = Array.prototype.forEach
aproto.every = Array.prototype.every
aproto.some = Array.prototype.some
aproto.filter = Array.prototype.filter
aproto.map = Array.prototype.map
aproto.reduce = Array.prototype.reduce
aproto.reduceRight = Array.prototype.reduceRight
Object.defineProperty(proto, 'shape', {
    get: function VShape1dfloat32_get() {
        return new VShape1dfloat32(this)
    },
    set: function VShape1dfloat32_set(v) {
        this._shape0 = v[0] | 0
        return v
    }
})
Object.defineProperty(proto, 'size', {
    get: function View1dfloat32_size() {
        return this._shape0
    }
})
proto.order = [0]
proto.set = function View1dfloat32_set(i0, v) {
    return this.data[this.offset + this._stride0 * i0] = v
}
proto.get = function View1dfloat32_get(i0) {
    return this.data[this.offset + this._stride0 * i0]
}
proto.index = function View1dfloat32_index(
    i0
) {
    return this.offset + this._stride0 * i0
}
proto.hi = function View1dfloat32_hi(i0) {
    return new View1dfloat32(this.data, (typeof i0 !== 'number' || i0 < 0) ? this._shape0 : i0 | 0, this._stride0, this.offset)
}
proto.lo = function View1dfloat32_lo(i0) {
    var b = this.offset,
        d = 0,
        a0 = this._shape0,
        c0 = this._stride0
    if (typeof i0 === 'number' && i0 >= 0) {
        d = i0 | 0;
        b += c0 * d;
        a0 -= d
    }
    return new View1dfloat32(this.data, a0, c0, b)
}
proto.step = function View1dfloat32_step(i0) {
    var a0 = this._shape0,
        b0 = this._stride0,
        c = this.offset,
        d = 0,
        ceil = Math.ceil
    if (typeof i0 === 'number') {
        d = i0 | 0;
        if (d < 0) {
            c += b0 * (a0 - 1);
            a0 = ceil(-a0 / d)
        } else {
            a0 = ceil(a0 / d)
        }
        b0 *= d
    }
    return new View1dfloat32(this.data, a0, b0, c)
}
proto.transpose = function View1dfloat32_transpose(i0) {
    i0 = (i0 === undefined ? 0 : i0 | 0)
    var a = this.shape,
        b = this.stride;
    return new View1dfloat32(this.data, a[i0], b[i0], this.offset)
}
proto.pick = function View1dfloat32_pick(i0) {
    var a = [],
        b = [],
        c = this.offset
    if (typeof i0 === 'number' && i0 >= 0) {
        c = (c + this._stride0 * i0) | 0
    } else {
        a.push(this._shape0);
        b.push(this._stride0)
    }
    var ctor = CTOR_LIST[a.length + 1];
    return ctor(this.data, a, b, c)
}
return function construct_View1dfloat32(data, shape, stride, offset) {
    return new View1dfloat32(data, shape[0], stride[0], offset)
}

// 2 DIMENSIONS
'use strict'

function View2dfloat32(a, b0, b1, c0, c1, d) {
    this.data = a
    this._shape0 = b0 | 0
    this._shape1 = b1 | 0
    this._stride0 = c0 | 0
    this._stride1 = c1 | 0
    this.offset = d | 0
}
var proto = View2dfloat32.prototype
proto.dtype = 'float32'
proto.dimension = 2

function VStride2dfloat32(v) {
    this._v = v
}
var aproto = VStride2dfloat32.prototype
aproto.length = 2
aproto.toJSON = function VStride2dfloat32_toJSON() {
    return [this._v._stride0, this._v._stride1]
}
aproto.valueOf = aproto.toString = function VStride2dfloat32_toString() {
    return [this._v._stride0, this._v._stride1].join()
}
Object.defineProperty(aproto, 0, {
    get: function() {
        return this._v._stride0
    },
    set: function(v) {
        return this._v._stride0 = v | 0
    },
    enumerable: true
})
Object.defineProperty(aproto, 1, {
    get: function() {
        return this._v._stride1
    },
    set: function(v) {
        return this._v._stride1 = v | 0
    },
    enumerable: true
})
aproto.concat = Array.prototype.concat
aproto.join = Array.prototype.join
aproto.slice = Array.prototype.slice
aproto.toString = Array.prototype.toString
aproto.indexOf = Array.prototype.indexOf
aproto.lastIndexOf = Array.prototype.lastIndexOf
aproto.forEach = Array.prototype.forEach
aproto.every = Array.prototype.every
aproto.some = Array.prototype.some
aproto.filter = Array.prototype.filter
aproto.map = Array.prototype.map
aproto.reduce = Array.prototype.reduce
aproto.reduceRight = Array.prototype.reduceRight
Object.defineProperty(proto, 'stride', {
    get: function VStride2dfloat32_get() {
        return new VStride2dfloat32(this)
    },
    set: function VStride2dfloat32_set(v) {
        this._stride0 = v[0] | 0
        this._stride1 = v[1] | 0
        return v
    }
})

function VShape2dfloat32(v) {
    this._v = v
}
var aproto = VShape2dfloat32.prototype
aproto.length = 2
aproto.toJSON = function VShape2dfloat32_toJSON() {
    return [this._v._shape0, this._v._shape1]
}
aproto.valueOf = aproto.toString = function VShape2dfloat32_toString() {
    return [this._v._shape0, this._v._shape1].join()
}
Object.defineProperty(aproto, 0, {
    get: function() {
        return this._v._shape0
    },
    set: function(v) {
        return this._v._shape0 = v | 0
    },
    enumerable: true
})
Object.defineProperty(aproto, 1, {
    get: function() {
        return this._v._shape1
    },
    set: function(v) {
        return this._v._shape1 = v | 0
    },
    enumerable: true
})
aproto.concat = Array.prototype.concat
aproto.join = Array.prototype.join
aproto.slice = Array.prototype.slice
aproto.toString = Array.prototype.toString
aproto.indexOf = Array.prototype.indexOf
aproto.lastIndexOf = Array.prototype.lastIndexOf
aproto.forEach = Array.prototype.forEach
aproto.every = Array.prototype.every
aproto.some = Array.prototype.some
aproto.filter = Array.prototype.filter
aproto.map = Array.prototype.map
aproto.reduce = Array.prototype.reduce
aproto.reduceRight = Array.prototype.reduceRight
Object.defineProperty(proto, 'shape', {
    get: function VShape2dfloat32_get() {
        return new VShape2dfloat32(this)
    },
    set: function VShape2dfloat32_set(v) {
        this._shape0 = v[0] | 0
        this._shape1 = v[1] | 0
        return v
    }
})
Object.defineProperty(proto, 'size', {
    get: function View2dfloat32_size() {
        return this._shape0 * this._shape1
    }
})
Object.defineProperty(proto, 'order', {
    get: function View2dfloat32_order() {
        return (Math.abs(this._stride0) > Math.abs(this._stride1)) ? [1, 0] : [0, 1]
    }
})
proto.set = function View2dfloat32_set(i0, i1, v) {
    return this.data[this.offset + this._stride0 * i0 + this._stride1 * i1] = v
}
proto.get = function View2dfloat32_get(i0, i1) {
    return this.data[this.offset + this._stride0 * i0 + this._stride1 * i1]
}
proto.index = function View2dfloat32_index(
    i0, i1
) {
    return this.offset + this._stride0 * i0 + this._stride1 * i1
}
proto.hi = function View2dfloat32_hi(i0, i1) {
    return new View2dfloat32(this.data, (typeof i0 !== 'number' || i0 < 0) ? this._shape0 : i0 | 0, (typeof i1 !== 'number' || i1 < 0) ? this._shape1 : i1 | 0, this._stride0, this._stride1, this.offset)
}
proto.lo = function View2dfloat32_lo(i0, i1) {
    var b = this.offset,
        d = 0,
        a0 = this._shape0,
        a1 = this._shape1,
        c0 = this._stride0,
        c1 = this._stride1
    if (typeof i0 === 'number' && i0 >= 0) {
        d = i0 | 0;
        b += c0 * d;
        a0 -= d
    }
    if (typeof i1 === 'number' && i1 >= 0) {
        d = i1 | 0;
        b += c1 * d;
        a1 -= d
    }
    return new View2dfloat32(this.data, a0, a1, c0, c1, b)
}
proto.step = function View2dfloat32_step(i0, i1) {
    var a0 = this._shape0,
        a1 = this._shape1,
        b0 = this._stride0,
        b1 = this._stride1,
        c = this.offset,
        d = 0,
        ceil = Math.ceil
    if (typeof i0 === 'number') {
        d = i0 | 0;
        if (d < 0) {
            c += b0 * (a0 - 1);
            a0 = ceil(-a0 / d)
        } else {
            a0 = ceil(a0 / d)
        }
        b0 *= d
    }
    if (typeof i1 === 'number') {
        d = i1 | 0;
        if (d < 0) {
            c += b1 * (a1 - 1);
            a1 = ceil(-a1 / d)
        } else {
            a1 = ceil(a1 / d)
        }
        b1 *= d
    }
    return new View2dfloat32(this.data, a0, a1, b0, b1, c)
}
proto.transpose = function View2dfloat32_transpose(i0, i1) {
    i0 = (i0 === undefined ? 0 : i0 | 0);
    i1 = (i1 === undefined ? 1 : i1 | 0)
    var a = this.shape,
        b = this.stride;
    return new View2dfloat32(this.data, a[i0], a[i1], b[i0], b[i1], this.offset)
}
proto.pick = function View2dfloat32_pick(i0, i1) {
    var a = [],
        b = [],
        c = this.offset
    if (typeof i0 === 'number' && i0 >= 0) {
        c = (c + this._stride0 * i0) | 0
    } else {
        a.push(this._shape0);
        b.push(this._stride0)
    }
    if (typeof i1 === 'number' && i1 >= 0) {
        c = (c + this._stride1 * i1) | 0
    } else {
        a.push(this._shape1);
        b.push(this._stride1)
    }
    var ctor = CTOR_LIST[a.length + 1];
    return ctor(this.data, a, b, c)
}
return function construct_View2dfloat32(data, shape, stride, offset) {
    return new View2dfloat32(data, shape[0], shape[1], stride[0], stride[1], offset)
}