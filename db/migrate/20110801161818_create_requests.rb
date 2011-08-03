class CreateRequests < ActiveRecord::Migration
  MIGRATE_COLUMNS = [:github_payload]

  def self.up
    create_table :requests do |t|
      t.references :repository
      t.references :commit

      t.string     :source
      t.text       :payload
      t.string     :state
      t.text       :config
      t.string     :token

      t.datetime :started_at
      t.datetime :finished_at
      t.timestamps
    end

    # Build.where(:parent_id => nil).each do |build|
    #   attributes = build.attributes.slice(*MIGRATE_COLUMNS)
    #   attributes.merge!(:repository_id => build.repository_id, :source => 'github')
    #   build.build_request(attributes).save!
    # end

    # change_table :requests do |t|
    #   t.rename :github_payload, :payload
    # end

    change_table :builds do |t|
      t.remove *MIGRATE_COLUMNS
    end
  end

  def self.down
    change_table :builds do |t|
      t.text :github_payload
    end

    # change_table :requests do |t|
    #   t.rename :payload, :github_payload
    # end

    # Build.all.each do |build|
    #   attributes = build.attributes.slice(*MIGRATE_COLUMNS)
    #   build.update_attributes!(attributes)
    # end

    drop_table :requests
  end
end
