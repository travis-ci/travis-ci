require_relative '../config/environment'
require 'statistics'

data = Statistics.daily_repository_counts
exit if data.empty?

next_thousand = 1000
last_time = data.first.first

growth = data.inject([[data.shift.last, 0]]) do |growth, (time, num)|
  growth << [num, num - growth.last.first]
end
two_weeks = growth.slice(-14, 14)
average = (two_weeks.inject(0) { |sum, (total, growth)| sum + growth }.to_f / two_weeks.length).round(0)

data.each do |(time, num)|
  if num >= next_thousand
    thousand = num - (num % 1000)
    days = (time - last_time) / (1000 * 60 * 60 * 24)
    puts "#{thousand} reached on #{Time.at(time / 1000).strftime('%Y-%m-%d')} after #{days} days"
    next_thousand = thousand + 1000
    last_time = time
  end
end
remaining = next_thousand - data.last.last

puts
puts "Average growth within last 14 days: #{average} repositories.\n"
puts "Will reach #{next_thousand} repositories in #{(remaining.to_f / average).round(2)} days."

