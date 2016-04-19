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
    return ast || {};
  }),

  description: Ember.computed('ast', function () {
    return this.get('ast.description');
  }),

  params: Ember.computed('ast', function () {
    const tags = this.get('ast.tags') || [];

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
