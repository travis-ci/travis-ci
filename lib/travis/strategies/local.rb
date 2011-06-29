module Travis
  module Strategy
    class Local < Base
      
      class << self

        def create_from_payload(payload)
          ::Github::ServiceHook::Payload.new(payload)
        end

      end

    end
  end
end
