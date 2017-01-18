module Travis
  module Utils

    class << self
      def json_for(event, build)
        { 'build' => build.as_json(:for => event.to_sym), 'repository' => build.repository.as_json(:for => event.to_sym) }
      end
    end

  end
end