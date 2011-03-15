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
  deansi: function() {
    this.html(Utils.deansi(this.html()));
  },
  updateTimes: function() {
    Utils.updateTimes(this);
  },
  activateTab: function(tab) {
    Utils.activateTab(this, tab);
  },
  readableTime: function() {
    $(this).each(function() { $(this).text(Utils.readableTime(parseInt($(this).attr('title')))); })
  }
})



