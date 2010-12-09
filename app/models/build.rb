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

  def passed?
    status == 0
  end

  def duration
    ((finished? ? finished_at : Time.now) - created_at).to_i
  end

  def eta
    @eta ||= finished_at.blank? && repository.last_duration.present? ? created_at + repository.last_duration.seconds : nil
  end

  def as_json(options = {})
    super(:only => [:id, :commit, :name, :uri, :number], :include => [:repository])
  end
end
