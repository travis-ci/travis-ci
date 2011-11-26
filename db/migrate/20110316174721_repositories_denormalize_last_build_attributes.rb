$: << 'lib' unless $:.include?('lib')
require 'travis/model/repository'

class RepositoriesDenormalizeLastBuildAttributes < ActiveRecord::Migration
  def self.up
    change_table :repositories do |t|
      t.integer  :last_build_id
      t.string   :last_build_number
      t.integer  :last_build_status
      t.datetime :last_build_started_at
      t.datetime :last_build_finished_at
    end

    Repository.all.each do |repository|
      repository.last_build.denormalize_to_repository if repository.last_build
    end
  end

  def self.down
    remove_column :repositories, :last_build_id
    remove_column :repositories, :last_build_number
    remove_column :repositories, :last_build_status
    remove_column :repositories, :last_build_started_at
    remove_column :repositories, :last_build_finished_at
  end
end
