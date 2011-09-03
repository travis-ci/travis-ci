$.fn.extend({
  outerHtml: function() {
    return $(this).wrap('<div></div>').parent().html();
  },
  outerElement: function() {
    return $($(this).outerHtml()).empty();
  },
  flash: function() {
    Utils.flash(this);
  },
  unflash: function() {
    Utils.unflash(this);
  },
  filterLog: function() {
    this.deansi();
    this.foldLog();
  },
  deansi: function() {
    this.html(Utils.deansi(this.html()));
  },
  foldLog: function() {
    this.html(Utils.foldLog(this.html()));
  },
  unfoldLog: function() {
    this.html(Utils.unfoldLog(this.html()));
  },
  updateTimes: function() {
    Utils.updateTimes(this);
  },
  activateTab: function(tab) {
    Utils.activateTab(this, tab);
  },
  readableTime: function() {
    $(this).each(function() { $(this).text(Utils.readableTime(parseInt($(this).attr('title')))); })
  },
  updateGithubStats: function(repository) {
    Utils.updateGithubStats(repository, $(this));
  }
});

$.extend({
  keys: function(obj) {
    var keys = [];
    $.each(obj, function(key) { keys.push(key) });
    return keys;
  },
  values: function(obj) {
    var values = [];
    $.each(obj, function(key, value){ values.push(value) });
    return values;
  },
  camelize: function(string, uppercase) {
    if(uppercase || typeof uppercase == 'undefined') {
      string = $.capitalize(string);
    }
    return string.replace(/_(.)?/g, function(match, chr) {
      return chr ? chr.toUpperCase() : '';
    });
  },
  capitalize: function(string) {
    return string[0].toUpperCase() + string.substring(1);
  },
  compact: function(array) {
    return $.grep(array, function(value) { return !!value; });
  },
  all: function(array, callback) {
    var args  = Array.prototype.slice.apply(arguments);
    var callback = args.pop();
    var array = args.pop() || this;
    for(var i = 0; i < array.length; i++) {
      if(callback(array[i])) return false;
    }
    return true;
  },
  any: function(array, callback) {
    var args  = Array.prototype.slice.apply(arguments);
    var callback = args.pop();
    var array = args.pop() || this;
    for(var i = 0; i < array.length; i++) {
      if(callback(array[i])) return true;
    }
    return false;
  },
  slice: function(object, key) {
    var keys   = Array.prototype.slice.apply(arguments);
    var object = (typeof keys[0] == 'object') ? keys.shift() : this;
    var result = {};
    for(var key in object) {
      if(keys.indexOf(key) > -1) result[key] = object[key];
    }
    return result;
  },
  except: function(object) {
    var keys   = Array.prototype.slice.apply(arguments);
    var object = (typeof keys[0] == 'object') ? keys.shift() : this;
    var result = {};
    for(var key in object) {
      if(keys.indexOf(key) == -1) result[key] = object[key];
    }
    return result;
  },
  // backport jquery map from 1.6 to 1.4 used by sproutcore
	map: function(elems, callback, arg) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ((length > 0 && elems[0] && elems[length - 1] ) || length === 0 || jQuery.isArray(elems));

		if(isArray) {
			for(; i < length; i++) {
				value = callback(elems[i], i, arg);
				if(value != null) { ret[ret.length] = value; }
			}
		} else {
			for(key in elems) {
				value = callback(elems[key], key, arg);
				if(value != null) { ret[ret.length] = value; }
			}
		}
		return ret.concat.apply([], ret);
	}
});
