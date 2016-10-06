Travis.Views.Jobs.List = Travis.Views.Base.List.extend({
  name: 'jobs',
  elementRemoved: function(item) {
    $(this.selectors.item + item.get('id')).remove();
  },
});
