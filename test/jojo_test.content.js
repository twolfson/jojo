// Load in dependencies
var spawn = require('child_process').spawn,
    assert = require('assert'),
    request = require('request');

// Export doubleshot methods
module.exports = {
  // Placeholder starting fn
  'jojo': function () {
  },

  // Invoke jojo in various forms
  'run via CLI': function () {

  },
  // TODO: Relocate logic into `this.cmd`, `this.args`, and helper fn
  'integrated into a server': {
    before: function spawnChildProcess (done) {
      // Start up a child server
      this.child = spawn('node', ['app.js'], {
        cwd: __dirname + '/test_files/integrated',
        stdio: [0, 1, 2]
      });

      // After it loads, callback
      setTimeout(done, 200);
    },
    after: function killChildProcess (done) {
      // Kill the child process
      var child = this.child;
      child.kill();

      // When it leaves, callback
      child.on('exit', function (code) {
        done();
      });
    }
  },
  'jojo running with no articles': function () {

  },

  // Assertions against jojo
  'serves articles': function (done) {
    request('http://localhost:11550/', function handleResponse (err, res, body) {
      console.log('ERROR:', err);
      console.log('BODY:', body);
    });
  },
  'serves an index page': function () {

  },
  'serves an RSS feed': function () {

  }
};