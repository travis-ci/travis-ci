describe('Views: the build log view', function() {
  beforeEach(function() {
    this.selector = '#jasmine_content #log';
    $(this.selector).html('<pre id="log"></pre>');

    this.build = new Travis.Models.Build({ log: 'the build log' });
    this.log = new Travis.Views.Build.Log({ model: this.build }).render();
  });

  it('renders the build log', function() {
    expect(this.log.el.html()).toEqual('the build log');
  });

  it('appends to the log on build:append_log', function() {
    this.build.appendLog(' ... appendix');
    expect(this.log.el.html()).toEqual('the build log ... appendix');
  });

  it('sets the build log on build:change', function() {
    this.build.set({ log: 'the updated build log' });
    expect(this.log.el.html()).toEqual('the updated build log');
  });
});


