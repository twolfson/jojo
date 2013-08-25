// Load in dependencies
var fs = require('fs'),
    express = require('express'),
    jsonContentDemux = require('json-content-demux'),
    marked = require('marked');

function parseArticle(article, config) {
  // Fallback options
  config = config || {};

  // Demux content
  var demuxer = config.dataParser || jsonContentDemux,
      demuxedArticle = demuxer(article),
      data = demuxedArticle.json,
      markup = demuxedArticle.content;

  // Render the content
  var formatter = config.formatter || marked,
      content = formatter(markup);

  // Add information to data
  var retObj = data;
  retObj.rawDate = retObj.date;
  retObj.date = new Date(retObj.date);
  retObj.content = content;
  retObj.rawContent = markup;

  // If there is a summary, parse it via the formatter
  if (data.summary) {
    retObj.summary = formatter(data.summary);
  }

  // TODO: Url formatting depends on how we started initialization
  // // If there is no URL, fall it back
  // if (!retObj.url) {
  //   var urlFormatter = config.urlFormatter ||
  //   retObj.url =
  // }
  // // retObj.url = retObj.url || jojo.getUrl(retObj);

  // Return the data
  return retObj;
}

function readArticle(filepath, config) {
  // Fallback options
  config = config || {};

  // Read and parse the article
  var article = fs.readFileSync(filepath, 'utf8');
  return parseArticle(article, config);
}

// Define our jojo middleware
function jojo(config) {
  // Create a new server
  var app = express();

  // Fallback options
  config = config || {};

  // Locate articles from config
  var articleDir = config.articles || process.cwd() + '/articles',
      articleFiles = fs.readdirSync(articleDir),
      articles = articleFiles.map(function readArticleFn (articleFile) {
        var articlePath = articleDir + '/' + articleFile;
        return readArticle(articlePath, config);
      });
  console.log(articles);
}
module.exports = jojo;