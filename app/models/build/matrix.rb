require 'core_ext/array/flatten_once'

class Build
  module Matrix
    extend ActiveSupport::Concern

    included do
      before_save :expand_matrix!, :if => :expand_matrix?
    end

    module ClassMethods
      def matrix?(config)
        config.values_at(*ENV_KEYS).compact.any? { |value| value.is_a?(Array) && value.size > 1 }
      end
    end

    def matrix?
      parent_id.blank? && matrix_config?
    end

    def matrix_expanded?
      self.class.matrix?(@previously_changed['config'][1]) rescue false # TODO how to use some public AR API?
    end

    def matrix_finished?
      matrix.all?(&:finished?)
    end

    def matrix_status
      matrix.map(&:status).include?(1) ? 1 : 0 if matrix? && matrix.all?(&:finished?)
    end

    protected

      def expand_matrix?
        matrix? && matrix.empty?
      end

      def expand_matrix!
        expand_matrix_config(matrix_config.to_a).each_with_index do |row, ix|
          matrix.build(attributes.merge(:number => "#{number}.#{ix + 1}", :config => config.merge(Hash[*row.flatten]), :log => ''))
        end
      end

      def matrix_config?
        matrix_config.present?
      end

      def matrix_config
        @matrix_config ||= begin
          config = self.config || {}
          keys   = ENV_KEYS & config.keys
          size   = config.slice(*keys).values.select { |value| value.is_a?(Array) }.max { |lft, rgt| lft.size <=> rgt.size }.try(:size) || 1

          keys.inject([]) do |result, key|
            values = config[key]
            values = [values] unless values.is_a?(Array)
            values += [values.last] * (size - values.size) if values.size < size
            result << values.map { |value| [key, value] }
          end if size > 1
        end
      end

      def expand_matrix_config(config)
        # recursively builds up permutations of values in the rows of a nested array
        matrix = lambda do |*args|
          base, result = args.shift, args.shift || []
          base = base.dup
          base.empty? ? [result] : base.shift.map { |value| matrix.call(base, result + [value]) }.flatten_once
        end
        matrix.call(config).uniq
      end
  end
end
