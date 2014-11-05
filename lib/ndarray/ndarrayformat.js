var iota = function (n) {
    var result = new Array(n);
    for (var i = 0; i < n; ++i) {
        result[i] = i;
    }
    return result;
};

var arrayMethods = [
    'concat',
    'join',
    'slice',
    'toString',
    'indexOf',
    'lastIndexOf',
    'forEach',
    'every',
    'some',
    'filter',
    'map',
    'reduce',
    'reduceRight'
];

var CACHED_CONSTRUCTORS = {
    'float32':[],
    'float64':[],
    'int8':[],
    'int16':[],
    'int32':[],
    'uint8':[],
    'uint16':[],
    'uint32':[],
    'array':[],
    'uint8_clamped':[],
    'buffer':[],
    'generic':[]
};

var hasTypedArrays = ((typeof Float64Array) !== 'undefined');
var hasBuffer = ((typeof Buffer) !== 'undefined');

function compare1st(a, b) {
    return a[0] - b[0];
}

function order() {
    var stride = this.stride;
    var terms = new Array(stride.length);
    var i;
    for (i = 0; i < terms.length; ++i) {
        terms[i] = [Math.abs(stride[i]), i];
    }
    terms.sort(compare1st);
    var result = new Array(terms.length);
    for (i = 0; i < result.length; ++i) {
        result[i] = terms[i][1];
    }
    return result;
}

