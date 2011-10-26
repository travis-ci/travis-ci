class Request < ActiveRecord::Base
  class << self
    def create_from(payload)
      Repository.find_by(payload.repository).tap do |repository|
        repository.update_attributes!(payload.repository)
        repository.requests.create!(payload.attributes)
      end
    end
  end

  has_one    :task, :as => :owner, :class_name => 'Task::Configure'
  belongs_to :commit
  belongs_to :repository
  has_many   :builds

  validates :repository_id, :commit_id, :presence => true

  serialize :config

  before_create do
    self.build_task(:repository => self.repository, :commit => self.commit)
  end

  def configure(data)
    builds.create!(:repository => repository, :commit => commit, :config => self.config)
  end
end
