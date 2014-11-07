import {NDArray, NilNDArray, ZeroNDArray}  from './lib/NDArray';

let x = new NDArray([], [], [], 0),
    y = new NilNDArray([]),
    z = new ZeroNDArray([], 0),
    f = 0;
for (var a in x) {
    f = x[a];
}
for (var b in y) {
    f = y[b];
}
for (var c in z) {
    f = c[z];
}

global.NDArray = NDArray;
