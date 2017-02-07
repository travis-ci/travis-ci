module Repository::ServiceHooks
  extend ActiveSupport::Concern

  module ClassMethods
    def active_by_name
      Hash[select([:active, :name]).map { |repository| [repository.name, repository.active] }]
    end
  end

  module InstanceMethods
    def service_hook
      @service_hook ||= ServiceHook.new(self)
    end
  end

  class ServiceHook
    attr_reader :repository

    def initialize(repository)
      @repository = repository
    end

    def toggle(active, user)
      repository.active = active

      if repository.valid?
        Travis::GithubApi.send(active ? :add_service_hook : :remove_service_hook, repository, user)
        repository.save!
        repository
      else
        raise ActiveRecord::RecordInvalid, repository
      end
    end
  end
end
