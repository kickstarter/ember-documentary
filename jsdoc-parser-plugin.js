var path = require('path');
var fs = require('fs');

var Plugin = require('broccoli-plugin');
var glob = require('glob');
var esprima = require('esprima');
var doctrine = require("doctrine");
var mkdirp = require("mkdirp");

JSDocParserPlugin.prototype = Object.create(Plugin.prototype);
JSDocParserPlugin.constructor = JSDocParserPlugin;
function JSDocParserPlugin(inputNodes, options) {
  this.inputNodes = inputNodes;
  this.options = options || {};
  Plugin.call(this, this.inputNodes, this.options);
}

JSDocParserPlugin.prototype.build = function() {
  var json = {};
  var content = 'exports["default"] = ';
  var outputPath = path.join(this.outputPath, 'modules', 'ember-documentary');

  this.inputNodes.forEach(function (node) {
    Object.assign(json, this.nodeToJSDocJSON(node));
  }.bind(this));

  content += JSON.stringify(json);

  mkdirp.sync(outputPath);
  fs.writeFileSync(path.join(outputPath, 'ast.js'), content);
};

/**
 * @param {String} searchPath - The initial search path, i.e. `app/components`
 * @returns {Object} A hash of paths mapped to their JSDoc AST.
 *                   Extensions are stripped.
 */
JSDocParserPlugin.prototype.nodeToJSDocJSON = function(searchPath) {
  var extensions = this.options.extensionNames || ['js'];
  var fileNames;
  var hash = {};

  if (extensions === 0) {
    throw new Error('At least one file extension name is required.');
  } else if (extensions.length === 1) {
    fileNames = `*.${extensions[0]}`;
  } else {
    fileNames = `*.{${extensions.join(',')}}`;
  }
  var searchQuery = path.join(searchPath, '**', fileNames);

  glob.sync(searchQuery).forEach(function (jsPath) {
    var normalizedPath = this.normalizedPath(searchPath, jsPath);
    var source = fs.readFileSync(jsPath);
    var ast = esprima.parse(source, {
      sourceType: 'module', // ES2015
      attachComment: true
    });

    var comments = this.findJSDocCommentsFromAST(ast);

    if (comments.length === 0) {
      // no JSDoc comments :(
      return;
    }

    var jsdocAST = doctrine.parse(comments[0].value, {unwrap: true});
    hash[normalizedPath] = jsdocAST;
  }.bind(this));

  return hash;
};

/**
 * @param {String} searchPath - The initial search path, i.e. `app/components`
 * @param {String} jsPath - The path to normalize.
 * @returns {String} A normalized path; slashes are replaced with periods, and
 *                   the search path and extension are removed.
 */
JSDocParserPlugin.prototype.normalizedPath = function (searchPath, jsPath) {
  var extName = path.extname(jsPath);
  // normalize # of ending slashes
  searchPath = path.join(searchPath, path.sep);

  var normalized = jsPath.slice(searchPath.length, -extName.length)
  // normalize slashes as periods
  normalized = normalized.replace(new RegExp('\\' + path.sep, 'g'), '.');
  // normalize pods/modules by removing trailing `.component`
  normalized = normalized.replace(/\.component$/, '');
  return normalized;
};

/**
 * @param ast - A JSDoc AST.
 * @returns {Array.String} An array of block comments in JSDoc format.
 * @todo Only consider top-level comments.
 */
JSDocParserPlugin.prototype.findJSDocCommentsFromAST = function(ast) {
  if (!ast.comments) {
    return [];
  }

  return ast.comments.filter(function (comment) {
    // comment is block-level and is a JSDoc comment, i.e. starts with `/**`.
    return comment.type === 'Block' && comment.value[0] === '*';
  });
};

module.exports = JSDocParserPlugin;
