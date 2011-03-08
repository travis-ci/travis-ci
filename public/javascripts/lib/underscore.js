_.mixin({
  camelize: function(string) {
    return _.capitalize(string).replace(/_(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  },
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
  }
});


