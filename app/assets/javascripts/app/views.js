//= require app/helpers/urls

Travis.View = SC.View.extend(Travis.Helpers.Urls, { repositoryBinding: 'controller.repository', buildBinding:  'controller.build' });

Travis.Views = {
  Builds: {
    Current: Travis.View.extend({ templateName: 'app/templates/builds/show', buildBinding:  'controller.current' }), // hrmm, should really get rid of this current special
    List:    Travis.View.extend({ templateName: 'app/templates/builds/list', buildsBinding: 'controller.builds' }),
    Show:    Travis.View.extend({ templateName: 'app/templates/builds/show' })
  },
  Repositories: {
    List:    Travis.View.extend({ templateName: 'app/templates/repositories/list', repositoriesBinding: 'controller' }),
    Show:    Travis.View.extend({ templateName: 'app/templates/repositories/show' })
  }
}

