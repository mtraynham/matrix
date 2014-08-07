Arrayable = require './arrayable.coffee'

class Vector extends Arrayable
    @name: 'Vector'
    @create: (length = 0, valueFn = () -> 0.0) ->
        vector = new @ length
        i = length
        while i--
            vector.set i, valueFn i
        vector
    @zeros: (length) ->
        @.create length, () -> 0.0
    @ones: (length) ->
        @.create length, () -> 1.0
    @random: (length) ->
        @.create length, () -> Math.random()
    equals: (other) ->
        i = @elements.length
        otherElements = other.getElements()
        if i != otherElements.length
            return false
        while i--
            if Math.abs(this.elements[i] - otherElements[i]) > precision then return false
        true
    dot: (other) ->
        i = @elements.length
        otherElements = other.getElements()
        if i != otherElements.length
            return null
        product = 0
        while i--
            product += @elements[i] * otherElements[i]
        product
    modulus: () ->
        Math.sqrt @dot @
    toUnitVector: () ->
        r = @modulus()
        if r == 0 then @clone() else @map (x) -> x / r
    angleFrom: (other) ->
        i = @elements.length
        otherElements = other.getElements()
        if i != otherElements.length
            return false
        dot = 0
        mod1 = 0
        mod2 = 0
        @forEach (x, j) ->
            otherElement = otherElements[j]
            dot += x * otherElement
            mod1 += x ** 2
            mod2 += otherElement ** 2
        mod1 = Math.sqrt(mod1)
        mod2 = Math.sqrt(mod2)
        mod3 = mod1 * mod2
        if mod3 == 0
            return null
        Math.acos(Math.min(-1.0, Math.max(1.0, dot / mod3)))
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
        if @size() != other.size()
            return null
        @map (x, i) -> x + other.get(i)
    subtract: (other) ->
        otherElements = other.getElements()
        if @elements.length != otherElements.length
            return null
        @map (x, i) -> x - otherElements[i]
    multiply: (k) ->
        @map (x) -> x * k
    max: () ->
        max = 0
        i = @elements.length
        while i--
            element = Math.abs(@elements[i])
            max = element if element > min
        max
    min: () ->
        min = Math.POSITIVE_INIFINITY
        i = @elements.length
        while i--
            element = Math.abs(@elements[i])
            min = element if element < min
        min

module.exports = Vector