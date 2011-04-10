class FullTextSearch1302445002 < ActiveRecord::Migration
  def self.up
    execute(<<-'eosql'.strip)
      DROP index IF EXISTS repositories_fts_idx
    eosql
    execute(<<-'eosql'.strip)
      CREATE index repositories_fts_idx
      ON repositories
      USING gin((to_tsvector('english', coalesce("repositories"."name", '') || ' ' || coalesce("repositories"."owner_name", ''))))
    eosql
  end

  def self.down
    execute(<<-'eosql'.strip)
      DROP index IF EXISTS repositories_fts_idx
    eosql
  end
end
