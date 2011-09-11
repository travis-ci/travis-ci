#
# ActionMailer module for inline css in html emails
#
module ActionMailer::InlineCss
  def render(*args)
    if (template = args.first[:template]) && template.mime_type.html?
      premailer = Premailer.new(super, :with_html_string => true,
                                          :css => default_params[:css] ||
                                                  ["#{Rails.root}/public/stylesheets/mailers/#{mailer_name}.css"])
      premailer.to_inline_css
    else
      super
    end
  end
end

ActionMailer::Base.send :include, ActionMailer::InlineCss

