module Mocks
  class Buildable
    def configure; end
    def run!; end
  end

  class Connection
    def callback; end
    def errback; end
  end
end
