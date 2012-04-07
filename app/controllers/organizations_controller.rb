class OrganizationsController < ApplicationController
  before_filter :authenticate_user!

  responders :rabl
  respond_to :json

  def index
    respond_with(organizations)
  end

  private

  def organizations
    @organizations ||= current_user.organizations.order(:name)
  end
end
