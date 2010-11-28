$: << File.expand_path('../../../../lib', __FILE__) # ummmm ...
require 'rubygems'

require 'nanite'
require 'travis'

class Builder
  include Nanite::Actor

  attr_accessor :dispatcher, :payload

  def build(payload, &block)
    yield "got build request for #{payload[:uri]}\n"

    buildable = Travis::Buildable.create(payload[:uri], payload, &block)
    status = buildable.build(payload[:build_script] || 'rake')

    { :status => status.exitstatus }
  end
  expose :build
end
