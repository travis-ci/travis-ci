$.fn.extend({
  outerHtml: function() {
    return $(this).wrap('<div></div>').parent().html();
  },
  outerElement: function() {
    return $($(this).outerHtml()).empty();
  },
  flash: function() {
    $.Travis.flash(this);
  },
  unflash: function() {
    $.Travis.unflash(this);
  },
  deansi: function() {
    this.html($.Travis.deansi(this.html()));
  },
  updateTimes: function() {
    $.Travis.updateTimes(this);
  },
  activateTab: function(tab) {
    $.Travis.activateTab(this, tab);
  },
  readableTime: function() {
    $(this).each(function() { $(this).text($.Travis.readableTime(parseInt($(this).attr('title')))); })
  }
})

$.Travis = {
  activateTab: function(element, tab) {
    $('.tabs li', element).removeClass('active');
    $('#tab_' + tab.toLowerCase(), element).addClass('active');
  },
  animated: function(element) {
    return !!element.queue()[0];
  },
  flash: function(element) {
    if(!element.length == 0 && !$.Travis.animated(element)) {
      $.Travis._flash(element);
    }
  },
  _flash: function(element) {
    element.effect('highlight', {}, 1000, function () {
      $.Travis._flash(element)
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
}



