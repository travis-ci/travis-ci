// Log = function(url, patterns) {
//   this.lines = [];
//   this.url = url;
//   this.patterns = patterns;
// };
// 
// Log.prototype = {
//   append: function(string) {
//     string = this.prependBuffer(string);
//     string = this.chopBuffer(string);
// 
//     if(string.length > 0) {
//       $.each(string.split('\\n'), function(ix, line) {
//         this.lines.push(new Log.Line(this, line));
//       }.bind(this));
//     }
//   },
// 
//   prependBuffer: function(string) {
//     if(this.buffer) {
//       string = this.buffer + string;
//       delete this.buffer;
//     }
//     return string;
//   },
// 
//   chopBuffer: function(string) {
//     if(string == '\\n') {
//     } else if(string.slice(-1) == '\\n') {
//       string = string.slice(0, -1);
//     } else {
//       var ix = string.lastIndexOf('\\n');
//       if(ix == -1) {
//         this.buffer = string;
//         string = '';
//       } else {
//         this.buffer = string.slice(ix, string.length);
//         string = string.slice(ix);
//       }
//     }
//     return string;
//   },
// 
//   toString: function() {
//     return this.lines.join('');
//   }
// };
// 
// Log.Line = function(log, line) {
//   this.log = log;
//   this.patterns = log.patterns;
//   this.line = line;
//   this.previous = log.lines[log.lines.length - 1];
//   this.number = log.lines.length + 1;
// 
//   this.match();
// }
// 
// Log.Line.prototype = {
//   match: function(current) {
//     if(this.log.state == undefined || this.log.state == 'finish') {
//       this.start();
//       return;
//     }
// 
//     if(this.log.state == 'start' || this.log.state == 'include') {
//       if(this.include()) {
//         return;
//       }
//     }
// 
//     this.finish();
//   },
// 
//   start: function() {
//     // console.log('start: ' + this.line)
//     for(fold in this.patterns) {
//       var pattern = this.patterns[fold].start;
//       if(this.line.match(pattern)) {
//         this.log.state = 'start'
//         this.log.fold = fold;
//         this.prefix = '<div class"fold ' + fold + '">';
//       }
//     }
//   },
// 
//   include: function() {
//     // console.log('include: [' + this.log.fold + ']: ' + this.line)
//     var pattern = this.patterns[this.log.fold].include;
//     if(pattern) {
//       if(this.line.match(pattern)) {
//         this.log.state = 'include';
//       } else {
//         this.log.state = 'finish';
//         this.previous.suffix += '</div>';
//       }
//       return true;
//     }
//   },
// 
//   finish: function() {
//     // console.log('finish: [' + this.log.fold + ']: ' + this.line)
//     var pattern = this.patterns[this.log.fold].finish;
//     if(pattern) {
//       if(this.line.match(pattern)) {
//         this.log.state = 'finish';
//         this.suffix = '</div>';
//         return true;
//       }
//     }
//   },
// 
//   toString: function() {
//     if(!('string' in this)) {
//       this.string = this.finalize();
//     }
//     return this.string;
//   },
// 
//   finalize: function() {
//     return [this.prefix, this.link(), this.line, this.suffix].join('');
//   },
// 
//   link: function() {
//     return '<p><a href="' + this.log.url + '">' + this.number + '</a></p>';
//   }
// }
// 
// describe('Log:', function() {
//   describe('incremental parsing', function() {
//     it('using an include pattern', function() {
//       var log = new Log('#', { bundle: { start: /^\\$ bundle install/, include: /^(Fetching|Using) / } });
// 
//       var lines = [
//         'Using worker: ruby2.worker.travis-ci.org:worker-3\\n',
//         '$ bundle install\\n',
//         'Fetching source index for http://rubygems.org/\\n',
//         'Your bundle is complete! Use `bundle show [gemname]` to see where a bundled gem is installed.\\n'
//       ];
//       $.each(lines, function(ix, line) { log.append(line) });
// 
//       var expected = 'Using worker: ruby2.worker.travis-ci.org:worker-3\\n' +
//         '<fold class"bundle">$ bundle install\\n' +
//         'Fetching source index for http://rubygems.org/</fold>\\n' +
//         'Your bundle is complete! Use `bundle show [gemname]` to see where a bundled gem is installed.'
//       expect(log.toString()).toEqual(expected);
//     });
// 
//     it('using a finish pattern', function() {
//       var log = new Log('#', { bundle: { start: /^\\$ bundle install/, finish: /^Your bundle/ } });
// 
//       var lines = [
//         'Using worker: ruby2.worker.travis-ci.org:worker-3\\n',
//         '$ bundle install\\n',
//         'Fetching source index for http://rubygems.org/\\n',
//         'Your bundle is complete! Use `bundle show [gemname]` to see where a bundled gem is installed.\\n'
//       ];
//       $.each(lines, function(ix, line) { log.append(line) });
// 
//       var expected = 'Using worker: ruby2.worker.travis-ci.org:worker-3\\n' +
//         '<fold class"bundle">$ bundle install\\n' +
//         'Fetching source index for http://rubygems.org/\\n' +
//         'Your bundle is complete! Use `bundle show [gemname]` to see where a bundled gem is installed.</fold>'
//       expect(log.toString()).toEqual(expected);
//     });
// 
//     describe('chunks', function() {
//       it('with a single chunked line', function() {
//         var log = new Log('#', { bundle: { start: /^\\$ bundle install/ } });
// 
//         var lines = [ '$ bundle', ' install\\n', ];
//         $.each(lines, function(ix, line) { log.append(line) });
// 
//         var expected = '<fold class"bundle">$ bundle install';
//         expect(log.toString()).toEqual(expected);
//       });
// 
//       it('with multiple chunked lines', function() {
//         var log = new Log('#', { bundle: { start: /^\\$ bundle install/ } });
// 
//         var lines = [ '$ bu', 'ndle', ' inst', 'all\\n', ];
//         $.each(lines, function(ix, line) { log.append(line) });
// 
//         var expected = '<fold class"bundle">$ bundle install';
//         expect(log.toString()).toEqual(expected);
//       });
//     });
// 
//     describe('more real world', function() {
//       it('parses a bundle install section', function() {
//         var log = new Log('#', { bundle: { start: /^\\$ bundle install/, include: /^(Updating|Using|Installing|Fetching|remote:|Receiving|Resolving) / } });
// 
//         var lines = [
//           'Using worker: ruby2.worker.travis-ci.org:worker-3\\n',
//           '$ bundle install\\n',
//           'Fetching git://github.com/nabeta/isbn-tools.git\\n',
//           'remote: Counting objects: 49, done.\\n',
//           'remote: Compressing objects: 100% (25/25), done.[K\\n',
//           'Receiving objects: 100% (49/49), 9.69 KiB, done.\\n',
//           'Resolving deltas: 100% (15/15), done.\\n',
//           'Fetching git://github.com/swanandp/acts_as_list.git\\n',
//           'remote: Counting objects: 199, done.[K\\n',
//           'remote: Compressing objects: 100% (122/122), done.[K\\n',
//           'remote: Total 199 (delta 64), reused 167 (delta 34)[K\\n',
//           'Receiving objects: 100% (199/199), 28.76 KiB, done.\\n',
//           'Resolving deltas: 100% (64/64), done.\\n',
//           'Fetching source index for http://rubygems.org/\\n',
//           'Using rake (0.9.2)\\n',
//           'Installing RedCloth (4.2.8) with native extensions\\n',
//           'Installing Saikuro (1.1.0) WARNING: Saikuro-1.1.0 has an invalid nil value for @cert_chain\\n',
//           '\\n',
//           'Installing aaronh-chronic (0.3.9)\\n',
//           'Installing abstract (1.0.0) WARNING: abstract-1.0.0 has an invalid nil value for @cert_chain\\n',
//           '\\n',
//           'Your bundle is complete! Use `bundle show [gemname]` to see where a bundled gem is installed.\\n',
//           '$ bundle exec rake\\n'
//         ];
//         $.each(lines, function(ix, line) { log.append(line) });
// 
//         var expected = 'Using worker: ruby2.worker.travis-ci.org:worker-3\\n' +
//           '<fold class"bundle">$ bundle install\\n' +
//           'Fetching source index for http://rubygems.org/</fold>\\n' +
//           'Your bundle is complete! Use `bundle show [gemname]` to see where a bundled gem is installed.'
// 
//         console.log(log.toString());
//         // expect(log.toString()).toEqual(expected);
//       });
//     });
//   });
// });
