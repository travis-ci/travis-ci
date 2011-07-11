$(document).ready(function(){
  var collection = new Travis.Collections.ServiceHooks()
  var view = new Travis.Views.ServiceHooks.List($('#service_hooks'), collection)
});
