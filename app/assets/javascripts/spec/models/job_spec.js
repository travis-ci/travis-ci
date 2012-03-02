describe('Job', function() {
   var job, build;
  describe('instance', function() {
    beforeEach(function() {
      //this will create the travis repostiory and a passing build.
      job = Test.Factory.Job.single()
      build = Test.Factory.Build.passing()
    });

    describe('associations', function() {
      it('has a build', function() {
        expect(job.get('build').get('number')).toEqual(1);
      });

      it('belongs to a repository', function() {
        expect(job.get('repository').get('slug')).toEqual(build.get('repository').get('slug'));
      });
    });

    describe('properties', function() {
      describe('color', function() {
        it('returns "green" if the last build has passed', function() {
          job.set('result', 0);
          expect(job.get('color')).toEqual('green');
        });

        it('returns "red" if the last build has failed', function() {
          job.set('result', 1);
          expect(job.get('color')).toEqual('red');
        });

        it('returns undefined if the last build result is unknown', function() {
          job.set('result', null);
          expect(job.get('color')).toEqual(undefined);
        });
      });

      describe('duration', function() {
	it('returns a string for duration of the job', function() {
	  expect(job.get('duration')).toEqual(10)
	});

	it('returns a duration of 0 if the job has not started or ended', function() {
	  job.set('started_at', null)
	  expect(job.get('duration')).toEqual(0)
	});
      });

      describe('formattedDuration', function() {
	it('returns the properly formatted string when the job is finished', function() {
	  expect(job.get('formattedDuration')).toEqual('10 sec')
	});

	it('returns - when he job has not started yet', function() {
	  job.set('started_at', null)
	  expect(job.get('formattedDuration')).toEqual('-')
	});
      });

      describe('formattedFinishedAt', function() {
	it('returns a string for duration of the job', function() {
	  expect(job.get('formattedFinishedAt').indexOf('ago')).toBeGreaterThan(0);
	});

	it('returns a duration of 0 if the job has not started or ended', function() {
	  job.set('finished_at', null)
	  expect(job.get('formattedFinishedAt')).toEqual('-')
	});
      });


      describe('formattedCommit', function() {
	it('returns a commit message formatted with the branch name', function() {
	  expect(job.get('formattedCommit')).toEqual('4d7621e (master)')
	});

	it('returns an empty string when there is no commit meesage', function() {
	  job.set('commit', null)
	  job.set('branch', null)
	  expect(job.get('formattedCommit')).toEqual('')
	});
      });

      describe('formattedCompareUrl', function() {
	it('returns an empty string when there is no compare_url', function() {
	  expect(job.get('formattedCompareUrl')).toEqual('')
	});

	it('returns the last part in the url when there is a compare url', function() {
	  job.set('compare_url', 'https://github.com/travis-ci/travis-ci/compare/9bc2212...9d1e44a')
	  expect(job.get('formattedCompareUrl')).toEqual('9bc2212...9d1e44a')
	});
      });

      describe('formattedConfig', function() {
	it('returns the configuration formatted', function() {
	  expect(job.get('formattedCompareUrl')).toEqual('')
	});

	it('returns the last part in the url when there is a compare url', function() {
	  job.set('compare_url', 'https://github.com/travis-ci/travis-ci/compare/9bc2212...9d1e44a')
	  expect(job.get('formattedCompareUrl')).toEqual('9bc2212...9d1e44a')
	});
      });

      describe('formattedConfigValues', function() {

	it('returns an empty array when there is nothing to format', function() {
          expect(job.get('formattedConfigValues')).toEqual([]);
	});

	it('returns the config items as an array of Ember Objects', function() {
	  job.set('config', { rvm: ['1.9.2', 'rbx'], gemfile: ['Gemfile.rails-2.3.x', 'Gemfile.rails-3.x'] });
          config_values = $.map(job.get('formattedConfigValues'), function(item) {
	    return item.get('value');
	  })
	  expect(config_values).toEqual(['1.9.2', 'rbx', 'Gemfile.rails-2.3.x', 'Gemfile.rails-3.x']);
	});
      });

      describe('formattedLog', function() {
	it('returns the log formatted', function() {
	  expect(job.get('formattedLog')).toEqual('<p><a href="#/L1" id="/L1" name="L1">1</a>Done. Build script exited with: 0</p>')
	});
      });

      describe('formattedMessage', function() {
	it('returns the message formatted', function() {
	  job.set('message','travis-ci is \n AWESOME :/')
	  expect(job.get('formattedMessage')).toEqual('travis-ci is <br/> AWESOME :/')
	});
      });

      describe('url', function() {
	it('returns the url for this job', function() {
	  expect(job.get('url')).toEqual('#!/travis-ci/travis-ci/jobs/9')
	});
      });

    });

    describe('methods', function() {
	it('update', function() {
          expect(job.get('result')).toBeNull();
          job.update({ result: 1 })
          expect(job.get('result')).toEqual(1);
	});

      it('appendLog', function() {
        job.set('log', 'test-1');
        job.appendLog('test-2');
        expect(job.get('log')).toEqual('test-1test-2');
      });

      it('subscribe', function() {
	expect(Travis.channels.indexOf('job-9')).toEqual(-1);
	job.subscribe()
	expect(Travis.channels.indexOf('job-9')).toEqual(0);
      });

    });

  });
});

