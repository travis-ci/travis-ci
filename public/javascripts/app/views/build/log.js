Travis.Views.Build.Log = Backbone.View.extend({
  initialize: function() {
    _.bindAll(this, 'render', 'setLog', 'appendLog');
    _.extend(this, this.options);
    this.template = Travis.templates['build/log'];
    if(this.model) this.attachTo(this.model);
  },
  detach: function() {
    if(this.model) {
      this.model.unbind('change:log', this.setLog);
      this.model.unbind('append:log', this.appendLog);
      delete this.model;
    }
  },
  attachTo: function(model) {
    this.detach();
    this.model = model;
    this.model.bind('change:log', this.setLog)
    this.model.bind('append:log', this.appendLog)
  },
  render: function() {
    this.el = $(this.template({ log: Utils.filterLog(this.model.get('log') || '') }));
    return this;
  },
  initializeEvents: function() {
    var self = this
    _.each(this.el.find('a.linum'), function(el) {
      $(el).click(function(){
        var e = window.params;
        // TODO: CREATE PATH HELPERS??
        // Why haven't I done it through anchor + tag? B/c i hate element like that:
        //     <a href="/#!/josevalim/enginex/L31" name="#!/josevalim/enginex/L31">LINE CONTENTS</a>.
        // I think it's easier to create event once here than do it through native anchors.
        window.location.href = [ "#!/", e.owner, "/", e.name, "/L", $(el).attr('name').replace('line', '') ].join('')
      })
    })
  },
  activateCurrentLine: function() {
    if(window.params.line_number) {
      var line_element = this.el.find("a[name='line" + window.params.line_number  + "']")
      $(window).scrollTop(line_element.offset().top)
      line_element.parent().addClass("highlight")
    }
  },
  setLog: function() {
    this.el.html(Utils.filterLog(this.model.get('log') || ''));
  },
  appendLog: function(chars) {
    if(chars) {
      this.el.html(Utils.filterLog(this.el.html() + chars));
    }
  }
});
