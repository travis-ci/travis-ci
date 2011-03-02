class Build < ActiveRecord::Base
  belongs_to :repository

  class << self
    def create_from_github_payload(data)
      repository = Repository.find_or_create_by_url(data['repository']['url'])
      commit     = data['commits'].last
      author     = commit['author'] || {}
      committer  = commit['committer'] || author || {}

      repository.builds.create(
        :commit          => commit['id'],
        :message         => commit['message'],
        :number          => repository.builds.count + 1,
        :committed_at    => commit['timestamp'],
        :committer_name  => committer['name'],
        :committer_email => committer['email'],
        :author_name     => author['name'],
        :author_email    => author['email']
      )
    end

    def started
      where(arel_table[:started_at].not_eq(nil))
    end
  end

  def append_log!(chars)
    update_attributes!(:log => [self.log, chars].join)
  end

  def finished?
    finished_at.present?
  end

  def pending?
    !finished?
  end

  def passed?
    status == 0
  end

  def color
    pending? ? '' : passed? ? 'green' : 'red'
  end

  def as_json(options = {})
    build_keys = [:id, :number, :commit, :message, :status, :committed_at, :author_name, :author_email, :committer_name, :committer_email]
    build_keys += [:log, :started_at, :finished_at] if options[:full]
    build_methods = []
    super(:only => build_keys, :methods => build_methods, :include => { :repository => { :only => [:id, :name, :url, :last_duration] } })
  end
end
