Vector = require './vector.coffee'
Arrayable = require './arrayable.coffee'

class Matrix extends Arrayable
    @name: 'Matrix'
    @create: (rows = 0, columns = 0, valueFn = () -> 0.0) ->
        matrix = new @ rows
        n = rows
        while n--
            row = new Arrayable columns
            m = columns
            while m--
                row.set m, valueFn n, m
            matrix.set n, row
        matrix
    @zeros: (rows, columns) ->
        @.create rows, columns, () -> 0.0
    @ones: (rows, columns) ->
        @.create rows, columns, () -> 1.0
    @random: (rows, columns) ->
        @.create rows, columns, () -> Math.random()
    @identity: (rows, columns) ->
        @.create rows, columns, (n, m) -> if n == m then 1.0 else 0.0
    @diagonal: (vector) ->
        length = vector.size()
        @.create length, length, (n, m) -> if n == m then vector.get n else 0.0

module.exports = Matrix