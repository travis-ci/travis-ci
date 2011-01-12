$.fn.deansi = function() {
  this.html(Util.deansi(this.html()));
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

    $('.finished_at[title=""]', element).prev('.finished_at_label').hide();
    $('.finished_at[title=""]', element).next('.eta_label').show().next('.eta').show();

    $('.duration', element).each(function() {
      var duration = parseInt($(this).attr('title'));
      var hours = Math.round(duration / 3600);
      var minutes = Math.round(duration % 3600 / 60);
      var seconds = duration - hours * 3600 - minutes * 60;

      if(hours > 0) {
        $(this).text(hours + ' hours, ' + minutes + ' minutes');
      } else if(minutes > 0) {
       $(this).text(minutes + ' minutes, ' + seconds + ' seconds');
      } else {
        $(this).text(seconds + ' seconds');
      }
    });
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
  }
}

