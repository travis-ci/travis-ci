class FullTextSearch1302445002 < ActiveRecord::Migration
  def self.up
    execute <<-EOSQL.strip
      DROP index IF EXISTS repositories_fts_idx
    EOSQL

    execute <<-EOSQL.strip
      CREATE index repositories_fts_idx
      ON repositories
      USING gin((to_tsvector('english', coalesce("repositories"."name", '') || ' ' || coalesce("repositories"."owner_name", ''))))
    EOSQL
  end

  def self.down
    execute <<-EOSQL.strip
      DROP index IF EXISTS repositories_fts_idx
    EOSQL
  end
end
