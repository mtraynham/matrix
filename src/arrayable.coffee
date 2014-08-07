class Arrayable
    constructor: () -> @elements = new Array arguments
    @name: 'Arrayable'
    @from: () ->
        new @constructor Array.from.apply @, arguments
    @of: () ->
        new @constructor Array.of.apply @, arguments
    setElements: (@elements) ->
    getElements: ->
        @elements
    get: (index) ->
        @elements[index]
    set: (index, value) ->
        @elements[index] = value
    size: () ->
        @elements.length
    fill: () ->
        @elements.fill.apply @, arguments
    pop: () ->
        @elements.pop.apply @, arguments
    push: () ->
        @elements.push.apply @, arguments
    reverse: () ->
        @elements.reverse.apply @, arguments
    shift: () ->
        @elements.shift.apply @, arguments
    splice: () ->
        @elements.splice.apply @, arguments
    unshift: () ->
        @elements.unshift.apply @, arguments
    concat: () ->
        @elements.concat.apply @, arguments
    join: () ->
        @elements.join.apply @, arguments
    slice: () ->
        @elements.slice.apply @, arguments
    toString: () ->
        @constructor.name + @elements.toString.apply @, arguments
    toLocaleString: () ->
        @constructor.name + @elements.toLocaleString.apply @, arguments
    indexOf: () ->
        @elements.indexOf.apply @, arguments
    lastIndexOf: () ->
        @elements.lastIndexOf.apply @, arguments
    forEach: () ->
        @elements.forEach.apply @, arguments
    entries: () ->
        @elements.entries.apply @, arguments
    every: () ->
        @elements.every.apply @, arguments
    some: () ->
        @elements.some.apply @, arguments
    filter: () ->
        @elements.filter.apply @, arguments
    find: () ->
        @elements.find.apply @, arguments
    findIndex: () ->
        @elements.findIndex.apply @, arguments
    keys: () ->
        @elements.keys.apply @, arguments
    map: () ->
        @elements.map.apply @, arguments
    reduce: () ->
        @elements.reduce.apply @, arguments
    reduceRight: () ->
        @elements.reduceRight.apply @, arguments
    clone: () ->
        new @constructor(@elements)