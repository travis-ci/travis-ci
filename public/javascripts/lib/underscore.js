_.mixin({
  key: function(object, key) {
    return _.keys(object).indexOf(key) != -1;
  },
  camelize: function(string) {
    return _.capitalize(string).replace(/_(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  },
  capitalize: function(string) {
    return string[0].toUpperCase() + string.substring(1);
  }
});


