queries = [
  'UPDATE builds SET result = status WHERE result IS NULL;',
  'UPDATE jobs SET result = status WHERE result IS NULL;',
  'UPDATE repositories SET last_build_result = last_build_status WHERE result IS NULL;',
]
queries.each do |query|
  puts "Executing: #{query}"
  connection.execute(query)
end

