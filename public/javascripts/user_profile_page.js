$(document).ready(function(){
  var collection = new Travis.Collections.MyRepositories()
  var view = new Travis.Views.Repositories.MyList($('#my_repositories'), collection)
});
