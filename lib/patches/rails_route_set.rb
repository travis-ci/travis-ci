module ActionDispatch
  module Routing
    class RouteSet

      def draw(&block)
        clear! unless @disable_clear_and_finalize
        eval_block(block)
        finalize! unless @disable_clear_and_finalize

        nil
      end

      def eval_block(block)
        mapper = Mapper.new(self)
        if block.arity == 1
          mapper.with_default_scope(default_scope, &block)
        else
          mapper.instance_exec(&block)
        end
      end

      def append(&block)
        @append ||= []
        @append << block
      end

      # we would have patched finalize! but devise aliases it
      def finalize_without_devise!
        return if @finalized
        @append.each { |blk| eval_block(blk) }
        @finalized = true
        @set.freeze
      end

    end
  end
end