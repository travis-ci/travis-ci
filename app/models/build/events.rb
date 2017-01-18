class Build
  module Events
    extend ActiveSupport::Concern

    included do
      after_save  :was_configured, :if => :was_configured?
      after_save  :was_started,    :if => :was_started?
      after_save  :was_finished,   :if => :was_finished?
    end

    def was_configured?
      configured? && (config_changed? || @previously_changed.keys.include?('config'))
    end

    def was_started?
      started? && (started_at_changed? || @previously_changed.keys.include?('started_at'))
    end

    def was_finished?
      finished? && (finished_at_changed? || @previously_changed.keys.include?('finished_at'))
    end

    protected

      def was_configured
        if parent
          denormalize_to_repository(parent)
        else
          denormalize_to_repository(self)
        end
      end

      def was_started
        if parent
          parent.update_attributes!(:started_at => started_at)
          denormalize_to_repository(parent)
        else
          denormalize_to_repository(self)
        end
      end

      def was_finished
        if parent
          date = !matrix? || matrix_finished? ? finished_at : nil
          parent.update_attributes!(:status => parent.matrix_status, :finished_at => date)
          denormalize_to_repository(parent)
        else
          denormalize_to_repository(self)
        end
      end

      def denormalize_to_repository(build)
        attributes = {
          :last_build_id          => build.id,
          :last_build_number      => build.number,
          :last_build_started_at  => build.started_at,
          :last_build_status      => build.matrix? ? build.matrix_status : build.status,
          :last_build_finished_at => (!build.matrix? || build.matrix_finished?) ? build.finished_at : nil
        }
        repository.update_attributes!(attributes)
      end
  end
end


