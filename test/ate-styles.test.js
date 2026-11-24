// ATEStyles.applyTheme / resetTheme / cssVariables, on the compiled output. No DOM needed.
const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { ATEStyles, ATEDefaultTheme } = require('../lib/index.js');

beforeEach(() => ATEStyles.resetTheme());

test('the defaults are the colours and fonts 0.13 drew with', () => {
  assert.equal(ATEStyles.backgroundColor, '#4e4e4e');
  assert.equal(ATEStyles.cStroke_Color, '#6e6e6e');
  assert.equal(ATEStyles.font_Color, '#f9f9f9');
  assert.equal(ATEStyles.ac_TimelineSubSegment_Color, '#f9f9f9');
  assert.equal(ATEStyles.ac_TimelineSubSegment_TextStyle, 'bold 9px Arial');
  assert.equal(ATEStyles.tweenColor, '#0000FF55');
  assert.equal(ATEStyles.playback.gui_BackgroundColor, 'red');
  assert.equal(ATEStyles.playback.gui_LineColor, '#FF000066');
  assert.equal(ATEStyles.playback.gui_TextColor, 'white');
  assert.equal(ATEStyles.playback.gui_TextStyle, 'bold 12px Arial');

  assert.deepEqual(ATEStyles.cssVariables(), {
    '--ate-panel-bg': '#4e4e4e',
    '--ate-border': '#6e6e6e',
    '--ate-label': 'white',
    '--ate-label-font-family': null,
    '--ate-label-font-size': null,
    '--ate-layer-name': '#f9f9f9',
    '--ate-input': 'rgb(184, 184, 184)'
  });
});

test('ATEDefaultTheme is frozen at every level', () => {
  assert.ok(Object.isFrozen(ATEDefaultTheme));
  assert.ok(Object.isFrozen(ATEDefaultTheme.canvas));
  assert.ok(Object.isFrozen(ATEDefaultTheme.canvas.playhead));
  assert.ok(Object.isFrozen(ATEDefaultTheme.panel));
});

test('applyTheme deep-merges: the fields a theme leaves out keep their value', () => {
  ATEStyles.applyTheme({ canvas: { background: '#15181e', playhead: { line: '#5b8cff' } } });

  assert.equal(ATEStyles.backgroundColor, '#15181e');
  assert.equal(ATEStyles.playback.gui_LineColor, '#5b8cff');
  // untouched
  assert.equal(ATEStyles.cStroke_Color, '#6e6e6e');
  assert.equal(ATEStyles.playback.gui_BackgroundColor, 'red');
  assert.equal(ATEStyles.playback.gui_TextStyle, 'bold 12px Arial');

  // a second theme merges onto the first
  ATEStyles.applyTheme({ canvas: { stroke: '#2a303c' } });
  assert.equal(ATEStyles.backgroundColor, '#15181e');
  assert.equal(ATEStyles.cStroke_Color, '#2a303c');
});

test('applyTheme maps every canvas field onto ATEStyles', () => {
  ATEStyles.applyTheme({
    canvas: {
      background: 'c1', stroke: 'c2', text: 'c3', textFont: 'f1', ticks: 'c4', tween: 'c5',
      playhead: { background: 'c6', line: 'c7', text: 'c8', textFont: 'f2' }
    }
  });

  assert.equal(ATEStyles.backgroundColor, 'c1');
  assert.equal(ATEStyles.cStroke_Color, 'c2');
  assert.equal(ATEStyles.font_Color, 'c3');
  assert.equal(ATEStyles.ac_TimelineSubSegment_TextStyle, 'f1');
  assert.equal(ATEStyles.ac_TimelineSubSegment_Color, 'c4');
  assert.equal(ATEStyles.tweenColor, 'c5');
  assert.equal(ATEStyles.playback.gui_BackgroundColor, 'c6');
  assert.equal(ATEStyles.playback.gui_LineColor, 'c7');
  assert.equal(ATEStyles.playback.gui_TextColor, 'c8');
  assert.equal(ATEStyles.playback.gui_TextStyle, 'f2');
});

