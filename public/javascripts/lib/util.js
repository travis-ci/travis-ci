Util = {
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
  update_times: function() {
    $('.timeago').timeago();

    $('.finished_at[title=""]').prev('.finished_at_label').hide();
    $('.finished_at[title=""]').next('.eta_label').show().next('.eta').show();

    $('.duration').each(function() {
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
  }
}

