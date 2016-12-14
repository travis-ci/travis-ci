require 'yaml'

class RepositoriesAddDescriptionAndLastLanguage < ActiveRecord::Migration
  def up
    change_table :repositories do |t|
      t.text :description
      t.string :last_build_language
    end

    change_table :builds do |t|
      t.string :language
    end
  end

  def down
    remove_column :repositories, :description
    remove_column :repositories, :last_language
    remove_column :builds, :language
  end
end
