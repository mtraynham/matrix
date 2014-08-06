precision = 1e-14

class Vector
    constructor: (@elements) ->
    @fill: (n, value) ->
        elements = []
        i = n
        while i--
            elements[i] = value
        new @constructor(elements)
    @zero: (n) -> @constructor.fill n, 0.0
    @ones: (n) -> @constructor.fill n, 1.0
    @random: (n) ->
        elements = []
        i = n
        while i--
            elements[i] = Math.random()
        new @constructor(elements)
    setElements: (@elements) ->
    getElements: -> @elements
    getElement: (index) ->
        if i >= 0 && i < @elements.length then @elements[index] else null
    setElement: (index, value) ->
        @elements[index] = value
    dimensions: () -> @elements.length
    equals: (other) ->
        i = @elements.length
        otherElements = other.getElements()
        if i != otherElements.length
            return false
        while i--
            if Math.abs(this.elements[i] - otherElements[i]) > precision then return false
        true
    clone: () -> @constructor(@elements)
    map: (fn, context) -> new @constructor(@elements.map fn, context)
    forEach: (fn, context) -> @elements.forEach fn, context
    reduce: (fn, initial, context) -> @elements.reduce fn, initial, context
    dot: (other) ->
        i = @elements.length
        otherElements = other.getElements()
        if i != otherElements.length
            return null
        product = 0
        while i--
            product += @elements[i] * otherElements[i]
        product
    modulus: () -> Math.sqrt @dot(@)
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
        otherElements = other.getElements()
        if @elements.length != otherElements.length
            return null
        @map (x, i) -> x + otherElements[i]
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
    toString: () ->
        '[' + @elements.join(', ') + ']'


class Matrix extends Vector
    constructor: (@elements) ->
    @fill: (n, m, value) ->
        elements = []
        i = n
        while i--
            elements[i] = []
            j = m
            while j--
                elements[i][j] = value
        new @constructor(elements)
    @zero: (n, m) -> @constructor.fill n, m, 0.0
    @ones: (n, m) -> @constructor.fill n, m, 1.0
    @identity: (n) ->
        elements = []
        i = n
        while i--
            elements[i] = []
            j = n
            while j--
                elements[i][j] = if i == j then 1.0 else 0.0
        new @constructor(elements)
    @diagonal: (vector) ->
        elements = []
        i = vector.length
        while i--
            elements[i] = []
            j = n
            while j--
                elements[i][j] = if i == j then vector[i] else 0.0
        new @constructor(elements)



global.Matrix = Matrix