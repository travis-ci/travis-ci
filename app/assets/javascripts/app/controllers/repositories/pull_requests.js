Travis.Controllers.Repositories.PullRequests = Travis.Controllers.Builds.List.extend({
  contentBinding: 'parent.repository.pull_requests'
})