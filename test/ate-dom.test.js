// The engine's HTML in jsdom: the transport buttons, the icons option and the CSS variables of the theme.
const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createPage } = require('./helpers/dom');
const { ATEEngine, ATEHTMLButton, ATEStyles } = require('../lib/index.js');

const transport = (document) => ({
  record: document.querySelector('.ate-button-record'),
  play: document.querySelector('.ate-button-play'),
  stop: document.querySelector('.ate-button-stop')
});
const imageOf = (button) => button.querySelector('img').getAttribute('src');
const cssVar = (element, name) => element.style.getPropertyValue(name).trim();

// Colours written as literals: hex, functional notations and the named colours a stylesheet would use.
const literalColour = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(|\b(white|black|red|green|blue|gr[ae]y|silver|yellow|orange|purple|pink|brown|navy|teal|maroon|olive|lime|aqua|fuchsia|cyan|magenta)\b/i;

// Every declaration of every inline style under (and on) root, except the custom properties' definitions.
function inlineDeclarations(root) {
  const declarations = [];
  for (const element of [root, ...root.querySelectorAll('[style]')]) {
    for (const declaration of (element.getAttribute('style') || '').split(';')) {
      const colon = declaration.indexOf(':');
      if (colon < 0) { continue; }
      const property = declaration.slice(0, colon).trim();
      if (!property.startsWith('--')) {
        declarations.push({ element, property, value: declaration.slice(colon + 1).trim() });
      }
    }
  }
  return declarations;
}

beforeEach(() => ATEStyles.resetTheme());

test('the transport is three <button type="button"> with stable classes and aria attributes', () => {
  const { document } = createPage();
  new ATEEngine('#ate');
  const { record, play, stop } = transport(document);

  for (const button of [record, play, stop]) {
    assert.equal(button.tagName, 'BUTTON');
    assert.equal(button.getAttribute('type'), 'button');
    assert.ok(button.classList.contains('ate-button'));
    assert.ok(!button.classList.contains('is-toggled'));
  }

  assert.equal(record.getAttribute('aria-label'), 'Record');
  assert.equal(play.getAttribute('aria-label'), 'Play');
  assert.equal(stop.getAttribute('aria-label'), 'Stop');
  assert.equal(record.getAttribute('aria-pressed'), 'false');
  assert.equal(play.getAttribute('aria-pressed'), 'false');
  assert.equal(stop.hasAttribute('aria-pressed'), false);
});

test('without icons the buttons show the default images, under externalResourcePath', () => {
  const { document } = createPage();
  new ATEEngine('#ate', { externalResourcePath: 'vendor/ate/' });
  const { record, play, stop } = transport(document);

  assert.equal(imageOf(record), 'vendor/ate/res/spRecord.png');
  assert.equal(imageOf(play), 'vendor/ate/res/spPlay.png');
  assert.equal(imageOf(stop), 'vendor/ate/res/spStop.png');
  assert.equal(play.querySelector('img').getAttribute('width'), '20');
});

test('extraParams without externalResourcePath keeps the default image paths', () => {
  const { document } = createPage();
  new ATEEngine('#ate', { theme: {} });

  assert.equal(imageOf(transport(document).play), 'res/spPlay.png');
});

test('a click toggles content, aria-pressed, aria-label and is-toggled; stop resets play', () => {
  const { document } = createPage();
  const engine = new ATEEngine('#ate');
  const { record, play, stop } = transport(document);

  play.click();
  assert.equal(imageOf(play), 'res/spPause.png');
  assert.equal(play.getAttribute('aria-pressed'), 'true');
  assert.equal(play.getAttribute('aria-label'), 'Pause');
  assert.ok(play.classList.contains('is-toggled'));
  assert.equal(engine.playbackController.isPlaying, true);

  record.click();
  assert.equal(imageOf(record), 'res/spStopRecording.png');
  assert.equal(record.getAttribute('aria-pressed'), 'true');
  assert.equal(record.getAttribute('aria-label'), 'Stop recording');

  stop.click();
  assert.equal(imageOf(play), 'res/spPlay.png');
  assert.equal(play.getAttribute('aria-pressed'), 'false');
  assert.equal(play.getAttribute('aria-label'), 'Play');
  assert.ok(!play.classList.contains('is-toggled'));
  assert.equal(engine.playbackController.isPlaying, false);
  assert.equal(imageOf(stop), 'res/spStop.png');

  record.click();
  assert.equal(imageOf(record), 'res/spRecord.png');
  assert.equal(record.getAttribute('aria-pressed'), 'false');

  play.click();
  engine.reset();
  assert.equal(imageOf(play), 'res/spPlay.png');
  assert.equal(play.getAttribute('aria-pressed'), 'false');
});

test('callbackCanClick still vetoes a click', () => {
  const { document } = createPage();
  const engine = new ATEEngine('#ate');
  let recorded = 0;
  engine.onRecordCallback = () => recorded++;
  engine.buttonRecord.callbackCanClick = () => false;

  transport(document).record.click();
  assert.equal(recorded, 0);
  assert.equal(engine.buttonRecord.isToggled, false);
  assert.equal(transport(document).record.getAttribute('aria-pressed'), 'false');

  engine.buttonRecord.callbackCanClick = () => true;
  transport(document).record.click();
  assert.equal(recorded, 1);
  assert.equal(transport(document).record.getAttribute('aria-pressed'), 'true');
});

test('icons markup replaces the images, per state; the states left out keep theirs', () => {
  const { document } = createPage();
  new ATEEngine('#ate', {
    icons: {
      play: '<i class="icon icon-play"></i>',
      pause: '<i class="icon icon-pause"></i>',
      stop: '<svg class="icon-stop"></svg>',
      record: '<i class="icon icon-record"></i>'
    }
  });
  const { record, play, stop } = transport(document);

  assert.ok(play.querySelector('i.icon-play'));
  assert.equal(play.querySelector('img'), null);
  assert.ok(stop.querySelector('svg.icon-stop'));

  play.click();
  assert.ok(play.querySelector('i.icon-pause'));
  assert.equal(play.querySelector('i.icon-play'), null);
  play.click();
  assert.ok(play.querySelector('i.icon-play'));

  // stopRecording was not given: the record button toggles to the default image and back to the markup
  assert.ok(record.querySelector('i.icon-record'));
  record.click();
  assert.equal(imageOf(record), 'res/spStopRecording.png');
  assert.equal(record.querySelector('i'), null);
  record.click();
  assert.ok(record.querySelector('i.icon-record'));
  assert.equal(record.querySelector('img'), null);
});

test('ATEHTMLButton.initialize stays compatible: a string starting with < is markup, anything else an image', () => {
  const { document } = createPage();

  const imageButton = new ATEHTMLButton(null);
  imageButton.initialize('res/spPlus.png', 'res/spPlus.png');
  const element = imageButton.buttonSelector;
  assert.ok(element.jquery, 'buttonSelector is still a jQuery element');
  assert.equal(element[0].tagName, 'BUTTON');
  assert.equal(element[0].className, 'ate-button');
  assert.equal(element.find('img').attr('src'), 'res/spPlus.png');
  assert.equal(element.attr('aria-pressed'), undefined, 'not a toggle unless asked');

  let clicks = 0;
  imageButton.callbackClick = (evt) => { clicks++; assert.ok(evt); };
  element[0].click();
  assert.equal(clicks, 1);
  assert.ok(!element.hasClass('is-toggled'));

  imageButton.addMargin();
  assert.equal(element[0].style.marginLeft, '4px');

  const mixed = new ATEHTMLButton(null);
  mixed.initialize('  <svg class="a"></svg>', 'b.png', { className: 'extra', label: 'A', toggledLabel: 'B', toggle: true });
  assert.ok(mixed.buttonSelector.hasClass('ate-button') && mixed.buttonSelector.hasClass('extra'));
  assert.ok(mixed.buttonSelector.find('svg.a').length === 1);
  mixed.buttonSelector[0].click();
  assert.equal(mixed.buttonSelector.find('img').attr('src'), 'b.png');
  assert.equal(mixed.buttonSelector.attr('aria-label'), 'B');
  mixed.reset();
  assert.ok(mixed.buttonSelector.find('svg.a').length === 1);
  assert.equal(mixed.buttonSelector.attr('aria-label'), 'A');
  assert.equal(mixed.buttonSelector.attr('aria-pressed'), 'false');

  assert.equal(ATEHTMLButton.isMarkup('<i></i>'), true);
  assert.equal(ATEHTMLButton.isMarkup('res/a.png'), false);

  // one neutral stylesheet, first in <head>, however many buttons there are
  const styles = document.querySelectorAll(`#${ATEHTMLButton.StyleElementId}`);
  assert.equal(styles.length, 1);
  assert.equal(document.head.firstChild, styles[0]);
  assert.match(styles[0].textContent, /^\.ate-button\{[^}]*padding:0;[^}]*border:0;[^}]*background:none;/);
  assert.doesNotMatch(styles[0].textContent, literalColour);
});

