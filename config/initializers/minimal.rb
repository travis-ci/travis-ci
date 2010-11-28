Minimal::Template.send(:include, Minimal::Template::FormBuilderProxy)

ActionView::Template.register_template_handler('rb', Minimal::Template::Handler)

