class Array
  def flatten_once
    inject([]) { |result, element| result.push(*element) }
  end unless method_defined?(:flatten_once)
end

