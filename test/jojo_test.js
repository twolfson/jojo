// Load in dependencies
var spawn = require('child_process').spawn,
    request = require('request'),
    expect = require('chai').expect;

var testUtils = {
  spawn: function (cmd, args, options) {
    before(function spawnChildProcess (done) {
      // Start up a child server
      this.child = spawn(this.cmd, this.args, this.options);

      // After it loads, callback
      setTimeout(done, 200);
    });
    after(function killChildProcess (done) {
      // Kill the child process
      var child = this.child;
      delete this.child;
      child.kill();

      // When it leaves, callback
      child.on('exit', function (code) {
        done();
      });
    });
  },
  request: function () {
    before(function requestFn (done) {
      var that = this;
      request(this.url, function handleResponse (err, res, body) {
        // Save the error, response, and body
        that.err = err;
        that.res = res;
        that.body = body;

        // Callback with the error
        done(err);
      });
    });
    after(function cleanup () {
      delete this.err;
      delete this.res;
      delete this.body;
    });
  }
};

describe('jojo', function () {
  describe('run via CLI', function () {
    testUtils.spawn('node', __dirname + '../../../bin/jojo', {
      cwd: __dirname + '/test_files/cli'
    });
    it('serves articles', function () {

    });
  });

  describe('integrated into a server', function () {
    testUtils.spawn('node', 'app.js', {
      cwd: __dirname + '/test_files/integrated'
    });
    it('serves an index page', function () {

    });
    it('serves articles', function () {

    });
    it('serves an RSS feed', function () {

    });
  });
});
describe('jojo running with no articles', function () {
  testUtils.spawn('node', 'app.js', {
    cwd: __dirname + '/test_files/integrated'
  });
  it('serves content', function () {

  });
});
