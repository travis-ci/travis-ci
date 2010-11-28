Factory.define :repository do |f|
  f.name 'svenfuchs/i18n'
  f.uri  'http://github.com/svenfuchs/i18n'
end

Factory.define :build do |f|
  f.repository { Repository.first || Factory(:repository) }
  f.commit '62aae5f70ceee39123ef'
end

