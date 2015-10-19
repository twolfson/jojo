// Load in dependencies
var spawn = require('child_process').spawn,
    request = require('request'),
    expect = require('chai').expect;

var testUtils = {
  spawn: function (cmd, args, options) {
    before(function spawnChildProcess (done) {
      // Start up a child server
      this.child = spawn(cmd, args, options);

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
  request: function (url) {
    before(function requestFn (done) {
      var that = this;
      request(url, function handleResponse (err, res, body) {
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
    testUtils.spawn('node', [__dirname + '../../../bin/jojo'], {
      cwd: __dirname + '/test_files/cli'
    });

    testUtils.request('http://localhost:11550/1900-05-17-the-wonderful-wizard-of-oz');
    it('serves articles', function () {
      expect(this.body).to.contain('<h1>The Wonderful Wizard of Oz</h1>');
    });
  });

  describe('integrated into a server', function () {
    testUtils.spawn('node', ['app.js'], {
      cwd: __dirname + '/test_files/integrated'
    });

    describe('with response to an index page', function () {
      testUtils.request('http://localhost:11550/');
      it('serves an index page', function () {
        expect(this.body).to.contain('<section id="articles">');
        expect(this.body).to.contain('the-wonderful-wizard-of-oz');
      });
    });

    describe('with respect to articles', function () {
      testUtils.request('http://localhost:11550/1900-05-17-the-wonderful-wizard-of-oz');
      it('serves articles', function () {
        expect(this.body).to.contain('<h1>The Wonderful Wizard of Oz</h1>');
      });
    });

    describe('with response to RSS', function () {
      testUtils.request('http://localhost:11550/index.xml');
      it('serves an RSS feed', function () {
        expect(this.body).to.contain('<id>/1900-05-17-the-wonderful-wizard-of-oz</id>');
      });
    });
  });
});

describe('jojo running with no articles', function () {
  testUtils.spawn('node', ['app.js'], {
    cwd: __dirname + '/test_files/empty_app'
  });

  testUtils.request('http://localhost:11550/');
  it('serves content', function () {
    expect(this.body).to.contain('<section id="articles">');
  });
});