test('the root carries the theme as CSS variables, and the panel reads them', () => {
  const { document, root } = createPage();
  new ATEEngine('#ate');

  assert.ok(root.classList.contains('ate-root'));
  assert.equal(cssVar(root, '--ate-panel-bg'), '#4e4e4e');
  assert.equal(cssVar(root, '--ate-border'), '#6e6e6e');
  assert.equal(cssVar(root, '--ate-label'), 'white');
  assert.equal(cssVar(root, '--ate-layer-name'), '#f9f9f9');
  assert.equal(cssVar(root, '--ate-input'), 'rgb(184, 184, 184)');
  assert.equal(cssVar(root, '--ate-label-font-family'), '');
  assert.equal(cssVar(root, '--ate-label-font-size'), '');

  const panel = document.querySelector('.ate-panel');
  assert.equal(panel.style.backgroundColor, 'var(--ate-panel-bg)');
  assert.equal(document.querySelector('.ate-panel > hr.ate-separator').style.borderColor, 'var(--ate-border)');
  const labels = document.querySelectorAll('.ate-label');
  assert.equal(labels.length, 2);
  for (const label of labels) {
    assert.equal(label.style.color, 'var(--ate-label)');
    assert.equal(label.style.fontFamily, 'var(--ate-label-font-family)');
  }
  // 'Time:' keeps its 12px unless the theme gives a size; '/' inherits as it always has
  assert.equal(labels[0].style.fontSize, 'var(--ate-label-font-size, 12px)');
  assert.equal(labels[1].style.fontSize, 'var(--ate-label-font-size)');
  for (const input of document.querySelectorAll('.ate-time-input')) {
    assert.equal(input.style.color, 'var(--ate-input)');
    assert.equal(input.style.borderBottomColor, 'var(--ate-input)');
  }
});

