namespace :test do

  desc "a little shortcut for ci testing"
  task :ci => ["db:drop", "db:create", "db:test:load", "test", "spec:controllers"]

end
