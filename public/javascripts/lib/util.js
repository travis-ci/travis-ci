Util = {
  animated: function(element) {
    return !!element.queue()[0];
  },
  flash: function(element) {
    if(!Util.animated(element)) { Util._flash(element); }
  },
  _flash: function(element) {
    element.effect('highlight', {}, 1000, function () { Util._flash(element) });
  },
  unflash: function(element) {
    element.stop().css({ 'background-color': '', 'background-image': '' });
  },
  deansi: function(string) {
    string = string || '';
    return string.replace('[31m', '<span class="red">').replace('[32m', '<span class="green">').replace('[0m', '</span>');
  }
}

