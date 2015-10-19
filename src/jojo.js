// Load in dependencies
var fs = require('fs'),
    url = require('url'),
    connect = require('connect'),
    glob = require('glob'),
    express = require('express'),
    _ = require('underscore'),
    jsonContentDemux = require('json-content-demux'),
    marked = require('marked'),
    moment = require('moment'),
    slugg = require('slugg');

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
  // https://github.com/moment/moment/blob/cd49a734350193a244c596a02167221cbca2c06f/moment.js#L1623-L1631
  // Parse moment with timezone attached to it
  retObj.moment = moment(retObj.date).parseZone();
  // DEV: Warning this date will be using server timezone
  retObj.date = retObj.moment.toDate();
  retObj.content = content;
  retObj.rawContent = markup;

  // If there is a summary, parse it via the formatter
  if (data.summary) {
    retObj.summary = formatter(data.summary);
  }

  // Add on defaults
  _.defaults(retObj, options.defaults || {});

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
  // Fallback options
  config = config || {};

  // Create a new collection for our articles
  var collection = new ArticleCollection(config);

  // Locate and add articles from config
  var articlePattern = config.articles || process.cwd() + '/articles/*.{txt,md}',
      articleFiles = glob.sync(articlePattern);
  articleFiles.forEach(function addArticleFn (articlePath) {
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

  // Create a new server
  var app = connect();

  // Expose articles on the app
  app.articles = articles;

  // On all routes, expose articles and config
  app.use(function addArticles (req, res, next) {
    req.articles = articles;
    req.config = config;
    res.locals({
      articles: articles,
      config: config
    });
    next();
  });

  // Serve each article at its url
  articles.forEach(function serveArticles (article) {
    app.use(function serveArticleFn (req, res, next) {
      var parsedUrl = url.parse(req.url);
      if (parsedUrl.pathname === article.url) {
        req.article = article;
        res.locals({
          article: article
        });
      }
      next();
    });
  });

  // If we are supposed to render, then render
  var render = config.render === undefined ? true : config.render;
  if (render) {
    // Convert the app into an express app
    var jojoApp = app;
    app = express.createServer();
    app.use(jojoApp);

    // Render the homepage
    app.get('/', function renderIndex (req, res) {
      res.render('index');
    });

    // Render an XML webpage
    app.get('/index.xml', function renderRss (req, res) {
      res.render('xml');
    });

    // For each article, render it
    articles.forEach(function renderArticles (article) {
      app.get(article.url, function renderArticleFn (req, res) {
        res.render('article');
      });
    });
  }

  // Return the app
  return app;
}
// Default URL formatter, 1900-05-17-the-wonderful-wizard-of-oz
jojo.urlFormatter = function (article) {
  var dateStr = article.moment.format('YYYY-MM-DD'),
      url = dateStr + '-' + slugg(article.title);
  url = '/' + url.toLowerCase();
  return url;
};

// By default, sort by descending dates
jojo.articleSort = function (articleA, articleB) {
  return articleB.date - articleA.date;
};

// Expose ArticleCollection on jojo
jojo.ArticleCollection = ArticleCollection;

// Expose jojo
module.exports = jojo;
