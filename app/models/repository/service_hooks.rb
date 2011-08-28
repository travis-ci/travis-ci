module Repository::ServiceHooks
  extend ActiveSupport::Concern

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
        Travis::GithubApi.send(active ? :remove_service_hook : :add_service_hook, repository, user)
        repository.save!
        repository
      else
        raise ActiveRecord::RecordInvalid, repository
      end
    end
  end
end