function compileConstructor(dtype, dimension) {
    var className = ['View', dimension, 'd', dtype].join('');
    if (dimension < 0) {
        className = 'View_Nil' + dtype;
    }
    var useGetters = (dtype === 'generic');

    if (dimension === -1) {
        //Special case for trivial arrays
        var codeA =
            'function ' + className + '(a) { this.data = a; };' +
            'var proto = ' + className + '.prototype;' +
            'proto.dtype = \'' + dtype + '\';' +
            'proto.index = function () { return -1 }; ' +
            'proto.size = 0;' +
            'proto.dimension = 1;' +
            'proto.shape = proto.stride = proto.order = [];' +
            'proto.lo = proto.hi = proto.transpose = proto.step = ' +
                'function () { return new ' + className + '(this.data); };' +
            'proto.get = proto.set = function () {};' +
            'proto.pick = function () { return null; };' +
            'return function construct_' + className + '(a) { return new ' + className + '(a); }';
        var procedureA = new Function(codeA);
        return procedureA();
    } else if (dimension === 0) {
        //Special case for 0d arrays
        var codeB =
            'function ' + className + '(a, d) { this.data = a; this.offset = d; }' +
            'var proto = ' + className + '.prototype;' +
            'proto.dtype = \'' + dtype + '\';' +
            'proto.index = function () { return this.offset };' +
            'proto.dimension = 0;' +
            'proto.size = 1;' +
            'proto.shape = proto.stride = proto.order = [];' +
            'proto.hi = proto.lo = proto.transpose = proto.step = ' +
                'function ' + className + '_copy () { return new ' + className + '(this.data, this.offset); }' +
            'proto.pick = function ' + className + '_pick () { return TrivialArray(this.data) };' +
            'proto.valueOf = proto.get = function ' + className + '_get () {' +
                'return ' + (useGetters ? 'this.data.get(this.offset)' : 'this.data[this.offset]') + '; }' +
            'proto.set = function ' + className + '_set (v) {' +
                'return ' + (useGetters ? 'this.data.set(this.offset, v)' : 'this.data[this.offset] = v') + ': }' +
            'return function construct_' + className + '(a, b, c, d) { return new ' + className + '(a, d); }';
        var procedureB = new Function('TrivialArray', codeB);
        return procedureB(CACHED_CONSTRUCTORS[dtype][0]);
    }

    //Create constructor for view
    var code = ['\'use strict\''];
    var indices = iota(dimension);
    var args = indices.map(function (i) { return 'i' + i; });
    var indexStr = 'this.offset + ' + indices.map(function (i) {
        return 'this._stride' + i + '* i' + i ;
    }).join('+');
    code.push('function ' + className + '(a, ' +
        indices.map(function (i) { return 'b' + i; }).join(',') +
        indices.map(function (i) { return 'c' + i; }).join(',') +
        ', d) { this.data = a; ');
    for (var i = 0; i < dimension; i++) {
        code.push('this._shape' + i + ' = b' + i + '|0;' );
    }
    for (var j = 0; j < dimension; j++) {
        code.push('this._stride' + j + ' = c' + j + '|0;' );
    }
    code.push(
        'this.offset = d|0',
        'var proto = ' + className + '.prototype;',
        'proto.dtype = \'' + dtype + '\';',
        'proto.dimension = ' + dimension);
    //view.stride and view.shape
    var strideClassName = 'VStride' + dimension + 'd' + dtype;
    var shapeClassName = 'VShape' + dimension + 'd' + dtype;
    var props = {'stride': strideClassName, 'shape': shapeClassName};
    for (var prop in props) {
        var arrayName = props[prop];
        code.push(
            'function ' + arrayName + '(v) { this._v = v; };',
            'var aproto = ' + arrayName + '.prototype',
            'aproto.length = ' + dimension);
        var arrayElements = [];
        for (var k = 0; k < dimension; k++) {
            arrayElements.push('this._v._' + prop + k);
        }
        code.push(
            'aproto.toJSON = function ' + arrayName + '_toJSON () { return [' + arrayElements.join(', ') + ']; }',
            'aproto.valueOf = aproto.toString = function ' + arrayName +
                '_toString () { return [' + arrayElements.join(', ') + '].join(); }');
        for (var l = 0; l < dimension; l++) {
            code.push('Object.defineProperty(aproto, ' + l + ', {' +
                'get: function () { return this._v._' + prop + l + '},' +
                'set: function (v) { return this._v_' + prop + l + ' = v|0},' +
                'enumerable: true' +
            '})');
        }
        for (var m = 0; m < arrayMethods.length; m++) {
            if (arrayMethods[m] in Array.prototype) {
                code.push('aproto.' + arrayMethods[i] + ' = Array.prototype' + arrayMethods[m]);
            }
        }
        code.push('Object.defineProperty(proto, ' + prop + ', {' +
            'get: function ' + arrayName + '_get() { return new ' + arrayName + '(this); },' +
            'set: function ' + arrayName + '_set(v) {');
        for (var n = 0; n < dimension; n++) {
            code.push('this._' + prop + n + ' = v[' + n + ']|0;');
        }
        code.push('return v; }})');
    }

    // view.size
    code.push('Object.defineProperty(proto, \'size\', {' +
        'get: function ' + className + '_size () { return ' +
            indices.map(function (i) { return 'this._shape' + i; }).join('*') +
        '; }' +
    '})');

    // view.order
    if (dimension === 1) {
        code.push('proto.order = [0];');
    } else {
        code.push('Object.defineProperty(proto, \'order\', {get: ');
        if (dimension < 4) {
            code.push('function ' + className + '_order () { ');
            if (dimension === 2) {
                code.push('return (Math.abs(this._stride0) > Math.abs(this._stride1)) ? [1,0] : [0,1]; }})');
            } else if (dimension === 3) {
                code.push(
                    'var s0 = Math.abs(this._stride0),' +
                        's1=Math.abs(this._stride1),' +
                        's2=Math.abs(this._stride2);' +
                    'if (s0 > s1) {' +
                        'if (s1 > s2) {' +
                            'return [2, 1, 0];' +
                        '} else if (s0 > s2) {' +
                            'return [1, 2, 0];' +
                        '} else {' +
                            'return [1, 0, 2];' +
                        '}' +
                    '} else {' +
                        'if (s0 > s2) {' +
                            'return [2, 0, 1];' +
                        '} else if (s2 > s1) {' +
                            'return [0, 1, 2];' +
                        '} else {' +
                            'return [0, 2, 1];' +
                        '}' +
                    '}})');
            }
        } else {
            code.push('ORDER; }');
        }
    }

    // view.set(i0, ..., v):
    code.push('proto.set = function ' + className + '_set (' + args.join(', ') + ', v) {');
    if (useGetters) {
        code.push('return this.data.set(' + indexStr + ', v); }');
    } else {
        code.push('return this.data[' + indexStr + '] = v; }');
    }

    // view.get(i0, ...):
    code.push('proto.get = function ' + className + '_get(' + args.join(', ') + ') {');
    if (useGetters) {
        code.push('return this.data.get(' + indexStr + '); }');
    } else {
        code.push('return this.data[' + indexStr + ']; }');
    }

    // view.index:
    code.push('proto.index = function ' + className + '_index (' + args.join(', ') + ') { return ' + indexStr + '; }');

    // view.hi
    code.push('proto.hi = function ' + className + '_hi (' + args.join(', ') + ') { return new ' + className + '(' +
        'this.data, ' +
        indices.map (function (i) {
            return '(typeof i' + i + ' !== \'number\' || i' + i + ' < 0) ? this._shape' + i + ' : i' + i + '|0';
        }).join(', ') + ', ' +
        indices.map (function (i) {
            return 'this._stride' + i;
        }).join(', ') + ', this.offset); }');

    // view.lo
    var aVars = indices.map(function (i) { return 'a' + i + ' = this._shape' + i; });
    var cVars = indices.map(function (i) { return 'c' + i + ' = this._stride' + i; });
    code.push('proto.lo = function ' + className + '_lo (' + args.join(', ') + ') {' +
        'var b = this.offset,' +
            'd = 0,' +
            aVars.join(',') + ',' +
            cVars.join(',') + ';');
    for (var o = 0; o < dimension; o++) {
        code.push('if (typeof i' + i + ' === \'number\' && i' + i + ' >= 0) {' +
            'd = i' + i + '|0;' +
            'b *= c' + i + ' * d;' +
            'a' + i + ' -= d;' +
        '}');
    }
    code.push('return new ' + className + '(' +
            'this.data, ' +
            indices.map(function (i) { return 'a' + i; }).join(', ') + ', ' +
            indices.map(function (i) { return 'c' + i; }).join(', ') + ', b); }');

    // view.step();
    code.push('proto.step = function ' + className + '_step (' + args.join(', ') + ') {' +
        'var ' +
            indices.map(function (i) { return 'a' + i + ' = this._shape' + 'i'; }).join(', ') + ', ' +
            indices.map(function (i) { return 'b' + i + ' = this._stride' + 'i'; }).join(', ') + ', ' +
            'c = this.offset, ' +
            'd = 0, ' +
            'ceil = Math.ceil;');
    for (var p = 0; p < dimension; p++) {
        code.push(
            'if (typeof i' + i + ' === \'number\') {' +
                'd = i' + i + '|0;' +
                'if (d < 0) {' +
                    'c += b' + i + ' * (a' + i + ' - 1);' +
                    'a' + i + ' = ceil(a' + i + '/ d);' +
                '} else {' +
                    'a' + i + ' = ceil(a' + i + '/ d);' +
                '}' +
                'b' + i + ' *= d;');
    }
    code.push('return new ' + className + '(' +
            'this.data, ' +
            indices.map(function (i) { return 'a' + i; }).join(', ') + ', ' +
            indices.map(function (i) { return 'c' + i; }).join(', ') + ', c); }');

    // view.transpose():
    var tShape = new Array(dimension);
    var tStride = new Array(dimension);
    for (var q = 0; q < dimension; q++) {
        tShape[i] = 'a[i' + i + '];';
        tStride[i] = 'b[i' + i + '];';
    }
    code.push('proto.transform = function ' + className + '_transpose (' + args + ') {' +
        args.map(function (n, idx) {
            return n + ' = (' + n + ' === undefined ? ' + idx + ' : ' + n + '|0';
        }).join('; ') +
        'var a = this.shape, ' +
            'b = this.stride; ' +
        'return new ' + className + '(this.data, ' +
            tShape.join(', ') + ', ' + tStride.join(', ') + ', this.offset); }');

    // view.pick()
    code.push('proto.pick = function ' + className + '_pick (' + args + ') {' +
        'var a = [], ' +
            'b = [], ' +
            'c = this.offset');
    for (var r = 0; r < dimension; r++) {
        code.push(
            'if (typeof i' + i + ' === \'number\' && i' + i + ' >= 0) {' +
                'c = (c + this._stride' + i + ' * i' + i + ');' +
            '} else {' +
                'a.push(this._shape' + i + ');' +
                'b.push(this._stride' + i + ');' +
            '}');
    }

    //Add return statement
    code.push('var ctor = CTOR_LIST[a.length + 1];');
    code.push('return ctor(this.data, a, b, c); }');
    code.push('return function construct_' + className + ' (data, shape, stride, offset) {' +
        'return new ' + className + '(data, ' +
            indices.map(function (i) { return 'shape[' + i + ']'; }).join(', ') + ', ' +
            indices.map(function (i) { return 'stride[' + i + ']'; }).join(', ') + ', ' +
            'offset); }');

    //Compile procedure
    var procedure = new Function('CTOR_LIST', 'ORDER', code.join('\n'));
    return procedure(CACHED_CONSTRUCTORS[dtype], order);
}

