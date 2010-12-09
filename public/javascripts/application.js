$(document).ready(function() {
  var form = $('#github');
  form.submit(function() {
    $.post(form.attr('action'), form.serialize());
    return false;
  });

  // $('.repository a.last_build').live('click', function(event) {
  //   event.preventDefault();

  //   var build = $('#build_log');
  //   var repository = $(this).closest('.repository');

  //   build.load(this.href, function(response, status, xhr) {
  //     build.html(Travis.deansi(build.html()));
  //     build.attr('data-repository_id', repository.attr('id').split('_')[1]);
  //   });
  //   // if(Build.socky) {
  //   //   Build.socky.connection.close();
  //   // }
  //   // Build.socky = new Socky('ws://127.0.0.1', '8080', 'client_id=' + Socky.client_id + '&channels=' + $(this).closest('.repository').attr('id'))
  // });

  $('.github_ping').click(function(event) {
    $.post($(this).attr('href'), { payload: $(this).attr('data-payload') });
    event.preventDefault();
  })
});

// Socky.prototype.respond_to_message = function(msg) {
// 	var data = JSON.parse(msg);
//   var handler = Handler['on_' + data['event']];
//   if(handler) {
//     handler.apply(this, [data]);
//   } else {
//     console.log(data)
//   }
// }

Handler = {
  on_build_started: function(data) {
    Build.clear(data);
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
    var build = data['build'];
    var repository = build['repository'];
    var repository_id = '#repository_' + repository['id'];
    var element = $(repository_id);

    if($(repository_id).length == 0) {
      $('#repositories').append(
        $('<li id="repository_' + repository['id'] + '" class="repository status">' +
          '<a href="' + repository['uri'] + '">' + repository['name'] + '</a> ' +
          '<a href="/builds/' + build['id'] + '" class="last_build">#' + build.number + '</a>' +
          '</li>')
      );
      element = $(repository_id);
    } else {
      $('a.last_build', element).html('#' + data['build']['number']).attr('href', '/builds/' + data['build']['id'])
    }

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
  clear: function(data) {
    $('#build_log[data-repository_id=' + data.build.repository.id + ']').empty();
  },
  append: function(data) {
    $('#build_log[data-repository_id=' + data.build.repository.id + ']').append(Travis.deansi(data['message']));
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
  },
  deansi: function(string) {
    return string.replace('[32m', '<span class="green">').replace('[0m', '</span>')
  }
}
