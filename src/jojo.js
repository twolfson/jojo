// Load in dependencies
var fs = require('fs'),
    express = require('express');

// Define our jojo middleware
function jojo(config) {
  // Create a new server
  var app = express();

  // Locate articles from config
  var articleDir = config.articles || process.cwd() + '/articles',
      articles = fs.readdirSync(articleDir);
  console.log(articles);
}
module.exports = jojo;