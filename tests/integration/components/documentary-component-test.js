import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('documentary-component', 'Integration | Component | documentary component', {
  integration: true
});

test('it renders the signature', function(assert) {
  this.render(hbs`{{documentary-component componentPath='documentary-component'}}`);

  const text = this.$('h2').text().trim();
  assert.equal(text, '{{documentary-component componentPath=String}}');
});

test('it renders the description', function(assert) {
  this.render(hbs`{{documentary-component componentPath='documentary-component'}}`);

  const text = this.$('p:first').text().trim();
  assert.ok(/Provides JSDoc information about/.test(text));
});

test('it renders the parameters', function(assert) {
  this.render(hbs`{{documentary-component componentPath='documentary-component'}}`);

  const text = this.$('li:first').text().trim().replace(/\s+/g, ' ');
  assert.equal(text, 'componentPath (String): Path to the component.');
});

test('it renders a given block', function(assert) {
  this.render(hbs`
    {{#documentary-component componentPath='documentary-component'}}
      Hello world!
    {{/documentary-component}}
  `);

  const text = this.$().text().trim();
  assert.equal(text, 'Hello world!');
});

test('gives the block access to component properties', function(assert) {
  this.render(hbs`
    {{#documentary-component componentPath='documentary-component' as |meta|}}
      {{meta.signature}}
    {{/documentary-component}}
  `);

  const text = this.$().text().trim();
  assert.equal(text, '{{documentary-component componentPath=String}}');
});

test('renders components in pod structure', function(assert) {
  this.render(hbs`
    {{#documentary-component componentPath='test-components.hello-world' as |meta|}}
      {{meta.description}}
    {{/documentary-component}}
  `);

  const text = this.$().text().trim();
  assert.equal(text, 'A fairly fake component.');
});

test('renders positional and optional parameters', function(assert) {
  this.render(hbs`
    {{#documentary-component componentPath='test-components.funky-parameters' as |meta|}}
      {{meta.signature}}
    {{/documentary-component}}
  `);

  const text = this.$().text().trim().replace(/\s+/g, ' ');
  assert.equal(text, '{{test-components.funky-parameters title body=String [description=String] [author="John"]}}');
});
