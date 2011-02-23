$.fn.flash = function() {
  Travis.Helpers.Util.flash(this);
}
$.fn.unflash = function() {
  Travis.Helpers.Util.unflash(this);
}
$.fn.deansi = function() {
  this.html(Travis.Helpers.Util.deansi(this.html()));
}
$.fn.updateTimes = function() {
  Travis.Helpers.Util.updateTimes(this);
}
$.fn.activateTab = function(tab) {
  Travis.Helpers.Util.activateTab(this, tab);
}
$.fn.readableTime = function() {
  $(this).each(function() { $(this).text(Travis.Helpers.Util.readableTime(parseInt($(this).attr('title')))); })
}

Travis.Helpers.Util = {
  activateTab: function(element, tab) {
    $('.tabs li', element).removeClass('active');
    $('#tab_' + tab.toLowerCase(), element).addClass('active');
  },
  animated: function(element) {
    return !!element.queue()[0];
  },
  flash: function(element) {
    if(!element.length == 0 && !Travis.Helpers.Util.animated(element)) {
      Travis.Helpers.Util._flash(element);
    }
  },
  _flash: function(element) {
    element.effect('highlight', {}, 1000, function () {
      Travis.Helpers.Util._flash(element)
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
  updateTimes: function(element) {
    element = element || $('body');

    $('.timeago', element).timeago();
    // $('.finished_at[title=""]', element).hide().prev('.finished_at_label').hide();
    // $('.finished_at[title=""]', element).next('.eta_label').show().next('.eta').show();
    $('.duration', element).readableTime();
  },
  readableTime: function(duration){
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
  loadTemplates: function() {
    var templates = {};
    $('*[type=text/x-js-template]').map(function() {
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

