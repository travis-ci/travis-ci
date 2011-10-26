class Job
  include SimpleStates, Travis::Notifications

  event :all, :after => :notify

  # after_create do
  #   notify(:create) # TODO this really should be in simple_states, but will probably require some AR hackery
  # end

  attr_reader :record

  def initialize(record)
    @record = record
  end

  def update_attributes(attributes)
    update_states_from_attributes(attributes)
    super
  end

  def append_log!(chars)
    self.class.update_all(["log = COALESCE(log, '') || ?", chars], ["id = ?", id])
    notify(:log, :build => { :_log => chars })
  end

  def propagate(*args)
    owner.send(*args)
  end

  def matrix_config?(config)
    config = config.to_hash.symbolize_keys
    Build.matrix_keys_for(config).map do |key|
      self.config[key.to_sym] == config[key] || commit.branch == config[key]
    end.inject(:&)
  end

  protected

    # This extracts attributes like :started_at, :finished_at, :config from the
    # given attributes and triggers state changes based on them. See the respective
    # `extract_[state]ing_attributes` methods.
    def update_states_from_attributes(attributes)
      attributes = (attributes || {}).deep_symbolize_keys
      [:start, :finish].each do |state|
        state_attributes = send(:"extract_#{state}ing_attributes", attributes)
        send(:"#{state}!", state_attributes) if state_attributes.present?
      end
    end

    def extract_starting_attributes(attributes)
      extract!(attributes, :started_at)
    end

    def extract!(hash, *keys)
      # arrrgh. is there no ruby or activesupport hash method that does this?
      hash.slice(*keys).tap { |result| hash.except!(*keys) }
    end
end

