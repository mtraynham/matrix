Arrayable = require './arrayable.coffee'

class Vector extends Arrayable
    @name: 'Vector'
    @create: (length = 0, valueFn = () -> 0.0) ->
        vector = new @ length
        vector.set i, valueFn i for i in [0..length - 1] by 1
        vector
    @zeros: (length) ->
        @.create length, () -> 0.0
    @ones: (length) ->
        @.create length, () -> 1.0
    @random: (length) ->
        @.create length, () -> Math.random()
    equals: (other) ->
        otherElements = other.getElements()
        if @size() != otherElements.length
            return false
        @every (element, index) ->
            Math.abs(element - otherElements[index]) > precision
    dot: (other) ->
        otherElements = other.getElements()
        if @size() != otherElements.length
            return null
        @reduce ((previous, element, index) ->
            previous += element * otherElements[index]), 0
    modulus: () ->
        Math.sqrt @dot @
    toUnitVector: () ->
        r = @modulus()
        if r == 0 then @clone() else @map (x) -> x / r
    angleFrom: (other) ->
        otherElements = other.getElements()
        if @size() != otherElements.length
            return null
        vals = @reduce (previous, element, index) ->
            otherElement = otherElements[index]
            previous.dot += element * otherElement
            previous.mod1 += element ** 2
            previous.mod2 += otherElement ** 2
            previous
        , dot: 0, mod1: 0, mod2: 0
        vals.mod1 = Math.sqrt(vals.mod1)
        vals.mod2 = Math.sqrt(vals.mod2)
        mod3 = mod1 * mod2
        if mod3 != 0 then Math.acos(Math.max(-1.0, Math.min(1.0, vals.dot / mod3))) else null
    isParallelTo: (other) ->
        angle = @angleFrom(other)
        if !angle then null else angle <= precision
    isAntiParallelTo: (other) ->
        angle = @angleFrom(other)
        if !angle then null else Math.abs(angle - Math.PI) <= precision
    isPerpendicularTo: (other) ->
        dot = @.dot(other)
        if !dot then Math.abs(dot) <= precision else null
    add: (other) ->
        otherElements = other.getElements()
        if @size() != otherElements.length
            return null
        @map (element, index) ->
            element + otherElements[index]
    subtract: (other) ->
        otherElements = other.getElements()
        if @size() != otherElements.length
            return null
        @map (element, index) ->
            element - otherElements[index]
    multiply: (k) ->
        @map (element) ->
            element * k
    max: () ->
        @reduce ((previous, element) ->
            Math.max(previous, element)), 0
    min: () ->
        min = @reduce ((previous, element) ->
            Math.min(previous, element)), Number.POSITIVE_INFINITY
        if min == Number.POSITIVE_INFINITY then 0 else min

module.exports = Vector