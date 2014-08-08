# Acts as a wrapper for the Array object
# Should be easier with ECMA6, maybe they will just extend Array
class Arrayable
    constructor: () ->
        if arguments.length > 1
            @elements = arguments.slice()
        else if Array.isArray arguments[0]
            @elements = arguments[0].slice()
        else
            @elements = new Array(arguments)
    @name: 'Arrayable'
    @from: () ->
        new @ Array.from.apply @elements, arguments
    @of: () ->
        new @ Array.of.apply @elements, arguments
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
        @elements.fill.apply @elements, arguments
    pop: () ->
        @elements.pop.apply @elements, arguments
    push: () ->
        @elements.push.apply @elements, arguments
    reverse: () ->
        @elements.reverse.apply @elements, arguments
    shift: () ->
        @elements.shift.apply @elements, arguments
    splice: () ->
        @elements.splice.apply @elements, arguments
    unshift: () ->
        @elements.unshift.apply @elements, arguments
    concat: () ->
        @elements.concat.apply @elements, arguments
    join: () ->
        @elements.join.apply @elements, arguments
    slice: () ->
        new @constructor @elements.slice.apply @elements, arguments
    toString: () ->
        @constructor.name + ' [' + @elements.toString.apply @elements, arguments + ']'
    toLocaleString: () ->
        @constructor.name + ' [' + @elements.toLocaleString.apply @elements, arguments + ']'
    indexOf: () ->
        @elements.indexOf.apply @elements, arguments
    lastIndexOf: () ->
        @elements.lastIndexOf.apply @elements, arguments
    forEach: () ->
        @elements.forEach.apply @elements, arguments
    entries: () ->
        @elements.entries.apply @elements, arguments
    every: () ->
        @elements.every.apply @elements, arguments
    some: () ->
        @elements.some.apply @elements, arguments
    filter: () ->
        @elements.filter.apply @elements, arguments
    find: () ->
        @elements.find.apply @elements, arguments
    findIndex: () ->
        @elements.findIndex.apply @elements, arguments
    keys: () ->
        @elements.keys.apply @elements, arguments
    map: () ->
        new @constructor @elements.map.apply @elements, arguments
    reduce: () ->
        @elements.reduce.apply @elements, arguments
    reduceRight: () ->
        @elements.reduceRight.apply @elements, arguments
    clone: () ->
        new @constructor @elements

module.exports = Arrayable