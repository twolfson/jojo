/**
 * jojo - 10 second blog engine for hackers (in javascript)
 * @param {Object<ExpressServer>} [app] App to write to
 * @param {Object} [options] Various options corresponding to jojo
 * @param {String} [options.baseRoute='/'] Route where the base file will be rendered // TODO
 * @param {String} [options.renderEngine='ejs'] Route where the base file will be rendered // TODO
 * @param {String} [options.templateDir='templates'] Directory to retrieve templates from // TODO
 * @param {String} [options.articlesDir='articles'] Directory to retrieve articles from// TODO
 * @returns {Object<ExpressServer>} Express server initiall passed or created with the proper routes
 */
function jojo(app, options) {
  // If the first argument is not a server
  if (!app || app._locals === undefined) {
    // Promote it as options and create a server
    options = app;
    app = require('express').createServer();
  }

  // Fallback options
  options = options || {};

  var baseRoute = options.baseRoute || '/';

  // Return the server
  return app;
};

module.exports = jojo;