require 'active_record'

class ActiveRecord::Base
  SQL = {
    :floor => {
      'postgresql' => 'floor(%s::float)',
      'mysql'      => 'floor(%s)',
      'sqlite3'    => 'round(%s - 0.5)'
    }
  }
  class << self
    def floor(field)
      env = defined?(Rails) ? Rails.env : ENV['RAILS_ENV'] || 'test'
      adapter = configurations[env]['adapter']
      SQL[:floor][adapter] % field
    end
  end
end

