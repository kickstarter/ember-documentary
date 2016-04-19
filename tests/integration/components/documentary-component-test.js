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
  assert.equal(text, 'Outputs the description of a given component.');
});

test('it renders the parameters', function(assert) {
  this.render(hbs`{{documentary-component componentPath='documentary-component'}}`);

  const text = this.$('li:first').text().trim().replace(/\s+/g, ' ');
  assert.equal(text, 'componentPath (String): Path to the component.');
});
