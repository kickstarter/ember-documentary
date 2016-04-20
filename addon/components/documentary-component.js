import Ember from 'ember';
import layout from '../templates/components/documentary-component';

import JSDocAST from 'ember-documentary/ast';

const positionalParamPrefix = '__positional_param__';

/**
 * Provides JSDoc information about a particular component.
 *
 * Pass a block to this component to define your own template and operate upon
 * the JSDoc information. The block should take one argument, which is the
 * instance of this component. So, you can use this component like so:
 *
 * ```hbs
 * {{#documentary-component componentPath='documentary-component' as |meta|}}
 *   {{meta.signature}}
 * {{/documentary-component}}
 * ```
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

  description: Ember.computed.alias('ast.description'),

  params: Ember.computed('ast.tags', function () {
    const tags = this.get('ast.tags') || [];

    return tags.filter(function (tag) {
      return tag.title === 'param' &&
        tag.name.indexOf(positionalParamPrefix) !== 0;
    });
  }),

  positionalParams: Ember.computed('ast.tags', function () {
    const tags = this.get('ast.tags') || [];

    return tags.filter(function (tag) {
      return tag.title === 'param' &&
        tag.name.indexOf(positionalParamPrefix) === 0;
    }).map(function (tag) {
      const clone = JSON.parse(JSON.stringify(tag));
      clone.name = clone.name.slice(positionalParamPrefix.length);
      return clone;
    });
  }),

  signature: Ember.computed('componentName', 'params', function () {
    const componentName = this.get('componentName');
    const positionalParams = this.get('positionalParams').map(function (param) {
      return param.name;
    }).join(' ');
    const params = this.get('params').map(function (param) {
      let paramSignature = param.name;

      if (param.default) {
        paramSignature += `=${param.default}`;
      } else if (param.type && param.type.name) {
        paramSignature += `=${param.type.name}`;
      } else if (param.type && param.type.expression && param.type.expression.name) {
        paramSignature += `=${param.type.expression.name}`;
      }

      // should be last, to wrap with [].
      if (param.type && param.type.type === 'OptionalType') {
        paramSignature = `[${paramSignature}]`;
      }

      return paramSignature;
    }).join(' ');
    return `{{${componentName} ${positionalParams} ${params}}}`.trim().replace(/\s+/g, ' ');
  })
});
