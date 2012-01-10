Travis.Controllers.PageManager = Ember.Object.extend({
  activate: function(page, params) {
    if (this.get('active') !== page) {
      this.destroy();
      Ember.run.next(function() {
        this.set('params', params);
        this.create(page);
        this.set('active', page);
      }.bind(this));
    }
  },

  create: function(page) {
    if (this.pages) {
      this.page = this.pages[page].create({ parent: this.parent, selector: '#page_' + page + ' .page' });
      this.page.view.replaceIn('#main');
    }
  },

  destroy: function() {
    if (this.page) this.page.destroy();
    delete this.page;
  }
});

