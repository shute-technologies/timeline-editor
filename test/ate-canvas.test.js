// The canvas draws with the theme: a recording 2D context notes the fill / stroke / font of every draw call.
const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { createPage } = require('./helpers/dom');
const { ATEEngine, ATEStyles, ATEEnumTweenType } = require('../lib/index.js');

const graphiteDark = {
  canvas: {
    background: '#15181e',
    stroke: '#2a303c',
    text: '#9aa2b2',
    textFont: '600 10px Inter',
    ticks: '#3a4252',
    tween: '#5b8cff33',
    playhead: { background: '#5b8cff', line: '#5b8cfe', text: '#0b0d12', textFont: '600 11px Inter' }
  }
};

// An engine with one layer whose two keyframes are joined by a tween, drawn for one frame.
function drawFrame(theme) {
  const page = createPage();
  const engine = new ATEEngine('#ate');
  const first = engine.addLayer('x', 0, 0);
  engine.addLayer('x', 1, 10);
  first.keyframe.tweenType = ATEEnumTweenType.EaseLinear;

  if (theme) { engine.applyTheme(theme); }
  page.ctx.calls = [];
  engine.update(0.016);
  return page.ctx;
}

const playheadBox = (call) => call.op === 'fillRect' && call.args[2] === ATEStyles.playback.gui_Width
  && call.args[3] === ATEStyles.playback.gui_Height;

beforeEach(() => ATEStyles.resetTheme());

test('by default the canvas draws with the 0.13 colours and fonts', () => {
  const ctx = drawFrame();

  assert.equal(ctx.calls[0].op, 'fillRect');
  assert.equal(ctx.calls[0].fillStyle, '#4e4e4e');

  const box = ctx.calls.find(playheadBox);
  assert.equal(box.fillStyle, 'red');

  const playheadText = ctx.calls.find((c) => c.op === 'fillText' && c.font === 'bold 12px Arial');
  assert.equal(playheadText.fillStyle, 'white');

  const timeLabel = ctx.calls.find((c) => c.op === 'fillText' && c.font === 'bold 9px Arial');
  assert.equal(timeLabel.fillStyle, '#f9f9f9');

  assert.deepEqual([...ctx.paintedColours()].sort(), ['#0000FF55', '#4e4e4e', '#6e6e6e', '#FF000066', '#f9f9f9', 'red', 'white'].sort());
});

test('the canvas draws every element with the theme', () => {
  const ctx = drawFrame(graphiteDark);
  const t = graphiteDark.canvas;

  // background
  assert.equal(ctx.calls[0].op, 'fillRect');
  assert.equal(ctx.calls[0].fillStyle, t.background);

  // playhead: box, line, current time
  assert.equal(ctx.calls.find(playheadBox).fillStyle, t.playhead.background);
  const playheadText = ctx.calls.find((c) => c.op === 'fillText' && c.font === t.playhead.textFont);
  assert.ok(playheadText, 'the current time is drawn in the playhead font');
  assert.equal(playheadText.fillStyle, t.playhead.text);
  assert.ok(ctx.calls.some((c) => c.op === 'stroke' && c.strokeStyle === t.playhead.line), 'playhead line');

  // ruler: ticks, grid and time labels
  assert.ok(ctx.calls.some((c) => c.op === 'stroke' && c.strokeStyle === t.ticks), 'ticks');
  assert.ok(ctx.calls.some((c) => c.op === 'stroke' && c.strokeStyle === t.stroke), 'grid and layer lines');
  const timeLabels = ctx.calls.filter((c) => c.op === 'fillText' && c.font === t.textFont);
  assert.ok(timeLabels.length > 0, 'time labels are drawn in the text font');
  assert.ok(timeLabels.every((c) => c.fillStyle === t.text));

  // the band between the tweened keyframes
  assert.ok(ctx.calls.some((c) => c.op === 'fillRect' && c.fillStyle === t.tween), 'tween band');

  // and nothing is painted in a colour the theme did not give
  const themeColours = new Set([t.background, t.stroke, t.text, t.ticks, t.tween, t.playhead.background, t.playhead.line, t.playhead.text]);
  for (const colour of ctx.paintedColours()) {
    assert.ok(themeColours.has(colour), `painted with ${colour}, which is not in the theme`);
  }
});

test('a theme change shows on the next frame', () => {
  const page = createPage();
  const engine = new ATEEngine('#ate');

  engine.update(0.016);
  assert.equal(page.ctx.calls[0].fillStyle, '#4e4e4e');

  ATEStyles.applyTheme({ canvas: { background: '#f5f6f8' } });
  page.ctx.calls = [];
  engine.update(0.016);
  assert.equal(page.ctx.calls[0].fillStyle, '#f5f6f8');
});
