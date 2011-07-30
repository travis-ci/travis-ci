require 'core_ext/hash/compact'

class Build
  module Json
    all_attrs = [:id, :repository_id, :parent_id, :number, :commit, :branch, :message, :status, :log, :started_at, :finished_at,
      :committed_at, :committer_name, :committer_email, :author_name, :author_email, :compare_url, :config]

    JSON_ATTRS = {
      :default            => all_attrs,
      :job                => [:id, :number, :commit, :config, :branch],
      :'build:queued'     => [:id, :number],
      :'build:started'    => all_attrs - [:status, :log, :finished_at],
      :'build:configured' => all_attrs - [:status, :log, :finished_at],
      :'build:log'        => [:id, :parent_id],
      :'build:finished'   => [:id, :parent_id, :status, :finished_at]
    }

    def as_json(options = nil)
      options ||= {}
      json = super(:only => JSON_ATTRS[options[:for] || :default])
      json.merge!('matrix' => matrix.as_json(:for => options[:for])) if matrix?
      json.compact
    end
  end
end


