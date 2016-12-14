Travis.Views.MobileBaseView = Ember.View.extend({
  attributeBindings: ['data-role']
});

Travis.Views.PageView = Travis.Views.MobileBaseView.extend({
  'data-role': 'page',

  didInsertElement: function() {
    var _self = this;
    Ember.run.next(function() {
      _self.$().page();
    });
  }
});

Travis.Views.ToolbarBaseView = Travis.Views.MobileBaseView.extend({
  attributeBindings: ['data-position'],
  'data-position': function() {
    if (this.get('isFullScreen')) {
      return 'fullscreen';
    }

    if (this.get('isFixed')) {
      return 'fixed';
    }
    return '';
  }.property('isFixed', 'isFullScreen').cacheable(),

  isFixed: true,
  isFullScreen: false
});

Travis.Views.HeaderView = Travis.Views.ToolbarBaseView.extend({
  'data-role': 'header'
});

Travis.Views.ContentView = Travis.Views.MobileBaseView.extend({
  'data-role': 'content'
});

Travis.Views.FooterView = Travis.Views.MobileBaseView.extend({
  'data-role': 'footer'
});

Travis.Views.ListItemView = Ember.View.extend({
  tagName: 'li'
});

Travis.Views.ListView = Ember.CollectionView.extend({
  attributeBindings: ['data-role'],
  'data-role': 'listview',
  tagName: 'ul',
  itemViewClass: Travis.Views.ListItemView,

  contentLengthDidChange: function() {
    var _self = this;
    Ember.run.next(function() {
      _self.$().listview();
    });
  }.observes('content.length')
});

Travis.Views.Button = Ember.Button.extend({});
