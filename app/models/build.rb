class Build < ActiveRecord::Base
  belongs_to :repository

  default_scope :order => 'finished_at DESC'

  class << self
    def build(data)
      repository = Repository.find_or_create_by_uri(data['repository']['uri'])
      commit = data['commits'].first
      repository.builds.create(:commit => commit['id'])
    end
  end

  def passed?
    status == 0
  end

  def as_json(options = {})
    super(:only => [:id, :commit, :name, :uri], :include => [:repository])
  end
end
