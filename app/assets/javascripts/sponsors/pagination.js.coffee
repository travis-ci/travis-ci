window.Pagination = (parent, element, collection, count) ->
  @parent = parent
  @element = element
  @collection = collection
  @currentElement = $('.page .current-page', element)
  @lastElement = $('.page .last-page', element)

  @current = 1
  @count = @paged_count = count
  @setup(['first', 'previous', 'next', 'last', 'all', 'paged'])
  @update()
  @

$.extend window.Pagination.prototype,
  setup: (keys) ->
    $.each keys, (ix, key) =>
      $('a.' + key, @element).click => @onClick(key)
  onClick: (key) ->
    @[key]()
    @update()
    false
  first: ->
    @current = 1
    @update()
  next: ->
    @current += 1
    @current = 1 if @current > @lastPage()
    @update()
  previous: ->
    @current -= 1
    @update()
  last: ->
    @current = @lastPage()
    @update()
  all: ->
    @current = 1
    @count = @length()
    @update()
  paged: ->
    @count = @paged_count
    @update()
  update: ->
    @parent.render(@page())
    @element.toggle(!@isPaged() || @lastPage() > 1)
    @element.toggleClass('first_page', @isFirst())
    @element.toggleClass('last_page', @isLast())
    @element.toggleClass('paged', @isPaged())
    @currentElement.html(@current)
    @lastElement.html(@lastPage())
  isFirst: ->
    @current == 1
  isLast: ->
    @current == @lastPage()
  isPaged: ->
    @count == @paged_count
  lastPage: ->
    current = parseInt(@length() / @count)
    rest = @length() % @count
    current + (rest > 0 ? 1 : 0)
  length: ->
    @collection.length
  page: ->
    @collection.slice(@start(), @end())
  start: ->
    (@current - 1) * @count
  end: ->
    @start() + @count
