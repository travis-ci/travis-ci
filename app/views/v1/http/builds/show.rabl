object @build

attributes :id, :repository_id, :number, :state, :status,
           :started_at, :finished_at, :config

child @build.matrix => :matrix do
  attributes :id, :repository_id, :number, :config, :state, :status,
             :started_at, :finished_at

  node(:parent_id) { |task| task.owner_id }
end

glue @build.commit do
  attributes :id => :post_id, :name => :post_name
end
        json.merge!('matrix' => matrix.as_json(:for => options[:for]))
        json.merge!(commit.as_json(:for => :build))

