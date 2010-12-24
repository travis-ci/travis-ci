module Travis
  module Reporter
    autoload :Pusher, 'travis/reporter/pusher'
    autoload :Rails,  'travis/reporter/rails'
    autoload :Stdout, 'travis/reporter/stdout'
  end
end