test('ATEEngine#applyTheme updates the CSS variables at once, and resetTheme restores them', () => {
  const { document, root } = createPage();
  const engine = new ATEEngine('#ate');
  engine.addLayer('x', 0, 0);

  engine.applyTheme({ canvas: { background: '#15181e', stroke: '#2a303c' } });
  assert.equal(ATEStyles.backgroundColor, '#15181e');
  assert.equal(cssVar(root, '--ate-panel-bg'), '#15181e', 'the panel follows the canvas');
  assert.equal(cssVar(root, '--ate-border'), '#2a303c');

  engine.applyTheme({ panel: { background: '#1b1f27', label: '#9aa2b2', layerName: '#e6e9ef', input: '#e6e9ef',
    labelFontFamily: 'Inter, sans-serif', labelFontSize: '11px' } });
  assert.equal(cssVar(root, '--ate-panel-bg'), '#1b1f27');
  assert.equal(cssVar(root, '--ate-label'), '#9aa2b2');
  assert.equal(cssVar(root, '--ate-layer-name'), '#e6e9ef');
  assert.equal(cssVar(root, '--ate-input'), '#e6e9ef');
  assert.equal(cssVar(root, '--ate-label-font-family'), 'Inter, sans-serif');
  assert.equal(cssVar(root, '--ate-label-font-size'), '11px');

  // layer rows read the same variables
  const layerName = document.querySelector('.ate-layer-name');
  assert.equal(layerName.style.color, 'var(--ate-layer-name)');
  assert.equal(layerName.style.fontFamily, 'var(--ate-label-font-family, arial)');
  assert.equal(document.querySelector('[data-layer-name] hr.ate-separator').style.borderColor, 'var(--ate-border)');

  engine.resetTheme();
  assert.equal(ATEStyles.backgroundColor, '#4e4e4e');
  assert.equal(cssVar(root, '--ate-panel-bg'), '#4e4e4e');
  assert.equal(cssVar(root, '--ate-label'), 'white');
  assert.equal(cssVar(root, '--ate-label-font-family'), '');
  assert.equal(cssVar(root, '--ate-label-font-size'), '');
});

test('extraParams.theme is applied when the engine is built', () => {
  const { root } = createPage();
  new ATEEngine('#ate', { theme: { canvas: { background: '#f5f6f8' }, panel: { label: '#515969' } } });

  assert.equal(ATEStyles.backgroundColor, '#f5f6f8');
  assert.equal(cssVar(root, '--ate-panel-bg'), '#f5f6f8');
  assert.equal(cssVar(root, '--ate-label'), '#515969');
});

test('no literal colour is left inline in the generated markup', () => {
  const { root } = createPage();
  const engine = new ATEEngine('#ate');
  // Numeric and boolean layers; a colour layer paints its own value, which is data, not theme.
  engine.addLayer('x', 0, 0);
  engine.addLayer('visible', 0, true, 2);
  engine.update(0.016);
  transport(document).play.click();

  const declarations = inlineDeclarations(root);
  assert.ok(declarations.some((d) => d.value.includes('var(--ate-')), 'the markup reads the variables');
  for (const { element, property, value } of declarations) {
    assert.doesNotMatch(value, literalColour, `<${element.tagName.toLowerCase()}> ${property}: ${value}`);
  }

  // the literals live only in the root's variable definitions
  assert.match(root.getAttribute('style'), /--ate-panel-bg: ?#4e4e4e/);
});

test('destroy takes the class and the variables off the root', () => {
  const { root } = createPage();
  const engine = new ATEEngine('#ate');
  engine.destroy();

  assert.ok(!root.classList.contains('ate-root'));
  assert.equal(cssVar(root, '--ate-panel-bg'), '');
  assert.equal(root.children.length, 0);
});
