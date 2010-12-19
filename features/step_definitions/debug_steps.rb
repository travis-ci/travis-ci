# Then 'what' do
#   out = "\\n\\n\\n" +
#     "#{last_request.request_method} #{last_request.env["SERVER_NAME"]}#{last_request.env["REQUEST_URI"]}\\n" +
#     "params: #{last_request.params.inspect}\\n\\n" +
#     response.body +
#     "\\n\\n\\n"
#   puts out.gsub("\\n", "\\n  ")
# end

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


