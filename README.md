jojo
====
the 10 second blog-engine for hackers (in javascript).

Inspired heavily by [toto](https://github.com/cloudhead/toto)

I rewrote it because I was frustrated at not being able integrate with my current server without starting 2 servers.
As a result, jojo can create an [express](http://expressjs.com/) server
```
var app = require('jojo').createServer();
```

or you can use jojo as [express](http://expressjs.com/) middleware.
```
var app = require('express').createServer(),
    jojo = require('jojo');
app.use(jojo);
```

Getting started
===============
GitHub
------
This GitHub repo is a pre-boxed funtional blog. Run the two commands and you will have a blog running at [localhost:8080](http://localhost:8080).
```
git clone git://github.com/twolfson/jojo.git
node app.js // Server is running at http://localhost:8080/
```

NPM
---
jojo is available as an npm package and can be used in any node project as such. This method is not as suggested since none of the views are set up.
```
npm install jojo
```

Configuring jojo
================
jojo was built to use express settings for the majority of its configuration. This means you can update jojo's configuration as you do with express:
```
app.set('jojo settingA', true);
app.settings['jojo settingB'] = true;
```

Default settings
----------------
```
// Base URL used by jojo for all blog posts
// (i.e. http://localhost:8080/ will be an index page containing summaries of recent blog posts.)
app.set('jojo basepath', '/');

// Directory where articles are read from
app.set('jojo articles', 'articles');

// View file used to render page that summarizes recent blog posts
app.set('jojo index view', 'pages/index');

// View file used to render page each blog post
app.set('jojo article view', 'pages/article');

// View file used to render RSS feed for blog
app.set('jojo rss view', 'xml');

// Data parser used for data at the head of each blog file
app.set('jojo data parser', 'json');

// Formatter to use while reading blog content
app.set('jojo formatter', 'showdown');
```

API
===
jojo
----
jojo is a middleware function for [express](http://expressjs.com/). It accepts the standard set of parameters (req, res, next).

jojo.config
-----------
The config is data available in all jojo views. This is initially read in via config.jojo.json which a sibling explanation file config.jojo.explanation.json.
Currently, this is semantically improper since there is no config data for jojo present here.

jojo.createServer
-----------------
Creates and returns an express server with the same parameters it is given and includes jojo as middleware. 

jojo.index
----------
Middleware function for generating the index view with all articles. It accepts the standard set of parameters (req, res, next).

jojo.article
----------
Middleware function for generating an article view. It accepts the standard set of parameters (req, res, next).

jojo.rss
----------
Middleware function for generating blog rss. It accepts the standard set of parameters (req, res, next).

jojo.getUrl
-----------
Overwritable function for generating the URL of a blog post. Defaults to YYYY-MM-DD-blog-post-title.

jojo.getSummary
-----------
Overwritable function for generating the summary of a blog post. Defaults to slicing at 150 characters.

jojo.Yoyo
---------
Constructor function that binds an app and its state to stateless article reading.
```
@param {Object} [app] Server to bind on
@param {Object} [app.settings] Settings to use from the server
```

jojo.readArticles
-----------
Function to read in articles from a specific directory. Note: This will always use 'json' and 'showdown' to parse the file. If you want to use custom parsers, you must construct a new jojo.Yoyo.
```
@param {String} articleDir Directory to read articles from
@param {Function} callback Error first callback to return article to
```

jojo.readArticle
-----------
Function to read in an article. Note: This will always use 'json' and 'showdown' to parse the file. If you want to use custom parsers, you must construct a new jojo.Yoyo.
```
@param {String} articlePath Path to read in an article from
@param {Function} callback Error first callback to return article to
```

jojo.parseArticle
-----------
Function to parse an article. Note: This will always use 'json' and 'showdown' to parse the file. If you want to use custom parsers, you must construct a new jojo.Yoyo.
```
@param {String} articlePath Path to read in an article from
@param {Function} callback Error first callback to return article to
```

jojo.express
------------
Express object that is being used by jojo.