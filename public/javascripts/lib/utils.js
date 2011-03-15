Utils = {
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
  },
  duration: function(started, finished) {
    started  = new Date(started);
    finished = finished ? new Date(finished) : new Date();
    return started ? Math.round((finished - started) / 1000) : 0;
  },
  activateTab: function(element, tab) {
    $('.tabs li', element).removeClass('active');
    $('#tab_' + tab.toLowerCase(), element).addClass('active');
  },
  animated: function(element) {
    return !!element.queue()[0];
  },
  flash: function(element) {
    if(!element.length == 0 && !Utils.animated(element)) {
      Utils._flash(element);
    }
  },
  _flash: function(element) {
    element.effect('highlight', {}, 1000, function () {
      Utils._flash(element)
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
    $('.timeago', element).timeago();
    $('.duration', element).readableTime();

    if(!Utils._updateTimesInterval) {
      Utils._updateTimesInterval = setInterval(function() { Utils.updateTimes() }, 3000);
    }
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
      return result.length > 0 ? result.join(' ') : '-';
    }
  },
}

function trace() {
  try {
    i.dont.exist; // force an exception
  } catch(e) {
    var lines = e.stack.split('\n').slice(2);
    var stack = _.map(lines, function(line) { return line.replace(/^\s*at/, ''); });
    console.log('trace -------------------------------');
    _.each(stack, function(line) { console.log(line); });
  }
}
