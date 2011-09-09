String.prototype.repeat = function(num) {
  return new Array(num + 1).join(this);
}

if(!Function.prototype.bind) {
  Function.prototype.bind = function(binding) {
    return $.proxy(this, binding);
  }
}
