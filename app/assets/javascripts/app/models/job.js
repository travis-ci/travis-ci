Travis.Job = Travis.Record.extend({
  number:     SC.Record.attr(String),
  repository: SC.Record.attr(Object),
});

Travis.Job.reopenClass({
  resource: 'jobs'
});

