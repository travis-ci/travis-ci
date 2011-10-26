module Travis
  class Model
    class Build < Model
      autoload :Notifications, 'travis/model/build/notifications'

      include Notifications, SimpleStates, Travis::Notifications

      states :created, :started, :finished

      event :start,  :to => :started
      event :finish, :to => :finished, :if => :matrix_finished?
      event :all, :after => :denormalize # TODO bug in simple_states. should be able to pass an array

      delegate :state, :state=, :denormalize, :to => :record
    end
  end
end
