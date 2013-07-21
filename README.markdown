# Travis CI

## What is Travis CI?

Travis CI is a distributed build system for the open source community.


## See It In Action

You can see Travis CI in action at [travis-ci.org][travis-ci]. At about 1 year
in operation, we have some prominent open source projects trusting
[travis-ci.org][travis-ci] to run their continuous integration:

[travis-ci]: https://travis-ci.org

- Ruby projects: [Ruby on Rails](http://travis-ci.org/rails/rails),
  [Bundler](http://travis-ci.org/carlhuda/bundler),
  [Sinatra](http://travis-ci.org/sinatra/sinatra),
  [Rack](http://travis-ci.org/rack/rack),
  [RSpec](http://travis-ci.org/rspec/rspec-core),
  [Cucumber](http://travis-ci.org/cucumber/cucumber),
  [HAML](http://travis-ci.org/nex3/haml)
  and [SASS](http://travis-ci.org/nex3/sass),
  [RubyGems](http://travis-ci.org/rubygems/rubygems),
  [rubygems.org](http://travis-ci.org/rubygems/rubygems.org),
  [Mongoid](http://travis-ci.org/mongoid/mongoid),
  [Rubinius](http://travis-ci.org/rubinius/rubinius),
  [Factory Girl](http://travis-ci.org/thoughtbot/factory_girl),
  [Spree](http://travis-ci.org/spree/spree),
  [Devise](http://travis-ci.org/plataformatec/devise),
  [amqp gem](http://travis-ci.org/ruby-amqp/amqp) and even the
  [GitHub mirror of CRuby (MRI) itself](http://travis-ci.org/ruby/ruby).
- JavaScript projects: [Node.js](http://travis-ci.org/joyent/node),
  [npm](http://travis-ci.org/isaacs/npm),
  [Express](http://travis-ci.org/visionmedia/express),
  [Vows](http://travis-ci.org/cloudhead/vows),
  [Mocha](http://travis-ci.org/visionmedia/mocha),
  [Ember.js](http://travis-ci.org/emberjs/ember.js (formerly SproutCore 2)),
  [Batman.js](http://travis-ci.org/Shopify/batman) and numerous
  [flatiron](https://github.com/flatiron) subprojects.
- PHP projects: [Symfony 2](http://travis-ci.org/symfony/symfony),
  [Doctrine 2](http://travis-ci.org/doctrine/doctrine2),
  [Zend Framework 2](http://travis-ci.org/zendframework/zf2),
  [Composer](http://travis-ci.org/composer/composer),
  [Behat](http://travis-ci.org/Behat/Behat) as well as numerous Symfony 2
  bundles and Zend Framework 2 modules.
- Clojure projects: [Leiningen](http://travis-ci.org/technomancy/leiningen),
  [Midje](http://travis-ci.org/marick/Midje),
  [clj-time](http://travis-ci.org/seancorfield/clj-time),
  [Lamina](http://travis-ci.org/ztellman/lamina),
  [Knockbox](http://travis-ci.org/reiddraper/knockbox),
  [Langohr](http://travis-ci.org/michaelklishin/langohr),
  [Monger](http://travis-ci.org/michaelklishin/monger),
  [CongoMongo](http://travis-ci.org/seancorfield/congomongo),
  [Neocons](http://travis-ci.org/michaelklishin/neocons),
  [Sumo](http://travis-ci.org/reiddraper/sumo).
- Erlang projects: [Cowboy](http://travis-ci.org/extend/cowboy) and
  [Elixir](http://travis-ci.org/elixir-lang/elixir).
- Java projects:
  [Riak Java client](https://travis-ci.org/basho/riak-java-client/),
  [Cucumber JVM](https://travis-ci.org/cucumber/cucumber-jvm/),
  [Symfony 2 Eclipse Plugin](https://travis-ci.org/pulse00/Symfony-2-Eclipse-Plugin).
- Scala projects: [Scalding](https://travis-ci.org/twitter/scalding) and
  [Scalatra](https://travis-ci.org/scalatra/scalatra).
- Python projects: [Tornado](http://travis-ci.org/facebook/tornado),
  [simplejson](http://travis-ci.org/simplejson/simplejson),
  [Fabric](http://travis-ci.org/fabric/fabric),
  [Requests](http://travis-ci.org/kennethreitz/requests),
  [Kombu](http://travis-ci.org/ask/kombu).
- .NET/Mono community: [Nancy](http://travis-ci.org/NancyFx/Nancy).


## Goals

Travis is an attempt to create an open source, distributed build system for the
OSS community that:

- Allows open source projects to effortlessly register their GitHub repository
  and have their test suites run after pushes
- Allows users to contribute build capacity by connecting a machine that runs
  [Travis workers](https://github.com/travis-ci/travis-worker) and the [virtual
  machines they use](https://github.com/travis-ci/travis-boxes) on their
  underused servers.

With Travis CI our vision is to become for builds (i.e. tests, for starters)
what services like rubygems.org or Maven Central are for distribution of
libraries.

We strive to build a rock-solid, but dead easy to use, open source continuous
integration service for the open source community.


### We Are Not Done Yet

Please note that this is a work in progress. We have only reached our #1 goal so
far. We try to follow the 80/20 rule for requirements, i.e., we focus on the
most common use cases.

Travis CI is **not** currently a good fit for closed in-house installations.
It's made up of multiple applications which evolve rapidly. We are working on
providing a way to install a closed in-house installation, but we have no ETA
for this at the moment. Please get in touch at <support@travis-ci.com> for more
information.


## Get In Touch!

- [GitHub](https://github.com/travis-ci)
- [Twitter](https://twitter.com/travisci)
- [IRC (travis)][irc]
- [Mailing list][mailing-list]

[irc]: http://webchat.freenode.net?channels=travis&uio=d4
[mailing-list]: http://groups.google.com/group/travis-ci


## User Documentation

We care about our documentation and make sure our [documentation guides]
(http://about.travis-ci.org/docs/) are clearly written and up to date. Please
make sure you read them. Two key guides are:

- [Getting started](http://about.travis-ci.org/docs/user/getting-started)
- [Build Configuration](http://about.travis-ci.org/docs/user/build-configuration)

and we also have technology-specific guides:

- [Clojure](http://about.travis-ci.org/docs/user/languages/clojure/)
- [Erlang](http://about.travis-ci.org/docs/user/languages/erlang/)
- [Groovy](http://about.travis-ci.org/docs/user/languages/groovy/)
- [Java](http://about.travis-ci.org/docs/user/languages/java/)
- [JavaScript](http://about.travis-ci.org/docs/user/languages/javascript-with-nodejs/) (with Node.js)
- [Perl](http://about.travis-ci.org/docs/user/languages/perl/)
- [PHP](http://about.travis-ci.org/docs/user/languages/php/)
- [Python](http://about.travis-ci.org/docs/user/languages/python/)
- [Ruby](http://about.travis-ci.org/docs/user/languages/ruby/)
- [Scala](http://about.travis-ci.org/docs/user/languages/scala/)


## Technical Overview

Travis consists of several parts:

- An Ember.js-based single-page application that runs client side.
- A Rails 3 application that serves to the in-browser application and takes
  pings from Github.
- A JRuby and [AMQP](http://bit.ly/amqp-model-explained) powered worker for
  running a project's test suite in snapshotted virtual machines.
- A websocket server (we use [Pusher](http://pusher.com)) for tailing build
  results to the browser.
- A JRuby-based AMQP daemon that collects build reports, workers state,
  propagates them to Pusher, delivers notifications and so on.
- [Chef cookbooks](https://github.com/travis-ci/travis-cookbooks) that are used
  to provision the [Travis CI environment]
  (http://about.travis-ci.org/docs/user/ci-environment/) (to provide databases,
  RabbitMQ, Rubies/JDK/Node.js versions and so on) and tools that [build VM
  images](https://github.com/travis-ci/travis-boxes).

All these applications, tools and libraries are hosted under the [Travis CI
organization on GitHub](https://github.com/travis-ci).

A more detailed overview is available in our [Technical Overview guide]
(http://bit.ly/travisci-technical-overview) aimed at developers.


## Developer Documentation

Please keep in mind that Travis CI evolves rapidly and developer documentation
may be outdated. (Pull requests are welcome.) Development, [travis-ci.org]
(https://travis-ci.org) maintenance, and user documentation take priority.

- [travis worker](http://about.travis-ci.org/docs/dev/worker/)


## What Is This Repository?

This repository contains the old Rails app that used to serve [travis-ci.org]
[travis-ci]. Everything has now been extracted to different repositories, and
this repository is only being used as a global issue tracker and to run
migrations against the database.


## Contribute

Want to contribute to Travis CI? Great! We realise that the documentation for
contributors isn't the best at the time, but feel free to ask us questions on
the [mailing list][mailing-list] or in [IRC][irc]. A good place to start would
be the [technical overview][] and then feading the `CONTRIBUTING` file for the
repository you're contributing to.

[technical overview]: http://about.travis-ci.org/docs/dev/overview/


## History

### Design Iterations

- [Second design Feb 2010](https://skitch.com/svenfuchs/rtfas/travis.2)
- [First design Jan 2010](https://skitch.com/svenfuchs/rtms3/travis-design-1-2010-02)
- Initial mockups of [index](https://github.com/travis-ci/travis-ci/raw/master/docs/mockups/main.png) and [details](https://github.com/travis-ci/travis-ci/raw/master/docs/mockups/build_details.png)


## Other sources

- [Travis CI](http://bostonrb.org/presentations/travis-ci) - Video: Presentation
  at Boston.rb ([Jeremy Weisskotten](https://twitter.com/#!/doctorzaius))
- [Travis - a distributed build server tool for the Ruby community]
  (http://svenfuchs.com/2011/2/5/travis-a-distributed-build-server-tool-for-the-ruby-community) -
  Introductory blog post about the original idea ([Sven
  Fuchs](http://svenfuchs.com))

