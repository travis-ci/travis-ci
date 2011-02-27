describe('Views: the base list component', function() {
  beforeEach(function() {
    JobsList = Travis.Views.Base.List.extend({ name: 'jobs' });
    this.list = new JobsList({ templates: Travis.app.templates });
  });

  it('sets default selectors from its name if they are not specified', function() {
    expect(this.list.selectors).toEqual({ element: '#jobs', list: '#jobs ul', item: '#jobs #job_' })
  });

  it('sets default templates from its name if they are not specified', function() {
    expect(this.list.templates).toEqual({ list: Travis.app.templates['jobs/list'], item: Travis.app.templates['jobs/_item'] })
  });
});



