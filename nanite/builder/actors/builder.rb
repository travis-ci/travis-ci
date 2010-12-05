$: << File.expand_path('../../../../lib', __FILE__) # ummmm ...
require 'rubygems'
require 'nanite'
require 'travis'

class Builder
  include Nanite::Actor

  attr_accessor :dispatcher, :payload

  def build(payload, &block)
    yield "got build request for #{payload[:uri]}\n"

    payload[:script] ||= 'bundle install; rake'
    buildable = Travis::Buildable.new(payload[:uri], payload, &block)

    { :status => buildable.build.exitstatus }
  end
  expose :build
end
