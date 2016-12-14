## Application domain

The following classes encapsulate the application domain model concepts. I.e.
they are part of the application server code, can be stored as ActiveRecords
and are targetted at being published through the JSON API and/or sync'ed over
to the client app through websocket messages.

### Request

A Request is what external services, like currently Github, send to Travis. It
contains the sent payload and has a one-to-one relationship to a Build.

### Build

A Build implements the concept of a highlevel grouping of Tasks (units of
work). It is triggered by the Request. A Build has a configuration and at least
one Task but can own many tasks, depending on its configuration. It can also be
rejected based on the configuration.

A Build has the following states:

* created
* configured
* started
* finished
* errored
* cancelled

### Task

Tasks are classes that represent elementary units of work.

Task::Configure and Task::Test are examples of a concrete task types and these
are the only ones currently implemented. In future there might be other types
of Tasks, e.g. building rdocs, gathering code metrics, triggering deployments
and so on.

A Task has the following states which apply to all concrete Task types:

* created
* started
* finished
* errored
* cancelled

When a Task is created then the respective job that maps to this task is also
created and added to the job queue.

### Task::Configure

A Task::Configure encapsulates the concept of configuring a Build before it
will be executed.

Configuring a Build is a separate task because configuration can be (and
currently exclusively is) stored remotely so fetching can fail etc.

### Task::Test

A Task::Test encapsulates the concept of fetching source code, installing
dependencies and executing a test suite.

Additionally to the common Task states a Build::Test can be in the following
states:

* cloned
* installed

## Worker domain

On the worker side Tasks encapsulate the actual *execution* of units of work
and map to respective Task classes on the application side.

### Task::Configure

A Task::Configure fetches configuration data. It is fetched from a job queue,
executed and reports the configuration back to the application.

### Task::Test

A Task::Test fetches code from an SCM (git clone), installs dependencies (rvm,
bundle install), executes before\_script, build script and after\_script and
reports results back to the application.

## Control Flow

When a build request comes in then a Request and a Build is created. The Build
will create its Task::Configure and push it onto the job queue.

The worker will pick up the Task::Configure and start working on it. It will
send messages back to the application which will trigger state changes on the
respective Task::Configure on the server side.

If the Task::Configure errors then the containing Build will immediatedly go
into the same state and stop proceeding. (At a later stage we might retry the
errored task for particular reasons, like Github was down.)

Once the Task::Configure has finished and the build is approved then the Build
will create and queue one or more Tasks according to the configuration (for
starters these will be at least one Task::Test).

The worker will then pick up the Task::Test and start working on it. It will
send messages back to the application which will trigger state changes in the
respective Task on the server side.

When a Task has started then it notifies the containing Build which goes into
the same state when first notified. (I.e. it goes into the started state as
soon as the first contained Task has started.)

When a Task has errored or finished then it notifies the containing Build which
goes into the same state, too, as soon as all contained Tasks are errored or
finished.

When the Build is cancelled at any time then all tasks belonging to the build
are cancelled and messages are sent to the workers which also cancel the jobs
(or take them off the queue).

So, in more detail:

### Build creation

* Github pings
* App creates a Request
* App creates a Build with the Request
* App emits a build:created event
* App gets the Build::Configure from the Build and queues it
* App emits a build:configure:queued event

### Build configuration

* Worker starts the Build::Configure
* Worker emits a build:configure:started event
* Worker processes and finishes the Build::Configure
* Worker emits a build:configure:finished event (carrying the config)

### Build approval

* App saves the configuration.

If the build is eligible (i.e. not excluded by the configuration) then:

* App spawns one or many Build::Tests
* App queues each of the Build::Tests
* App emits one or many build:test:queued events

### Build::Test execution

* Worker starts a Build::Test
* Worker emits a build:test:started event
* Worker processes the Job::Test
* Worker emits multiple build:test:update events (carrying incremental updates)
* Worker finishes the Job::Test
* Worker emits a build:test:finished event (carrying the result and full log)

### Build::Test completion

* App saves the job result and log

### Build completion

* If all Build::Tests are finished then the Build is finished, too
* App then emits a build:finished event


