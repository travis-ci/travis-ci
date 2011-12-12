# class QueuesController < ApplicationController
#   respond_to :json
#
#   def index
#     respond_with jobs
#   end
#
#   protected
#
#     def jobs
#       # TODO move to a scope on Job and extract a rabl template
#       Job.where(:queue => params[:queue], :state => :created).map do |job|
#         {
#           :id         => job.id,
#           :number     => job.number,
#           :commit     => job.commit.commit,
#           :queue      => job.queue,
#           :repository => {
#             :id   => job.repository.id,
#             :slug => job.repository.slug
#           }
#         }
#       end
#     end
# end
