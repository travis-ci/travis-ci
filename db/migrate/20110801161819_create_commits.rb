class CreateCommits < ActiveRecord::Migration
  MIGRATE_COLUMNS = [:commit, :ref, :branch, :message, :compare_url, :committed_at,
    :committer_name, :committer_email, :author_name, :author_email]

  def self.up
    create_table :commits do |t|
      t.string   :commit # would love to call this column :hash, but apparently FactoryGirl wouldn't >:/
      t.string   :ref
      t.string   :branch
      t.text     :message
      t.string   :compare_url

      t.datetime :committed_at
      t.string   :committer_name
      t.string   :committer_email
      t.string   :author_name
      t.string   :author_email

      t.timestamps
    end

    # Build.where(:parent_id => nil).each do |build|
    #   build.request.build_commit(build.attributes.slice(*MIGRATE_COLUMNS)).save!
    # end

    # change_table :commits do |t|
    #   t.rename :commit, :hash
    # end

    change_table :builds do |t|
      t.remove *MIGRATE_COLUMNS
    end
  end

  def self.down
    change_table :builds do |t|
      t.string   :commit
      t.string   :ref
      t.string   :branch
      t.text     :message
      t.string   :compare_url

      t.datetime :committed_at
      t.string   :committer_name
      t.string   :committer_email
      t.string   :author_name
      t.string   :author_email
    end

    # Build.where(:parent_id => nil).each do |build|
    #   attributes = build.request.commit.attributes.slice(*MIGRATE_COLUMNS)
    #   build.update_attributes(attributes)
    # end

    # change_table :builds do |t|
    #   t.rename :hash, :commit
    # end

    drop_table :commits
  end
end