function arrayDType(data) {
    if (hasBuffer) {
        if (Buffer.isBuffer(data)) {
          return 'buffer';
        }
    }
    if (hasTypedArrays) {
        switch (Object.prototype.toString.call(data)) {
            case '[object Float64Array]':
                return 'float64';
            case '[object Float32Array]':
                return 'float32';
            case '[object Int8Array]':
                return 'int8';
            case '[object Int16Array]':
                return 'int16';
            case '[object Int32Array]':
                return 'int32';
            case '[object Uint8Array]':
                return 'uint8';
            case '[object Uint16Array]':
                return 'uint16';
            case '[object Uint32Array]':
                return 'uint32';
            case '[object Uint8ClampedArray]':
                return 'uint8_clamped';
        }
    }
    if (Array.isArray(data)) {
        return 'array';
    }
    return 'generic';
}

for (var id in CACHED_CONSTRUCTORS) {
    CACHED_CONSTRUCTORS[id].push(compileConstructor(id, -1));
}

function wrappedNDArrayCtor(data, shape, stride, offset) {
    if (data === undefined) {
        return CACHED_CONSTRUCTORS.array[0];
    } else if (typeof data === 'number') {
        data = [data];
    }
    if (shape === undefined) {
        shape = [data.length];
    }
    var d = shape.length;
    if (stride === undefined) {
        stride = new Array(d);
        for (var i = d - 1, sz = 1; i >= 0; --i) {
            stride[i] = sz;
            sz *= shape[i];
        }
    }
    if (offset === undefined) {
        offset = 0;
        for (var s = 0; s < d; s++) {
            if (stride[s] < 0) {
                offset -= (shape[s] - 1) * stride[s];
            }
        }
    }
    var dtype = arrayDType(data);
    var ctorList = CACHED_CONSTRUCTORS[dtype];
    while (ctorList.length <= d + 1) {
        ctorList.push(compileConstructor(dtype, ctorList.length - 1));
    }
    var ctor = ctorList[d + 1];
    return ctor(data, shape, stride, offset);
}

module.exports = wrappedNDArrayCtor;