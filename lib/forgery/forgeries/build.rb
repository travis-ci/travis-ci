class Forgery::Build < Forgery
  def self.config
    eval(dictionaries[:build_configs].random)
  end
  def self.log
    eval( "\"#{dictionaries[:build_logs].random}\"" )

  end
end
