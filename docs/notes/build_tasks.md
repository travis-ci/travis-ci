# Refactoring to Builds, Tasks and Tests

In order to simplify code and make classes better map to domain concepts, we
are going to refactor the server/app code to the following classes:

## Application domain

The following classes encapsulate the application domain model concepts. I.e.
they are part of the application server code, can be stored as ActiveRecords
and are targetted at being published through the JSON API and/or sync'ed over
to the client app through websocket messages.

### Build::Request

A Request is what external services, like currently Github, send to Travis. It
contains the sent payload and has a one-to-one relationship to a Build::Group.

### Build::Group

A Build::Group implements the concept of a highlevel grouping of units work
(Build::Tasks). It is triggered by the Build::Request. A Build::Group has a
configuration and at least one Build::Task but can own many tasks, depending on
its configuration.

A Build::Group has the following states:

* created
* configured
* finished
* failed
* cancelled

When a build request comes in from Github then a Build::Group is created. This
will create a Build::Config task which will queue a Job::Config.

If this task has failed then the Build::Group will immediatedly go into the
same state and stop proceeding. If the Build::Config task is finished then the
Build::Group will create Build::Tasks according to the configuration and queue
the respective jobs (for starters these will be at least one Build::Test task
and one Job::Test).

If the Build::Group is cancelled then all tasks belonging to the group are
cancelled and messages are sent to the workers which also cancel the jobs (or
take them off the queue).

### Build::Task

Build::Task is the base class for concrete classes that implement elementary
units of work.

Build::Config and Build::Test are examples of a concrete task types and these
are the only ones currently implemented. In future there might be other types
of Tasks, e.g. building rdocs, gathering code metrics, triggering external
services and so on.

A Build::Task has the following states which apply to all concrete Build::Task
types:

* queued
* started
* finished
* failed
* cancelled

### Build::Test

A Test encapsulates the concept of fetching source code, installing dependencies
and executing a test suite.

Additionally to the Build::Task states a Build::Test can be in the following
states:

* cloned
* installed

## Worker domain

Jobs are encapsulating the actual *execution* of units of work and map to
respective Build classes on the application side.

### Job::Config

A Job::Config fetches configuration data for a Build::Config. It is fetched
from a job queue, executed and then reported back to the application.

### Job::Test

A Job::Test fetches code from a SCM (git clone), installs dependencies (rvm,
bundle install), executes before\_script, build script and after\_script and
reports results back to the application.