test('applyTheme writes only theme fields: geometry and unknown keys are ignored', () => {
  ATEStyles.applyTheme({ canvas: { gui_Width: 999, playhead: { gui_Width: 999 } }, ac_Width: 1, panel: { width: '1px' } });

  assert.equal(ATEStyles.ac_Width, 200);
  assert.equal(ATEStyles.playback.gui_Width, 52);
  assert.equal(ATEStyles.panel.width, undefined);
  assert.doesNotThrow(() => ATEStyles.applyTheme(undefined));
  assert.doesNotThrow(() => ATEStyles.applyTheme({}));
  assert.equal(ATEStyles.backgroundColor, '#4e4e4e');
});

test('the panel follows the canvas until it is given its own colours', () => {
  ATEStyles.applyTheme({ canvas: { background: '#15181e', stroke: '#2a303c', ticks: '#3a4252' } });
  let vars = ATEStyles.cssVariables();
  assert.equal(vars['--ate-panel-bg'], '#15181e');
  assert.equal(vars['--ate-border'], '#2a303c');
  assert.equal(vars['--ate-layer-name'], '#3a4252');

  ATEStyles.applyTheme({
    panel: { background: '#1b1f27', border: '#3a4252', label: '#9aa2b2', layerName: '#e6e9ef', input: '#e6e9ef',
      labelFontFamily: 'Inter, sans-serif', labelFontSize: '11px' }
  });
  vars = ATEStyles.cssVariables();
  assert.deepEqual(vars, {
    '--ate-panel-bg': '#1b1f27',
    '--ate-border': '#3a4252',
    '--ate-label': '#9aa2b2',
    '--ate-label-font-family': 'Inter, sans-serif',
    '--ate-label-font-size': '11px',
    '--ate-layer-name': '#e6e9ef',
    '--ate-input': '#e6e9ef'
  });

  // null hands a panel field back to its fallback; it is ignored where there is none (label, input)
  ATEStyles.applyTheme({ panel: { background: null, labelFontFamily: null, label: null, input: null } });
  vars = ATEStyles.cssVariables();
  assert.equal(vars['--ate-panel-bg'], '#15181e');
  assert.equal(vars['--ate-label-font-family'], null);
  assert.equal(vars['--ate-label'], '#9aa2b2');
  assert.equal(vars['--ate-input'], '#e6e9ef');
});

test('resetTheme restores every theme field', () => {
  ATEStyles.applyTheme({
    canvas: { background: 'a', stroke: 'b', text: 'c', textFont: 'd', ticks: 'e', tween: 'f',
      playhead: { background: 'g', line: 'h', text: 'i', textFont: 'j' } },
    panel: { background: 'k', border: 'l', label: 'm', labelFontFamily: 'n', labelFontSize: 'o', layerName: 'p', input: 'q' }
  });

  ATEStyles.resetTheme();

  assert.equal(ATEStyles.backgroundColor, ATEDefaultTheme.canvas.background);
  assert.equal(ATEStyles.cStroke_Color, ATEDefaultTheme.canvas.stroke);
  assert.equal(ATEStyles.font_Color, ATEDefaultTheme.canvas.text);
  assert.equal(ATEStyles.ac_TimelineSubSegment_TextStyle, ATEDefaultTheme.canvas.textFont);
  assert.equal(ATEStyles.ac_TimelineSubSegment_Color, ATEDefaultTheme.canvas.ticks);
  assert.equal(ATEStyles.tweenColor, ATEDefaultTheme.canvas.tween);
  assert.deepEqual(
    [ATEStyles.playback.gui_BackgroundColor, ATEStyles.playback.gui_LineColor, ATEStyles.playback.gui_TextColor, ATEStyles.playback.gui_TextStyle],
    ['red', '#FF000066', 'white', 'bold 12px Arial']
  );
  assert.deepEqual({ ...ATEStyles.panel }, { ...ATEDefaultTheme.panel });
});
