require 'core_ext/hash/compact'

class Build
  module Json
    all_attrs = [:id, :repository_id, :number, :status, :state, :started_at, :finished_at, :config]

    # all_attrs = [:log]

    JSON_ATTRS = {
      :default            => all_attrs,
      :'build:started'    => all_attrs - [:status, :log, :finished_at],
      :'build:configured' => all_attrs - [:status, :log, :finished_at],
      :'build:finished'   => [:id, :parent_id, :status, :finished_at],
      :webhook            => [:id, :build_log_url, :number, :commit, :branch, :message, :status, :started_at, :finished_at,
                              :committed_at, :committer_name, :committer_email, :author_name, :author_email, :compare_url]
    }

    JSON_MERGE = {
      :webhook => lambda {|build| {
        :repository => build.repository.as_json(:for => :webhook), # TODO the repository will also be included in the controller, already, see BuildsController#
        :github_url => build.repository.url, # TODO shouldn't this be part of the repository?
        :status_message => build.status_message
      } }
    }

    def as_json(options = nil)
      options ||= {}
      json = super(:only => JSON_ATTRS[options[:for] || :default])
      json.merge!(JSON_MERGE[options[:for]].call(self)) if JSON_MERGE[options[:for]]

      unless options[:for]
        json.merge!('matrix' => matrix.as_json(:for => options[:for]))
        json.merge!(commit.as_json(:for => :build))
      end

      json.compact
    end
  end
end


