// Load in dependencies
var fs = require('fs'),
    express = require('express'),
    jsonContentDemux = require('json-content-demux'),
    marked = require('marked');

// Class to handle storing articles
function ArticleCollection(options) {
  // Create placeholder for articles
  this._articles = [];

  // Fallback and save options for later
  this.options = options || {};
}
ArticleCollection.parseArticle = function (article, options) {
  // Fallback options
  options = options || {};

  // Demux content
  var demuxer = options.dataParser || jsonContentDemux,
      demuxedArticle = demuxer(article),
      data = demuxedArticle.json,
      markup = demuxedArticle.content;

  // Render the content
  var formatter = options.formatter || marked,
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

  // Return the data
  return retObj;
};
ArticleCollection.prototype = {
  // Add a new article from plaintext
  addArticle: function (text) {
    // Parse and add the particle to our list
    var article = ArticleCollection.parseArticle(text, this.options);
    this._articles.push(article);
  },
  // Add a new article based on file path
  addArticleFromFile: function (filepath) {
    // Read and add the article
    var text = fs.readFileSync(filepath, 'utf8');
    this.addArticle(text, this.options);
  },
  // Return array of articles
  articles: function () {
    return this._articles;
  }
};

// Define our jojo middleware
function jojo(config) {
  // Create a new server
  var app = express();

  // Fallback options
  config = config || {};

  // Create a new collection for our articles
  var collection = new ArticleCollection(config);

  // Locate and add articles from config
  var articleDir = config.articles || process.cwd() + '/articles',
      articleFiles = fs.readdirSync(articleDir);
  articleFiles.forEach(function addArticleFn (articleFile) {
    var articlePath = articleDir + '/' + articleFile;
    collection.addArticleFromFile(articlePath);
  });

  // Grab the articles
  var articles = collection.articles();

  // For each article, generate a URL
  var urlFormatter = config.urlFormatter || jojo.urlFormatter;
  articles.forEach(function generateUrl (article) {
    article.url = urlFormatter(article);
  });

  // Sort the articles
  var articleSort = config.articleSort || jojo.articleSort;
  articles.sort(articleSort);

  // On all routes, expose articles
  app.use(function addArticles (req, res, next) {
    req.articles = articles;
    res.locals.articles = articles;
    next();
  });

  // Define methods to bind to all articles in one fell swoop
  app.articles = {};
  ['use', 'get', 'post', 'put', 'delete', 'options', 'all'].forEach(function bindArticleMethod (method) {
    app.articles[method] = function (fn) {
      // Iterate over the articles and use the middleware on it
      articles.forEach(function saveArticleMethod (article) {
        app[method](article.url, fn(article));
      });
    };
  });

  // Serve each article at its url
  app.articles.use(function serveArticles (article) {
    return function serveArticleFn (req, res, next) {
      req.article = article;
      res.locals.article = article;
      next();
    };
  });

  // If we are supposed to render, then render
  var render = config.render === undefined ? true : config.render;
  if (render) {
    // Render the homepage
    app.get('/', function renderIndex (req, res) {
      res.render('index');
    });

    // Render an XML webpage
    app.get('/index.xml', function renderRss (req, res) {
      res.render('xml');
    });

    // For each article, render it
    app.articles.get(function renderArticles (article) {
      return function renderArticleFn (req, res) {
        res.render('article');
      };
    });
  }

  // Return the app
  return app;
}
// Default URL formatter, 1900-05-17-the-wonderful-wizard-of-oz
var moment = require('moment');
jojo.urlFormatter = function (article) {
  var date = article.date,
      dateStr = moment(date).format('YYYY-MM-DD'),
      url = '/' + dateStr + '-' + article.title.replace(/\s+/g, '-');
  url = url.toLowerCase();
  return url;
};

// By default, sort by descending dates
jojo.articleSort = function (articleA, articleB) {
  return articleB.rawDate - articleA.rawDate;
};

// Expose ArticleCollection on jojo
jojo.ArticleCollection = ArticleCollection;

// Expose jojo
module.exports = jojo;