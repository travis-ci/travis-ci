String.prototype.repeat = function(num) {
  return new Array(num + 1).join(this);
}
