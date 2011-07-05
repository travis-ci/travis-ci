module Travis
  module Strategy
    class Github < Base
      
      class << self

        def create_from_payload(payload)
          data = ::Github::ServiceHook::Payload.new(payload)
          return false if data.repository.private?
          data
        end

      end

    end
  end
end
