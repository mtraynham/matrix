interface INDArray<T> {
    data: Array<T>;
    shape: Array<number>;
    stride: Array<number>;
    size: number;
    order: Array<number>;
    index (...indices: number[]): number;
    get (...indices: number[]): T;
    set (value: T, ...indices: number[]);
    lo (...indices: number[]): INDArray<T>;
    hi (...indices: number[]): INDArray<T>;
    step (...indices: number[]): INDArray<T>;
    transpose (...axes: number[]): INDArray<T>;
    pick (...axes: number[]): INDArray<T>;
    toJSON ();
}

export default INDArray;
