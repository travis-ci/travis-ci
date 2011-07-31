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

### Build

A Build implements the concept of a highlevel grouping of Build::Tasks (units
of work). It is triggered by the Build::Request. A Build has a configuration
and at least one Build::Task but can own many tasks, depending on its
configuration. It can also be rejected based on the configuration.

A Build::Group has the following states:

* created
* configured
* started
* finished
* errored
* cancelled

### Build::Task

Build::Tasks are classes that represent elementary units of work.

Build::Task::Configure and Build::Task::Test are examples of a concrete task
types and these are the only ones currently implemented. In future there might
be other types of Tasks, e.g. building rdocs, gathering code metrics,
triggering deployments and so on.

A Build::Task has the following states which apply to all concrete Build::Task
types:

* created
* started
* finished
* errored
* cancelled

When a Build::Task is created then the respective job that maps to this task is
also created and added to the job queue.

### Build::Task::Configure

A Build::Task::Configure encapsulates the concept of configuring a Build before
it will be executed.

Configuring a Build is a separate task because configuration can be (and
currently exclusively is) stored remotely so fetching can fail etc.

### Build::Task::Test

A Build::Task::Test encapsulates the concept of fetching source code,
installing dependencies and executing a test suite.

Additionally to the common Build::Task states a Build::Test can be in the
following states:

* cloned
* installed

## Worker domain

On the worker side Build::Tasks encapsulate the actual *execution* of units of
work and map to respective Task classes on the application side.

### Build::Task::Configure

A Build::Task::Configure fetches configuration data. It is fetched from a job
queue, executed and reports the configuration back to the application.

### Build::Task::Test

A Build::Task::Test fetches code from a SCM (git clone), installs dependencies
(rvm, bundle install), executes before\_script, build script and after\_script
and reports results back to the application.

## Control Flow

When a build request comes in then a Build::Request and a Build::Group is
created. The Build::Group will create its Build::Task::Configure and push it
onto the job queue.

The worker will pick up the Build::Task::Configure and start working on it. It
will send messages back to the application which will trigger state changes in
the respective Build::Task::Configure on the server side.

When the Build::Task::Configure errors then the containing Build::Group will
immediatedly go into the same state and stop proceeding. (At a later stage we
might retry the errored task for particular reasons, like Github was down.)

When the Build::Task::Configure has finished and the build is approved then the
Build::Group will create and queue one or more Build::Tasks according to the
configuration (for starters these will be at least one Build::Task::Test).

The worker will then pick up the Build::Task::Test and start working on it. It
will send messages back to the application which will trigger state changes in
the respective Build::Build::Task on the server side.

When a Build::Task has started then it notifies the containing Build::Group
which goes into the same state when first notified. (I.e. it goes into the
started state as soon as the first contained Task has started.)

When a Build::Task has errored or finished then it notifies the containing
Build::Group which goes into the same state, too, as soon as all contained
Build::Tasks are errored or finished.

When the Build::Group is cancelled at any time then all tasks belonging to the
group are cancelled and messages are sent to the workers which also cancel the
jobs (or take them off the queue).

So, in more detail:

### Build::Group creation

* Github pings
* App creates a Build::Request
* App creates a Build::Group with the Build::Request
* App emits a build::group:created event
* App gets the Build::Config from the Build::Group and queues it
* App emits a build:config:queued event

### Build:Group configuration

* Worker starts the Build::Config
* Worker emits a build:config:started event
* Worker processes and finishes the Build::Config
* Worker emits a build:config:finished event (carrying the config)

### Build:Group approval

If the build is eligible (i.e. not excluded by the configuration) then:

* App saves the configuration and spawns one or many Build::Tests
* App queues each of the Build::Tests
* App emits one or many build:test:queued events

### Build::Group disapproval

If the build is uneligible (i.e. excluded by the configuration) then:

* App deletes the Build::Group and its Build::Config.
* App emits a build:group:removed event

### Build::Test execution

* Worker starts a Build::Test
* Worker emits a build:test:started event
* Worker processes the Job::Test
* Worker emits multiple build:test:update events (carrying incremental updates)
* Worker finishes the Job::Test
* Worker emits a build:test:finished event (carrying the result and full log)

### Build::Test completion

* App saves the job result and log

### Build group completion

* If all Build::Tests are finished then the Build::Group is finished, too
* App then emits a build:group:finished event


