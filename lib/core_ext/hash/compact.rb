class Hash
  def compact
    dup.compact!
  end

  def compact!
    keys.each do |key|
      delete(key) if self[key].nil?
    end
    self
  end
end unless {}.respond_to?(:compact)
