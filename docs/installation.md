** extracted from the readme and outdated **

h2. Installation

To install your own instance of Travis you need to supply various configuration settings:

<pre>
$ cp config/travis.example.yml config/travis.yml
</pre>

In order to push these settings to Heroku you can use:

<pre>
$ rake heroku:config
</pre>

Starting a local worker:

<pre>
$ script/worker
</pre>

Or using God:

<pre>
$ cp config/resque.god.example config/resque.god
$ god -c config/resque.god
</pre>



