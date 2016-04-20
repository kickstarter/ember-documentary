# Ember-documentary

Add JSDocs to your Ember components, then access those JSDocs elsewhere through an Ember component provided by `ember-documentary`. Great for living style guides.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Usage

Add JSDocs to your Ember components like so:

```js
/**
 * Provides JSDoc information about a particular component.
 *
 * Pass a block to this component to define your own template and operate upon
 * the JSDoc information. The block should take one argument, which is the
 * instance of this component. So, you can use this component like so:
 *
 * ```hbs
 * {{#documentary-component 'documentary-component' as |meta|}}
 *   {{meta.signature}}
 * {{/documentary-component}}
 * ```
 *
 * @param {String} componentPath - Path to the component.
 */
export default Ember.Component.extend({
});
```

Then in an Ember template, you can access the JSDoc information. An example:

```hbs
{{#documentary-component 'documentary-component' as |meta|}}
  {{meta.signature}}
{{/documentary-component}}
```

`meta` is an instance of `documentary-component`, so you should be able to access every property in the [component definition](https://github.com/kickstarter/ember-documentary/blob/master/addon/components/documentary-component.js). Still, a rudimentary list of the API is below.

## API

* `signature`: a generated signature for the Ember component. Example: `{{cool-component title requiredParam=String [optionalParam="default"]}}`
* `description`: The main body of the JSDoc comment, without any tag information.
* `params`: Array. (Keyword) param information for the Ember component.
* `positionalParams`: Array. Positional param information for the Ember component.
* `ast`: The raw JSDoc AST if you want to do low-level operations.

All the JSDoc tags (lines that start with `@`, like `@param`) have great documentation over at [usejsdoc](http://usejsdoc.org/).

### New JSDoc tag: @positionalParam

`@positionalParam` is not part of the official JSDoc spec. It is a custom tag I made for this library. It's implemented by preprocessing JSDoc comments and replacing any form of:

```
@positionalParam {OptionalType} name
```

with:

```
@param {OptionalType} __positional_param__name
```

The prefix `__positional_param__` is stripped from the param name inside the `documentary-component` `Ember.Component`.

## Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## License

Copyright Kickstarter, PBC.

Released under an [MIT License](https://github.com/kickstarter/ember-documentary/blob/master/LICENSE.md).
