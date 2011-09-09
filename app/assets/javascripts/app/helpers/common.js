Travis.Helpers.Common = {
  colorForStatus: function(status) {
    return status == 0 ? 'green' : status == 1 ? 'red' : null;
  },

  timeAgoInWords: function(date) {
    return $.timeago.distanceInWords(date);
  },

  durationFrom: function(started, finished) {
    started  = started  && new Date(this._normalizeDateString(started));
    finished = finished ? new Date(this._normalizeDateString(finished)) : new Date();
    return started && finished ? Math.round((finished - started) / 1000) : 0;
  },

  readableTime: function(duration) {
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

  _normalizeDateString: function(string) {
    if(window.JHW) {
      // TODO i'm not sure why we need to do this. in the chrome console the
      // Date constructor would take a string like "2011-09-02T15:53:20.927Z"
      // whereas in unit tests this returns an "invalid date". wtf ...
      string = string.replace('T', ' ').replace(/-/g, '/');
      string = string.replace('Z', '').replace(/\..*$/, '');
    }
    return string;
  }
}
