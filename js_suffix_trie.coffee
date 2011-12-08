class JsSuffixTrie

  constructor: (@structure = {}) -> @count = 0
  
  add: (string) ->
    node = @structure
    length = string.length
    index = 0
    
    while index++ < length
      chr = string[index]
      next = node[chr]
      
      if next
        parent = next
      else
        node[chr] = {}
        node = node[chr]
      
    if node.terminator
      false
    else
      node.terminator = true
      @count++
      true
    
  remove: (string) ->
    node = @structure
    length = string.length
    index = 0
    
    while index++ < length
      chr = string[index]
      node = node[chr]
      return false unless node
      
    if node.terminator
      delete node.terminator
      @count--
      true
    else
      false
  
  contains: (string) ->
    node = @structure
    length = string.length
    index = 0
  
    while index++ < length
      currentChar = string[index]
      node = node[currentChar]
      return false unless node
      
    return node.terminator == true
    
  each: (callback) -> JsSuffixTrie.each(callback, @structure, 0, "")
    
  @each: (callback, node, index, string) ->
    callback(index++, string) if node.terminator
  
    for property of node
      index = @each(callback, node[property], index, string + property)
      
    index

  size: -> @count
  
  calculateSize: (node = @structure) ->
    size = if node.terminator then 1 else 0
    
    for property of node
      size += @calculateSize node[property]
      
    size
  
  @fromArray: (array) ->
    tree = new DictionaryTree

    length = array.length
    i = 0
    tree.add array[i] while i++ < length

    tree.calculateSize()
    tree
    
  toArray: ->
    array = []
    @each (index, value) -> array[index] = value
    array

  @fromJSON: (json) ->
    tree = new DictionaryTree(JSON.parse json)
    tree.calculateSize()
    tree  
  
  toJSON: -> JSON.stringify @structure
