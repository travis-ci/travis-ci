$(document).ready(function() {
  var form = $('#github');
  form.submit(function() {
    $.post(form.attr('action'), form.serialize());
    return false;
  });

  $('.repository a').click(function(event) {
    $('#build').load(this.href);
    // Socky.connection.close();
    // new Socky('ws://127.0.0.1', '8080', 'client_id=a64279a0-fc7e-11df-4ca5-536ee95abb83&channels=' + $(this).closest('.repository').attr('id'))
    event.preventDefault();
  });

  $('.github_ping').click(function(event) {
    $.post($(this).attr('href'), { payload: $(this).attr('data-payload') });
    event.preventDefault();
  })
});

Socky.prototype.respond_to_message = function(msg) {
	var data = JSON.parse(msg);
  var handler = Handler['on_' + data['event']];
  if(handler) {
    handler.apply(this, [data]);
  } else {
    console.log(data)
  }
}

Handler = {
  on_build_started: function(data) {
    Build.clear();
  },
  on_build_updated: function(data) {
    Repositories.build_active(data);
    Build.append(data);
  },
  on_build_finished: function(data) {
    Repositories.build_finished(data);
    Build.append(data);
  }
}

Repositories = {
  build_active: function(data) {
    var repository = data['build']['repository'];
    var repository_id = '#repository_' + repository['id'];
    if($(repository_id).length == 0) {
      $('#repositories').append(
        $('<li id="repository_' + repository['id'] + '" class="repository status"><a href="' +
          repository['uri'] + '">' + repository['name'] + '</a></li>')
      );
    }
    var element = $(repository_id);
    if(!Travis.animated(element)) {
      Travis.flash(element);
    }
  },
  build_finished: function(data) {
    var element = $('#repository_' + data['build']['repository']['id']);
    element.removeClass('green red');
    element.addClass(data['status'] == 0 ? 'green' : 'red')
    Travis.unflash(element);
  }
}

Build = {
  clear: function() {
    $('#build').empty();
  },
  append: function(data) {
    $('#build').append(data['message'])
  }
};

Travis = {
  animated: function(element) {
    return !!element.queue()[0];
  },
  flash: function(element) {
    element.effect('highlight', {}, 1000, function () { Travis.flash(element) });
  },
  unflash: function(element) {
    element.stop().css({ 'background-color': '', 'background-image': '' });
  }
}
