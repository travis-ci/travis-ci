# TODO This is legacy. Now that we've separated Models from Records we should
# get rid of the inheritance here.
#
# This job belongs to a Request instances and will configure and validate the
# request before it gets to create a Build insatnce.

class Job::Configure < Job
end

