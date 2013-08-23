// Load in dependencies
var spawn = require('child_process').spawn,
    request = require('request'),
    expect = require('chai').expect;

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
        // stdio: [0, 1, 2]
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
  makeRequest: function (done) {
    var that = this;
    request(this.url, function handleResponse (err, res, body) {
      // Save the error, response, and body
      that.err = err;
      that.res = res;
      that.body = body;

      // Callback with the error
      done(err);
    });
  },
  'serves articles': [
    function requestHomepage () {
      this.url = 'http://localhost:11550/';
    }, 'makeRequest',
    function assertHomepage () {
      expect(this.body).to.contain('the-wonderful-wizard-of-oz');
      expect(this.body).to.contain('</footer>');
    }
  ],
  'serves an index page': function () {

  },
  'serves an RSS feed': function () {

  }
};