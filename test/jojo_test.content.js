// Load in dependencies
var spawn = require('child_process').spawn,
    request = require('request'),
    expect = require('chai').expect;

// Export doubleshot methods
module.exports = {
  // Assertions against jojo

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
      expect(this.body).to.contain('<id>/1900-05-17-the-wonderful-wizard-of-oz</id>');
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
