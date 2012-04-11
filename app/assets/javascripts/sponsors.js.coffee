if !Array.prototype.shuffle
  Array.prototype.shuffle = () ->
    array = @slice()
    top = array.length
    while top && --top
      current = Math.floor(Math.random() * (top + 1))
      tmp = array[current]
      array[current] = array[top]
      array[top] = tmp
    array

Sponsors = (element, collection, options) ->
  @element = element
  @pagination = new Pagination(this, $('.pagination', @element.parent()), collection.shuffle(), 1)
  @
$.extend Sponsors,
  PACKAGES: ['platinum', 'gold', 'silver']
  SPEED: 15000
  load: (callback) ->
    $.get '/sponsors.json', (bundles) =>
      callback(Sponsors.decksFrom(bundles))
  decksFrom: (bundles) ->
    decks = { banner: [], text: [] }
    for bundle of bundles
      sponsors = bundles[bundle].shuffle()
      count = Deck.COUNTS[bundle]
      type = if bundle == 'silver' then 'text' else 'banner'
      decks[type].push(new Deck(type, bundle, sponsors.slice(i, i + count))) for i in [0..sponsors.length - 1] by count
    decks
$.extend Sponsors.prototype,
  clear: ->
    @element.empty()
  render: (page) ->
    @clear()
    @element.append(deck.render()) for deck in page
  run: ->
    if @pagination
      doRun = ->
        @pagination.next()
        @run()
      setTimeout(doRun.bind(@), @speed || Sponsors.SPEED)

Deck = (type, bundle, sponsors) ->
  @type = type
  @bundle = bundle
  @sponsors = if type == 'banner' then @fill(sponsors) else sponsors
  @
$.extend Deck,
  COUNTS:
    platinum: 1
    gold: 2
    silver: 6
$.extend Deck.prototype,
  fill: (sponsors)->
    sponsors.push({ image: @placeholder() }) while sponsors.length < Deck.COUNTS[@bundle]
    sponsors
  placeholder: ->
    '/images/placeholder-' + @bundle + '.png'
  render: ->
    node = $('<ul class="' + @bundle + '"></ul>')
    node.append(new Sponsor(@type, sponsor).render()) for sponsor in @sponsors
    node

Sponsor = (type, data) ->
  @type = type
  @data = data
  @
$.extend Sponsor.prototype,
  render: ->
    node = $('<li></li>')
    html = if @type == 'banner'
      '<a href="' + @data.url + '"><img src="' + @data.image + '"></a>' + @data.text
    else
      @data.link
    node.append($(html))
    node

$.fn.sponsors = (decks, options) ->
  new Sponsors(@, decks, options).run()

$ ->
  unless $('.sponsors').length == 0
    Sponsors.load (decks)->
      $('#right .sponsors.top').sponsors(decks['banner'])
      $('#right .sponsors.bottom').sponsors(decks['text'])
