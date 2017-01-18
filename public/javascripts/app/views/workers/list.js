Travis.Views.Workers.List = Travis.Views.Base.List.extend({
  name: 'workers',
  re: function () {
    return re =  /(.*):([0-9]*):(.*)/;
  },
  itemsMatch: function (item) {
    return this.previousItem.id.match(this.re())[1] == item.id.match(this.re())[1] && this.previousItem.id.match(this.re())[3] == item.id.match(this.re())[3]
  }
});
