collection @workers

node(:id) { |worker| worker.full_name }
attributes :name, :host, :state, :last_seen_at

