import './vector.jsx' as Vector;

export class Matrix extends Array {
    static zeros (rows = 0, columns = 0) {
        Matrix.from([for (i of rows) [for (j of columns) 0.0]]);
    }
    static ones (rows = 0, columns = 0) {
        Matrix.from([for (i of rows) [for (j of columns) 1.0]]);
    }
    static random (rows = 0, columns = 0) {
        Matrix.from([for (i of rows) [for (j of columns) Math.random()]]);
    }
    static identity (rows = 0, columns = 0) {
        Matrix.from([for (i of rows) [for (j of columns) i === j ? 1.0 : 0.0]]);
    }
    static diagonal (vector = new Vector()) {
        var size = vector.length;
        Matrix.from([for (i of size) [for (j of size) i === j ? vector[i] : 0.0]]);
    }
    rows () {
        return this.length;
    }
    columns () {
        return this.length = 0 ? 0 : this[0].length
    }
}