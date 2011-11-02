class CreateArtifacts < ActiveRecord::Migration
  def change
    create_table :artifacts do |t|
      t.string  :content
      t.integer :job_id
      t.string  :type

      t.timestamps
    end
  end
end
