# ✋ Do not open new issues here! ✋

# Travis CI

[Travis CI](https://travis-ci.com) is a hosted continuous integration and
deployment system. You can now test and deploy open source and private projects
on [travis-ci.com](https://travis-ci.com)! You can read more about this change 
[here](https://blog.travis-ci.com/2018-05-02-open-source-projects-on-travis-ci-com-with-github-apps).

## Move to Forum

We are moving to our new community forum: [Travis CI Community](https://travis-ci.community)! As part of this move, we’ll be able to better follow and reply to threads, along with making it easier for you to find solutions and answers.  We’ll be making our best efforts to answer currently existing threads, or directing them to the new community forum.

Link to the Community Forum: https://travis-ci.community

For current outages and incidents such as slow network connections, subscribe to https://www.traviscistatus.com.

Other support issues may be directed to support@travis-ci.com where our support team will be glad to assist.

This repository contains the [central issue
tracker](https://github.com/travis-ci/travis-ci/issues) for the Travis CI
project.

## Documentation

Documentation for the Travis CI project can be found at
<https://docs.travis-ci.com>.

## Other repositories

Travis CI consists of many different sub-projects. The main ones are:

### travis-api

[travis-api](https://github.com/travis-ci/travis-api) is the Sinatra app that's
responsible for serving our API. It responds to different HTTP endpoints and
runs services in [travis-core](#travis-core). Very little logic is in this
repository.

### travis-build

[travis-build](https://github.com/travis-ci/travis-build) creates the build
script for each job. It takes the configuration from the `.travis.yml` file and
creates a `bash` script that is then run in the build environment by
[travis-worker](#travis-worker).

### travis-cookbooks

[travis-cookbooks](https://github.com/travis-ci/travis-cookbooks) holds the
[Chef](https://docs.chef.io/index.html) cookbooks that are used to provision the build environments.

### travis-hub

[travis-hub](https://github.com/travis-ci/travis-hub) collects events from
other apps and notifies other apps about the events. For example, it notifies
[travis-tasks](#travis-tasks) about builds starting and finishing so
notifications can be sent out.

travis-hub is also responsible for enqueueing jobs that have been created and
enforcing the Quality of Service restrictions, such as the number of concurrent
builds per user.

### travis-listener

[travis-listener](https://github.com/travis-ci/travis-listener) receives
notifications from GitHub whenever commits are pushed or pull requests are
opened. They are then pushed onto RabbitMQ for other apps to process.

### travis-logs

[travis-logs](https://github.com/travis-ci/travis-logs) receives log updates
from [travis-worker](#travis-worker), saves them to the database and pushes
them to the [web client](#travis-web). When a job is finished, travis-logs is
responsible for pushing the log to Amazon S3 for archiving.

### travis-support

[travis-support](https://github.com/travis-ci/travis-support) holds shared
logic for the different Travis CI apps. It is different from travis-core in
that it holds more generic things, like how to run an async job or how to
handle exceptions.

### travis-tasks

[travis-tasks](https://github.com/travis-ci/travis-tasks) receives
notifications from [travis-hub](#travis-hub) and sends out notifications to the
different notification providers as needed.

### travis-web

[travis-web](https://github.com/travis-ci/travis-web) is our main Web client.
It is written using [Ember](http://emberjs.com) and communicates with
[travis-api](#travis-api) to get information and gets live updates from
[travis-hub](#travis-hub) and [travis-logs](#travis-logs) through
[Pusher](https://pusher.com/).

### travis-worker

[travis-worker](https://github.com/travis-ci/worker) is responsible for
running the build scripts in a clean environment. It streams the log output to
[travis-logs](#travis-logs) and pushes state updates (build starting/finishing)
to [travis-hub](#travis-hub).
