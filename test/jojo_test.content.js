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
  runChildProcess: {
    before: function spawnChildProcess (done) {
      // Start up a child server
      this.child = spawn(this.cmd, this.args, this.options);

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
  'integrated into a server': [
    function startIntegratedServer () {
      this.cmd = 'node';
      this.args = ['app.js'];
      this.options = {
        cwd:  __dirname + '/test_files/integrated',
        // stdio: [0, 1, 2]
      };
    },
    'runChildProcess'
  ],
  'jojo running with no articles': [
    function startEmptyServer () {
      this.cmd = 'node';
      this.args = ['app.js'];
      this.options = {
        cwd:  __dirname + '/test_files/integrated',
        // stdio: [0, 1, 2]
      };
    },
    'runChildProcess'
  ],

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
  'serves an index page': [
    function requestHomepage () {
      this.url = 'http://localhost:11550/';
    }, 'makeRequest',
    function assertHomepage () {
      expect(this.body).to.contain('<section id="articles">');
      expect(this.body).to.contain('the-wonderful-wizard-of-oz');
    }
  ],
  'serves articles': [
    function requestArticle () {
      this.url = 'http://localhost:11550/1900-05-17-the-wonderful-wizard-of-oz';
    }, 'makeRequest',
    function assertArticle () {
      expect(this.body).to.contain('<h1>The Wonderful Wizard of Oz</h1>');
    }
  ],
  'serves an RSS feed': [
    function requestRss () {
      this.url = 'http://localhost:11550/index.xml';
    }, 'makeRequest',
    function assertRss () {
      expect(this.body).to.contain('<id>1900-05-17-the-wonderful-wizard-of-oz</id>');
    }
  ],
  'serves content': [
    function requestEmptyHomepage () {
      this.url = 'http://localhost:11550/';
    }, 'makeRequest',
    function assertEmptyHomepage () {
      expect(this.body).to.contain('<section id="articles">');
    }
  ]
};