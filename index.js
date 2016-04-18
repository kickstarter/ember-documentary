/* jshint node: true */
'use strict';

var mergeTrees = require('broccoli-merge-trees');
var JSDocParserPlugin = require('./jsdoc-parser-plugin');

module.exports = {
  name: 'ember-documentary',

  treeForApp: function(tree) {
    var trees = [
      tree,
      new JSDocParserPlugin(this.jsdocSearchPaths())
    ];

    return mergeTrees(trees);
  },

  jsdocSearchPaths: function() {
    return this.app.options.jsdocSearchPaths || ['app'];
  }
};
