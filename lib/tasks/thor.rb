require 'bundler/setup'
require 'travis'
require 'core_ext/hash/deep_symbolize_keys'
require 'active_support/inflector'
require 'active_support/core_ext/string/inflections'
require 'active_support/core_ext/hash/keys'
require 'yaml'
require 'fileutils'

module Travis
  module Database
    class Record
      attr_reader :record, :config

      def initialize(record, config)
        @record = record
        @config = config || {}
      end

      def export(result)
        export_record(result)
        export_associations(result) if config[:associations]
      end

      private

        def export_record(result)
          result[record.class] ||= []
          result[record.class] << record
        end

        def export_associations(result)
          config[:associations].each do |name, config|
            scope = record.send(name)
            if scope.respond_to?(:each)
              scope = scope.where(config[:where]) if config && config.key?(:where)
              scope = scope.limit(config[:limit]) if config && config.key?(:limit)
              scope = scope.order(config[:order]) if config && config.key?(:order)
              scope.each { |record| Record.new(record, config).export(result) }
            else
              Record.new(scope, config).export(result)
            end
          end
        end

        def associations
          associations = config[:associations]
          associations.is_a?(Array) ? associations : [associations]
        end
    end

    class Dump
      attr_reader :model, :record

      def initialize(record)
        @model = record.class
        @record = record
      end

      def sql
        "INSERT INTO #{table_name} (#{column_names.join(', ')})\n  VALUES (#{values.join(', ')});"
      end

      def table_name
        model.table_name
      end

      def column_names
        attributes.keys.map(&:name)
      end

      def values
        attributes.values.map { |value| model.connection.quote(value) }
      end

      def attributes
        @attributes ||= record.send(:arel_attributes_values)
      end
    end

    class Seeds
      attr_reader :config, :target

      def initialize(config, target)
        @config = config
        @target = target
      end

      def export
        ActiveRecord::Base.silence do
          target ? write(sql) : puts(sql)
        end
      end

      private

        def sql
          groups.values.map do |records|
            records.map { |record| Dump.new(record).sql }
          end.join("\n\n")
        end

        def groups
          config.inject({}) do |result, (name, config)|
            export_model(result, name, config) if config[:where]
            result
          end
        end

        def export_model(result, name, config)
          conditions = config[:where]
          conditions = [conditions] unless conditions.is_a?(Array)
          conditions.each do |condition|
            model = name.to_s.singularize.camelize.constantize
            records = model.where(condition)
            records.each { |record| Record.new(record, config).export(result) }
          end
        end

        def write(sql)
          FileUtils.mkdir(File.dirname(target)) rescue nil
          File.open(target, 'w+') { |f| f.write(sql) }
        end
    end
  end
end

module Travis
  module Cli
    class Thor < ::Thor
      namespace 'travis:db'

      desc 'seeds', 'Export seed data'
      method_option :config, :aliases => '-c', :type => :string,  :desc => 'config file name'
      method_option :target, :aliases => '-t', :type => :string,  :desc => 'target file'

      def seeds(*models)
        $stdout.sync = true

        config = read_file || read_stdin
        config = YAML.load(config).deep_symbolize_keys

        Travis::Database.connect
        Travis::Database::Seeds.new(config, options['target']).export

        $stdout.flush
      end

      protected

        def read_file
          filename = options['config']
          File.read(filename) if filename
        end

        def read_stdin
          ''.tap { |stdin| stdin << $stdin.gets until $stdin.eof? }
        end

        def preload_constants!
        end
    end
  end
end

