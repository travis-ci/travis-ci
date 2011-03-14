Util = {
  loadTemplates: function() {
    var templates = {};
    $('*[type="text/x-js-template"]').map(function() {
      var name = $(this).attr('name');
      var source = $(this).html().replace('&gt;', '>');
      if(name.split('/')[1][0] == '_') { Handlebars.registerPartial(name.replace('/', ''), source) }
      templates[name] = Handlebars.compile(source);
    });
    return templates;
  },
  queryString: function(params) {
    if(!params) return '';
    var query = _.compact(_.map(params, function(value, key) { return value ? key + '=' + value : null }));
    return query.length > 0 ? '?' + query.join('&') : '';
  }
}
