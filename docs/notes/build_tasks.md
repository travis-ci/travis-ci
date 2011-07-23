# Refactoring to Builds, Tasks and Tests

In order to simplify code and make classes better map to domain concepts, we
are going to refactor the server/app and worker code to the following classes:

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
* started
* finished
* errored
* cancelled

### Build::Task

Build::Task is the base class for concrete classes that represent elementary
units of work.

Build::Config and Build::Test are examples of a concrete task types and these
are the only ones currently implemented. In future there might be other types
of Tasks, e.g. building rdocs, gathering code metrics, triggering deployments
and so on.

A Build::Task has the following states which apply to all concrete Build::Task
types:

* created
* started
* finished
* errored
* cancelled

When a Build::Task is created then the respective job that maps to this task is
also created and added to the job queue.

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

## Control Flow

When a build request comes in from Github then a Build::Request and a
Build::Group is created. The Build::Group will create its Build::Config task
which will queue a Job::Config.

The worker will pick up the Job::Config and start working on it. It will send
messages back to the application which will trigger state changes in the
respective Build::Config.

When the Build::Config task errors then the containing Build::Group will
immediatedly go into the same state and stop proceeding. (At a later stage we
might retry the errored task for particular reasons, like Github was down.)

When the Build::Config task has finished then the Build::Group will create more
Build::Tasks according to the configuration and queue the respective jobs (for
starters these will be at least one Build::Test task and a Job::Test).

The worker will then pick up the Job::Test and start working on it. It will
send messages back to the application which will trigger state changes in the
respective Build::Test.

When a Build::Task has started then it notifies the containing Build::Group
which goes into the same state when first notified. (I.e. it goes into the
started state as soon as the first contained Task has started.)

When a Build::Task has errored or finished then it notifies the containing
Build::Group which goes into the same state, too, as soon as all contained
Build::Tasks are errored or finished.

When the Build::Group is cancelled at any time then all tasks belonging to the
group are cancelled and messages are sent to the workers which also cancel the
jobs (or take them off the queue).
