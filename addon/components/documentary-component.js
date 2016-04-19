import Ember from 'ember';
import layout from '../templates/components/documentary-component';

import JSDocAST from 'ember-documentary/ast';

/**
 * Outputs the description of a given component.
 *
 * @param {String} componentPath - Path to the component.
 */
export default Ember.Component.extend({
  layout,

  componentPath: undefined,

  componentName: Ember.computed.alias('componentPath'),

  ast: Ember.computed('componentPath', function () {
    const componentPath = this.get('componentPath');
    const ast = JSDocAST[componentPath];

    if (!ast) {
      throw new Error(`Error trying to find AST: ${componentPath} not found.`);
    }

    return ast;
  }),

  description: Ember.computed('ast', function () {
    const ast = this.get('ast');
    return ast.description || '';
  }),

  params: Ember.computed('ast', function () {
    const ast = this.get('ast');
    const tags = ast.tags || [];

    return tags.filter(function (tag) {
      return tag.title === 'param';
    });
  }),

  signature: Ember.computed('componentName', function () {
    const componentName = this.get('componentName');
    const params = this.get('params').map(function (param) {
      return `${param.name}=${param.type.name}`;
    }).join(' ');
    return `{{${componentName} ${params}}}`;
  })
});
