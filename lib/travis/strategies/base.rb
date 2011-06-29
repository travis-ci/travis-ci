module Travis
  module Strategy
    class Base

      class << self

        def create_from_payload(payload)
          raise NotImplementedError
        end

      end
      
    end
  end
end
