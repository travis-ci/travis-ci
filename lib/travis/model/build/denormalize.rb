class Build
  module Denormalize
    def denormalize(event, *args)
      repository.update_attributes!(denormalize_attributes_for(event)) if denormalize?(event)
    end

    DENORMALIZE = {
      :start  => %w(id number status started_at finished_at),
      :finish => %w(status finished_at)
    }

    def denormalize?(event)
      DENORMALIZE.key?(event)
    end

    def denormalize_attributes_for(event)
      DENORMALIZE[event].inject({}) do |result, key|
        result.merge(:"last_build_#{key}" => send(key))
      end
    end
  end
end
