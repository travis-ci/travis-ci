describe('Travis.Log.deansi', function() {
  function deansi(string) {
    return Travis.Log.deansi(string);
  }

  describe('colors', function() {
    var sets = [
      { ansi: "30",      class: 'black'               },
      { ansi: "31",      class: 'red'                 },
      { ansi: "32",      class: 'green'               },
      { ansi: "33",      class: 'yellow'              },
      { ansi: "34",      class: 'blue'                },
      { ansi: "35",      class: 'magenta'             },
      { ansi: "36",      class: 'cyan'                },
      { ansi: "37",      class: 'white'               },
      { ansi: "90",      class: 'grey'                },
      { ansi: "30;1",    class: 'black bold'          },
      { ansi: "31;1",    class: 'red bold'            },
      { ansi: "32;1",    class: 'green bold'          },
      { ansi: "34;1",    class: 'blue bold'           },
      { ansi: "33;1",    class: 'yellow bold'         },
      { ansi: "35;1",    class: 'magenta bold'        },
      { ansi: "36;1",    class: 'cyan bold'           },
      { ansi: "37;1",    class: 'white bold'          },
      { ansi: "42;37;1", class: 'white bg-green bold' }
    ];

    sets = sets.map(function (set) {
      return { ansi: "\033[" + set.ansi + 'm', class: set.class };
    });

    it('removes all occurrences of \e(B', function() {
      str = String.fromCharCode(27) + '(Bfoo' + String.fromCharCode(27) + '(Bbar'
      expect(deansi(str)).toEqual('foobar');
    });

    it('removes all occurrences of \e', function() {
      expect(deansi(String.fromCharCode(27) + 'foo' + String.fromCharCode(27) + 'bar')).toEqual('foobar');
    });

    it('replaces ANSI escape sequences having no closing sequence with a span having the respective css classes', function() {
      $.each(sets, function(ix, set) {
        var source = (set.ansi + 'FOO').repeat(3);
        var expected = ('<span class="' + set.class +'">FOO</span>').repeat(3);
        expect(deansi(source)).toEqual(expected);
      });
     });

    it('replaces ANSI escape sequences having a closing sequence [m with a span having the respective css classes', function() {
      $.each(sets, function(ix, set) {
        var source = (set.ansi + 'FOO\033[m').repeat(3);
        var expected = ('<span class="' + set.class +'">FOO</span>').repeat(3);
        expect(deansi(source)).toEqual(expected);
      });
    });

    it('replaces ANSI escape sequences having a closing sequence [0m with a span having the respective css classes', function() {
      $.each(sets, function(ix, set) {
        var source = (set.ansi + 'FOO\033[0m').repeat(3);
        var expected = ('<span class="' + set.class +'">FOO</span>').repeat(3);
        expect(deansi(source)).toEqual(expected);
      });
    });

    it('replaces ANSI escape sequence (real examples)', function() {
      var examples = [
        { source: '\033[42;37;1mPassed\033[0m',       result: '<span class="white bg-green bold">Passed</span>' },
        { source: '\033[0;33;40mFailure',             result: '<span class="yellow bg-black">Failure</span>'    },
        { source: '\033[0;37;40mSuccess',             result: '<span class="white bg-black">Success</span>'     },
        { source: '\033[32m.\033[0m\033[31mF\033[0m', result: '<span class="green">.</span><span class="red">F</span>' },
        { source: '\033[31m2 failed\033[0m, \033[33m2 undefined\033[0m, \033[32m35 passed\033[0m', result: '<span class="red">2 failed</span>, <span class="yellow">2 undefined</span>, <span class="green">35 passed</span>' },
        { source: '\033[31m2 failed\033[0m, \033[36m1 skipped\033[0m, \033[33m7 undefined\033[0m, \033[32m212 passed\033[0m', result: '<span class="red">2 failed</span>, <span class="cyan">1 skipped</span>, <span class="yellow">7 undefined</span>, <span class="green">212 passed</span>' },
        { source: '\033[32mUsing /home/vagrant/.rvm/gems/ruby-1.8.7-p334\033[m' + String.fromCharCode(27) + '(B\r\n', result: '<span class="green">Using /home/vagrant/.rvm/gems/ruby-1.8.7-p334</span>\r\n' },
        { source: '\033[32mYour bundle is complete! Use `bundle show [gemname]` to see ...\033[0m\r\n', result: '<span class="green">Your bundle is complete! Use `bundle show [gemname]` to see ...</span>\r\n' },
        { source: '\033[31mcucumber features/command_line.feature:176\033[0m\033[90m # Scenario: Recompiling a project\033[0m\r\n', result: '<span class="red">cucumber features/command_line.feature:176</span><span class="grey"> # Scenario: Recompiling a project</span>\r\n' },
        { source: '\033[30;42m\033[2KOK (22 tests, 31 assertions)\n\033[0m[2K\nGenerating textual code coverage report, this may take a moment.', result: '<span class="black bg-green">OK (22 tests, 31 assertions)\n</span>\nGenerating textual code coverage report, this may take a moment.' }
      ];
      $.each(examples, function(ix, example) {
        expect(deansi(example.source)).toEqual(example.result);
      });
    });
  });

  describe('carriage returns', function() {
    it('replaces a line followed by a carriage return', function() {
      var source   = 'remote: Compressing objects: 100% (21/21)   \rremote: Compressing objects: 100% (21/21), done.';
      var expected = 'remote: Compressing objects: 100% (21/21), done.';
      expect(deansi(source)).toEqual(expected);
    });

    it('replaces a line followed by an ansii clear line escape sequence and a carriage return', function() {
      var source   = 'remote: Compressing objects: 98% (20/21)   \033[K\rremote: Compressing objects: 100% (21/21), done.';
      var expected = 'remote: Compressing objects: 100% (21/21), done.';
      expect(deansi(source)).toEqual(expected);
    });

    it('removes [K sequences preceeding a carriage return', function() {
      var source   = 'remote: Compressing objects: 100% (21/21), done. \033[K\r';
      var expected = 'remote: Compressing objects: 100% (21/21), done. \r';
      expect(deansi(source)).toEqual(expected);
    });

    it('removes [2K sequences', function() {
      var source   = '\033[2KOK (22 tests, 31 assertions)';
      var expected = 'OK (22 tests, 31 assertions)';
      expect(deansi(source)).toEqual(expected);
    });

    it('does not replaces a line followed by a carriage return when this is the last character in the string', function() {
      var source   = 'remote: Compressing objects: 100% (21/21)   \r';
      var expected = 'remote: Compressing objects: 100% (21/21)   \r';
      expect(deansi(source)).toEqual(expected);
    });

    it('does not replace a line followed by a carriage return and a newline', function() {
      var source   = 'remote: Counting objects: 31, done.\r\nremote: Compressing objects: 100% (21/21), done.';
      var expected = 'remote: Counting objects: 31, done.\r\nremote: Compressing objects: 100% (21/21), done.';
      expect(deansi(source)).toEqual(expected);
    });
  });
});

