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
      SQL[:floor][configurations[Rails.env]['adapter']] % field
    end
  end
end

