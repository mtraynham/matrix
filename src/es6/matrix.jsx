import './vector.jsx' as Vector

export class Matrix extends Array {
    static create (rows = 0, columns = 0, valueFn = () => 0.0)
    static zeros (rows = 0, columns = 0) {
        Matrix.from([for (i of rows) [for (j of columns) 0.0]])
    }
    static ones (rows = 0, columns = 0) {
        Matrix.from([for (i of rows) [for (j of columns) 1.0]])
    }
    static random (rows = 0, columns = 0) {
        Matrix.from([for (i of rows) [for (j of columns) Math.random()]])
    }
    static identity (rows = 0, columns = 0) {
        Matrix.from([for (i of rows) [for (j of columns) i == j ? 1.0 : 0.0]])
    }
    static diagonal (vector = 0) {
        var size = vector.length;
        Matrix.from([for (i of size) [for (j of size) i == j ? vector[i] : 0.0]])
    }
}