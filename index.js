/* jshint node: true */
'use strict';

var mergeTrees = require('broccoli-merge-trees');
var JSDocParserPlugin = require('./jsdoc-parser-plugin');

module.exports = {
  name: 'ember-documentary',

  treeForAddon: function(tree) {
    var trees = [
      this._super.treeForAddon.call(this, tree),
      new JSDocParserPlugin(this.jsdocSearchPaths())
    ];

    return mergeTrees(trees);
  },

  jsdocSearchPaths: function() {
    return this.app.options.jsdocSearchPaths || ['app/components'];
  }
};
