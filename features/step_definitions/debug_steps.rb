Then 'what' do
  out = "\\\\n\\\\n\\\\n" +
    "#{request.request_method} #{request.env["SERVER_NAME"]}#{request.env["REQUEST_URI"]}\\\\n" +
    "params: #{request.params.inspect}\\\\n\\\\n" +
    response.body +
    "\\\\n\\\\n\\\\n"
  puts out.gsub("\\\\n", "\\\\n  ")
end

Then 'debug' do
  debugger
  true
end

Then /^show me the page$/ do
  save_and_open_page
end

Then /^(?:|I )output the page$/ do
  puts response.body
end


