module Travis
  class Synchronizer < Array
    class << self
      def timeout
        @@timeout ||= 20
      end

      def timeout=(timeout)
        @@timeout = timeout
      end

      def synchronizers
        @@synchronizers ||= {}
      end

      def receive(id, msg_id, &forward)
        synchronizers[id] ||= new(id)
        synchronizers[id].receive(msg_id, &forward)
      end
    end

    attr_reader :id, :last_id, :finalizer

    def initialize(id)
      @id = id
      @last_id  = 0
    end

    def receive(msg_id, &forward)
      if msg_id
        synchronize(msg_id, &forward)
      else
        forward.call
      end
    end

    def synchronize(msg_id, &forward)
      with_finalizer do
        push([msg_id.to_i, forward])
        sort!
        while !empty? && last_id == self[0][0].to_i - 1
          @last_id = self[0][0].to_i
          shift[1].call
        end
      end
    end

    def with_finalizer
      EM.cancel_timer(finalizer)
      yield
      @finalizer = EM.add_timer(self.class.timeout) { finalize }
    end

    def finalize
      shift[1].call until empty?
      self.class.synchronizers.delete(id)
    end

    def sort!
      super { |lft, rgt| lft[0] <=> rgt[0] }
    end
  end
end

