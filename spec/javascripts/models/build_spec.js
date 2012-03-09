describe('Build', function() {
  describe('class methods', function() {
    describe('byRepositoryId', function() {
      it('requests GET /repositories.json', function() {
        Travis.Build.byRepositoryId(1);
        expect(mostRecentAjaxRequest().url).toEqual('/repositories/1/builds.json?bare=true');
      });
    });

    describe('createOrUpdate', function() {
      it('calls createOrUpdate for each of the matrix builds, too', function() {
        var build = Travis.Build.createOrUpdate({ id: 99, number: '1', matrix: [{ id: 2, number: '1.1' }]});
        build = Travis.Build.find(build.get('id'));

        expect(build.get('number')).toEqual(1);
        expect(build.getPath('matrix.firstObject.number')).toEqual('1.1');
      });
    });
  });

  describe('instance', function() {
    var repository, build;

    beforeEach(function() {
      repository = Test.Factory.Repository.travis();
      build = Test.Factory.Build.passing();
    });

    describe('associations', function() {
      it('has many tests as a matrix', function() {
        expect(build.get('matrix').objectAt(0).get('number')).toEqual('1.1'); // what's a better way to test this? is there something like className in sc 2?
      });

      it('belongs to a repository', function() {
        var _repository = build.get('repository');
        whenReady(_repository, function() {
          expect(_repository.get('slug')).toEqual(repository.get('slug'));
        })
      });
    });

  // update
  //   it updates with the given attributes
  //   it does partial updates on matrix job attributes

  // updateTimes
  //   it updates properties based on duration
  //   it updates properties based on finished_at

  // isMatrix
  //   returns true if the matrix has more than one build
  //   returns false if the matrix has only one build
  //   updates bindings when the matrix length changes

    describe('properties', function() {
      describe('color', function() {
        it('returns "green" if the build has passed', function() {
          build.set('result', 0);
          expect(build.get('color')).toEqual('green');
        });

        it('returns "red" if the build has failed', function() {
          build.set('result', 1);
          expect(build.get('color')).toEqual('red');
        });

        it('returns undefined if the build result is unknown', function() {
          build.set('result', null);
          expect(build.get('color')).toEqual(undefined);
        });

        it('updates when the build result changes')
      });

    });

    describe('message', function() {
      it ('changes emoji to image tags', function() {
        build.set('message', 'The :cake: is a lie');
        expect(build.get('formattedMessage')).toEqual('The <img class="emoji" title=":cake:" alt=":cake:" src="/assets/emoji/cake.png"/> is a lie');
      });

      it ('changes multiple emoji to image tags', function() {
        build.set('message', 'I :heart: :cake:');
        expect(build.get('formattedMessage')).toEqual('I <img class="emoji" title=":heart:" alt=":heart:" src="/assets/emoji/heart.png"/> <img class="emoji" title=":cake:" alt=":cake:" src="/assets/emoji/cake.png"/>');
      });

      it ('changes emoji not separated by spaces to image tags', function() {
        build.set('message', 'I :heart::cake:');
        expect(build.get('formattedMessage')).toEqual('I <img class="emoji" title=":heart:" alt=":heart:" src="/assets/emoji/heart.png"/><img class="emoji" title=":cake:" alt=":cake:" src="/assets/emoji/cake.png"/>');
      });

      it ('changes multiple identical emoji to image tags', function() {
          build.set('message', 'I :heart: :heart:');
          expect(build.get('formattedMessage')).toEqual('I <img class="emoji" title=":heart:" alt=":heart:" src="/assets/emoji/heart.png"/> <img class="emoji" title=":heart:" alt=":heart:" src="/assets/emoji/heart.png"/>');
      });

      it ('does not change message without emoji', function() {
        build.set('message', 'Issue: This is normal commit :: Something with ActiveSupport::Callbacks: remove __define_runner');
        expect(build.get('formattedMessage')).toEqual('Issue: This is normal commit :: Something with ActiveSupport::Callbacks: remove __define_runner');
      });

      it ('trims message to first line in build list for shortMessage', function() {
        build.set('message', 'First line of commit.\n\nSecond line of commit');
        expect(build.get('shortMessage')).toEqual('First line of commit.');

        build.set('message', 'First line of commit.\nSecond line of commit');
        expect(build.get('shortMessage')).toEqual('First line of commit.');
      });

      it ('shows mulitple lines commits in multiple html lines', function() {
        build.set('message', 'First line of commit.\n\nSecond line of commit\nThird line.');
        expect(build.get('formattedMessage')).toEqual('First line of commit.<br/><br/>Second line of commit<br/>Third line.');
      });
    });
  });
});
