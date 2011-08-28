class ProfilesController < ApplicationController
  layout 'simple'

  before_filter :authenticate_user!

  respond_to :json
  respond_to :html, :only => :show

  def show
    respond_with(user)
  end

  private

    def user
      @user ||= current_user
    end
end
