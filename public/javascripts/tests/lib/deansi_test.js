String.prototype.repeat = function(num) {
  return new Array(num + 1).join(this);
}

describe('Deansi', function() {
  function deansi(string) {
    return Deansi.parse(string);
  };

  describe('colors', function() {
    var sets = [
      { ansi: "[30m",      class: 'black'               },
      { ansi: "[31m",      class: 'red'                 },
      { ansi: "[32m",      class: 'green'               },
      { ansi: "[33m",      class: 'yellow'              },
      { ansi: "[34m",      class: 'blue'                },
      { ansi: "[35m",      class: 'magenta'             },
      { ansi: "[36m",      class: 'cyan'                },
      { ansi: "[37m",      class: 'white'               },
      { ansi: "[90m",      class: 'grey'                },
      { ansi: "[30;1m",    class: 'black bold'          },
      { ansi: "[31;1m",    class: 'red bold'            },
      { ansi: "[32;1m",    class: 'green bold'          },
      { ansi: "[34;1m",    class: 'blue bold'           },
      { ansi: "[33;1m",    class: 'yellow bold'         },
      { ansi: "[35;1m",    class: 'magenta bold'        },
      { ansi: "[36;1m",    class: 'cyan bold'           },
      { ansi: "[37;1m",    class: 'white bold'          },
      { ansi: "[42;37;1m", class: 'bg-green white bold' },
    ];

    it('removes all occurrences of \e(B', function() {
      expect(deansi(String.fromCharCode(27) + '(Bfoo' + String.fromCharCode(27) + '(Bbar')).toEqual('foobar');
    });

    it('removes all occurrences of \e', function() {
      expect(deansi(String.fromCharCode(27) + 'foo' + String.fromCharCode(27) + 'bar')).toEqual('foobar');
    });

    it('replaces ANSI escape sequences having no closing sequence with a span having the respective css classes', function() {
      for(ix in sets) {
        var set = sets[ix];
        source = (set.ansi + 'FOO').repeat(3);
        expected = ('<span class="' + set.class +'">FOO</span>').repeat(3);
        expect(deansi(source)).toEqual(expected);
      }
     });

    it('replaces ANSI escape sequences having a closing sequence [m with a span having the respective css classes', function() {
      for(ix in sets) {
        var set = sets[ix];
        source = (set.ansi + 'FOO[m').repeat(3);
        expected = ('<span class="' + set.class +'">FOO</span>').repeat(3);
        expect(deansi(source)).toEqual(expected);
      }
    });

    it('replaces ANSI escape sequences having a closing sequence [0m with a span having the respective css classes', function() {
      for(ix in sets) {
        var set = sets[ix];
        source = (set.ansi + 'FOO[0m').repeat(3);
        expected = ('<span class="' + set.class +'">FOO</span>').repeat(3);
        expect(deansi(source)).toEqual(expected);
      }
    });

    it('replaces ANSI escape sequence (real examples)', function() {
      var examples = [
        { source: '[42;37;1mPassed[0m', result: '<span class="bg-green white bold">Passed</span>' },
        { source: '[0;33;40mFailure',   result: '<span class="yellow bg-black">Failure</span>'    },
        { source: '[0;37;40mSuccess',   result: '<span class="white bg-black">Success</span>'     },
        { source: '[32m.[0m[31mF[0m',   result: '<span class="green">.</span><span class="red">F</span>' },
        { source: '[31m2 failed[0m, [33m2 undefined[0m, [32m35 passed[0m', result: '<span class="red">2 failed</span>, <span class="yellow">2 undefined</span>, <span class="green">35 passed</span>' },
        { source: '[31m2 failed[0m, [36m1 skipped[0m, [33m7 undefined[0m, [32m212 passed[0m', result: '<span class="red">2 failed</span>, <span class="cyan">1 skipped</span>, <span class="yellow">7 undefined</span>, <span class="green">212 passed</span>' },
        { source: '[32mUsing /home/vagrant/.rvm/gems/ruby-1.8.7-p334[m' + String.fromCharCode(27) + '(B\r\n', result: '<span class="green">Using /home/vagrant/.rvm/gems/ruby-1.8.7-p334</span>\r\n' },
        { source: '[32mYour bundle is complete! Use `bundle show [gemname]` to see ...[0m\r\n', result: '<span class="green">Your bundle is complete! Use `bundle show [gemname]` to see ...</span>\r\n' },
        { source: '[31mcucumber features/command_line.feature:176[0m[90m # Scenario: Recompiling a project[0m\r\n', result: '<span class="red">cucumber features/command_line.feature:176</span><span class="grey"> # Scenario: Recompiling a project</span>\r\n' },
      ]
      for(ix in examples) {
        var example = examples[ix];
        expect(deansi(example.source)).toEqual(example.result);
      }
    });
  });

  describe('carriage returns', function() {
    it('replaces a line followed by a carriage return', function() {
      source   = 'remote: Compressing objects: 100% (21/21)   \rremote: Compressing objects: 100% (21/21), done.';
      expected = 'remote: Compressing objects: 100% (21/21), done.';
      expect(deansi(source)).toEqual(expected);
    });

    it('replaces a line followed by an ansii clear line escape sequence and a carriage return', function() {
      source   = 'remote: Compressing objects: 100% (21/21)   [K\rremote: Compressing objects: 100% (21/21), done.';
      expected = 'remote: Compressing objects: 100% (21/21), done.';
      expect(deansi(source)).toEqual(expected);
    });

    it('removes [K sequences preceeding a carriage return', function() {
      source   = 'remote: Compressing objects: 100% (21/21), done. [K\r';
      expected = 'remote: Compressing objects: 100% (21/21), done. \r';
      expect(deansi(source)).toEqual(expected);
    });

    it('does not replaces a line followed by a carriage return when this is the last character in the string', function() {
      source   = 'remote: Compressing objects: 100% (21/21)   \r';
      expected = 'remote: Compressing objects: 100% (21/21)   \r';
      expect(deansi(source)).toEqual(expected);
    });

    it('does not replace a line followed by a carriage return and a newline', function() {
      source   = 'remote: Counting objects: 31, done.\r\nremote: Compressing objects: 100% (21/21), done.';
      expected = 'remote: Counting objects: 31, done.\r\nremote: Compressing objects: 100% (21/21), done.';
      expect(deansi(source)).toEqual(expected);
    });
  });
});
