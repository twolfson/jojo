# jojo [![Build status](https://travis-ci.org/twolfson/jojo.png?branch=master)](https://travis-ci.org/twolfson/jojo)
the 10 second blog-engine for hackers (in javascript).

It was built for running as middleware inside an [express][] app but can be run standalone.

[express]: http://expressjs.com/2x/

```js
// articles/the-wonderful-wizard-of-oz.md
{
  "title": "The Wonderful Wizard of Oz",
  "author": "Lyman Frank Baum",
  "date": "1900/05/17"
}

Dorothy lived in the midst of the great Kansas prairies, with Uncle Henry,
who was a farmer, and Aunt Em, who was the farmer's wife.

// app.js
var jojo = require('jojo'),
    app = jojo();
app.listen(5000);
// Server is listening at http://localhost:5000/
// "The Wonderful Wizard of Oz" is being served at `/1900-05-16-the-wonderful-wizard-of-oz`
```

## Getting started
### Middleware
`jojo` is available via npm: `npm install jojo`

`jojo` is invoked with a configuration and can return a middleware or [express][] app.

```js
var app = jojo(); // express app
var app = jojo({render: false}); // vanilla middleware
```

By default, `jojo` reads articles from `articles` directory but this can be overridden via an option.

```js
var app = jojo({articles: 'papers'}); // Read articles from `papers`
```

By default, all articles are interpretted via [marked][], a [GitHub flavored markdown][gfm] parser.

More configuration options can be found in the [documentation][].

[marked]: https://github.com/chjj/marked
[gfm]: http://github.github.com/github-flavored-markdown/
[documentation]: #documentation

### Standalone
To run `jojo` as a standalone server, install `jojo` globally: `npm install -g jojo`.

`jojo` looks for a `jojo.js`/`jojo.json` to read in settings. These settings are passed to both a `jojo` middleware and [express][] app.

`jojo` also accepts arguments for choosing a different `config` or `port`.

```bash
$ jojo --help
Usage: jojo [options]
Options:
  -c, --config [config]  Config file to use (jojo.js, jojo.json)
  -p, --port [port]      Port to run server on (5000)
```

> `port` can also be specified in `jojo.js`/`jojo.json`

## Documentation
`jojo` has a wide spectrum of options


### jojo
`jojo` has an optional `options` parameter which modifies its behavior.

```js
jojo();
jojo(options);
/**
 * @param {Object} [options] Optional options to pass in to jojo
 * @returns {Function|Object} Based on options, returns a req/res/next function or express 2.x app.
 */
```

### options.render
`options.render` is expected as a `Boolean` and `true` by default.

When true, an [express 2.x][express] app will be returned by `jojo`.

Otherwise, a `req`/`res`/`next` middleware will be returned.

### options.articles
`options.articles` is expected as a `String` and `articles` by default.

This is the directory to read articles from. It is processed relative to `process.cwd()`.

### jojo.articles
`jojo.articles` is a sorted array of the parsed articles.

Each article has

- Any meta-data listed in the head of the file
- `rawContent`, unprocessed body
- `content`, formatted body
- `rawDate`, unprocessed date (from meta-data)
- `date`, `Date` object from `rawDate`
- `url`, URL path for article. This can be modified via [options.urlFormatter][urlFormatter].
- `rawSummary`, if `summary` is provided, this will be the unprocessed `summary`
- `summary`, if `summary` is provided, this will be the formatted `summary`

### req.articles, res.locals.articles
Same as `jojo.articles` but located on `req` and `res` for easy accessibility.

### req.article, res.locals.article
On article pages, this will be the corresponding `article`.

See [urlFormatter][] for more `url` information

[urlFormatter]:

### req.config, res.locals.config
Configuration passed in to `jojo`. If invoked from standalone, this will be the as the `config`.

###

dataParser

formatter

urlFormatter
articleSort

## Donating
Support this project and [others by twolfson][gittip] via [gittip][].

[![Support via Gittip][gittip-badge]][gittip]

[gittip-badge]: https://rawgithub.com/twolfson/gittip-badge/master/dist/gittip.png
[gittip]: https://www.gittip.com/twolfson/

## Attribution
`jojo` was iniitally inspired by [toto][].

[toto]: https://github.com/cloudhead/toto

## License
Copyright (c) 2013 Todd Wolfson

Licensed under the MIT license.