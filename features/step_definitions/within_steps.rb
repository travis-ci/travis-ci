scopes = {
  'the title'             => 'h1, h2, h3',
  'the repositories list' => '#repositories'
}
scopes.each do |context, selector|
  Then /^(.+) (?:with)?in #{context}$/ do |step|
    within(selector) do
      Then step
    end
  end
end

