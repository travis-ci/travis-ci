Travis.Controllers.Branches.List = Ember.ArrayController.extend({
  contentBinding: 'parent.repository.branches',

  init: function() {
    this._super();

    this.view = Ember.View.create({
      branches: this,
      templateName: 'app/templates/branches/list'
    });
  },

});
