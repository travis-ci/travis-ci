class Build < ActiveRecord::Base
  belongs_to :repository

  class << self
    def build(data)
      repository = Repository.find_or_create_by_url(data['repository']['url'])
      commit = data['commits'].first
      number = repository.builds.count + 1
      committer = commit['committer'] || commit['author'] || {}
      repository.builds.create(
        :commit => commit['id'],
        :message => commit['message'],
        :number => number,
        :committer_name => committer['name'],
        :committer_email => committer['email'],
        :committed_at => commit['timestamp']
      )
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
    build_keys = [:id, :number, :commit, :message, :status, :committed_at, :committer_name, :committer_email]
    build_keys += [:log, :started_at, :finished_at, :color] if options[:full]
    build_methods = [] # [:color, :eta]
    super(:only => build_keys, :methods => build_methods, :include => { :repository => { :only => [:id, :name, :url, :last_duration] } })
  end
end
