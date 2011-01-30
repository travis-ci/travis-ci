$.fn.flash = function() {
  Util.flash(this);
}
$.fn.unflash = function() {
  Util.unflash(this);
}
$.fn.deansi = function() {
  this.html(Util.deansi(this.html()));
}
$.fn.update_times = function() {
  Util.update_times(this);
}
$.fn.activate_tab = function(tab) {
  Util.activate_tab(this, tab);
}
$.fn.readable_time = function() {
  $(this).each(function() { $(this).text(Util.readable_time(parseInt($(this).attr('title')))); })
}

Util = {
  activate_tab: function(element, tab) {
    $('.tabs li', element).removeClass('active');
    $('#tab_' + tab, element).addClass('active');
  },
  animated: function(element) {
    return !!element.queue()[0];
  },
  flash: function(element) {
    if(!element.length == 0 && !Util.animated(element)) {
      Util._flash(element);
    }
  },
  _flash: function(element) {
    element.effect('highlight', {}, 1000, function () {
      Util._flash(element)
    });
  },
  unflash: function(element) {
    if(!element.length == 0) {
      element.stop().css({ 'background-color': '', 'background-image': '' });
    }
  },
  deansi: function(string) {
    string = string || '';
    return string.replace('[31m', '<span class="red">').replace('[32m', '<span class="green">').replace('[0m', '</span>');
  },
  update_times: function(element) {
    element = element || $('body');

    $('.timeago', element).timeago();
    $('.finished_at[title=""]', element).hide().prev('.finished_at_label').hide();
    $('.finished_at[title=""]', element).next('.eta_label').show().next('.eta').show();
    $('.duration', element).readable_time();
  },
  readable_time: function(duration){
      var days    = Math.floor(duration / 86400)
      var hours   = Math.floor(duration % 86400 / 3600);
      var minutes = Math.floor(duration % 3600 / 60);
      var seconds = duration % 60;

      if(days > 0) {
        return 'more than 24 hrs';
      } else {
        var result = [];
        if(hours   > 0) { result.push(hours + ' hrs'); }
        if(minutes > 0) { result.push(minutes + ' min'); }
        if(seconds > 0) { result.push(seconds + ' sec'); }
        return result.join(', ')
      }
  },
  initialize_templates: function() {
    var templates = {};
    $('*[type=text/x-js-template]').map(function() {
      var name = $(this).attr('name');
      var source = $(this).html().replace('&gt;', '>');
      if(name.split('/')[1][0] == '_') { Handlebars.registerPartial(name.replace('/', ''), source) }
      templates[name] = Handlebars.compile(source);
    });
    return templates;
  },
  query_string: function(params) {
    if(!params) return '';
    var query = _.compact(_.map(params, function(value, key) { return value ? key + '=' + value : null }));
    return query.length > 0 ? '?' + query.join('&') : '';
  }
}

