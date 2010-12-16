class Build < ActiveRecord::Base
  belongs_to :repository

  class << self
    def build(data)
      repository = Repository.find_or_create_by_uri(data['repository']['uri'])
      commit = data['commits'].first
      number = repository.builds.count + 1
      repository.builds.create(:commit => commit['id'], :number => number)
    end
  end

  def append_log(string)
    update_attributes!(:log => [self.log, string].join)
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

  def duration
    ((finished? ? finished_at : Time.now) - created_at).to_i
  end

  def eta
    @eta ||= pending? && repository.last_duration.present? ? created_at + repository.last_duration.seconds : nil
  end

  def eta_in_words
    'soon'
  end

  def color
    pending? ? '' : passed? ? 'green' : 'red'
  end

  def as_json(options = {})
    build_keys = [:id, :number, :commit, :message, :duration, :finished_at, :log]
    build_methods = [:color, :eta]
    super(:only => build_keys, :methods => build_methods, :include => { :repository => { :only => [:id, :name, :uri] } })
  end
end
