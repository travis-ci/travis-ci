require 'action_mailer'
require 'i18n'
require 'pathname'

module Travis
  module Mailer
    autoload :Build, 'travis/mailer/build'

    module Helper
      autoload :Build, 'travis/mailer/helper/build'
    end

    class << self
      def setup
        ActionMailer::Base.append_view_path(base_dir.join('views').to_s)
        I18n.load_path += Dir[base_dir.join('locales/**/*.yml')]
      end

      def base_dir
        @base_dir = Pathname.new(File.expand_path('../mailer', __FILE__))
      end
    end
  end
end
