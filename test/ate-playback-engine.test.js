// Runs against the compiled output (npm test builds first), so it checks what gets published.
const test = require('node:test');
const assert = require('node:assert/strict');
const { ATEPlaybackEngine, ATEEnumDataType, ATEEnumTweenType } = require('../lib/index.js');

// One numeric layer, keyed 0 -> 10 over 2 seconds.
function makeEngine() {
  const engine = new ATEPlaybackEngine();
  engine.initialize({
    animationSeconds: 5,
    fps: 30,
    layerCount: 1,
    layers: [{
      name: 'x',
      dataType: ATEEnumDataType.Numeric,
      isInterpolable: true,
      extraParams: null,
      data: [
        { name: 'k0', time: 0, value: 0, tweenType: ATEEnumTweenType.EaseLinear, extraParams: null },
        { name: 'k1', time: 2, value: 10, tweenType: ATEEnumTweenType.EaseLinear, extraParams: null }
      ]
    }]
  });
  return engine;
}

// Starts playback without depending on play(): sets the state play() would set.
function startWithoutPlay(engine, secondsToPlay) {
  engine._isPlaying = true;
  engine._animationSecondsToPlay = secondsToPlay;
}

test('setting currentTime to 0 rewinds (GEEPlaybackEngine.reset relies on it)', () => {
  const engine = makeEngine();
  startWithoutPlay(engine, 2);
  engine.update(1.5);
  assert.equal(engine.currentTime, 1.5);

  engine.currentTime = 0;
  assert.equal(engine.currentTime, 0);
});

test('currentTime accepts any value inside the clip', () => {
  const engine = makeEngine();
  startWithoutPlay(engine, 2);

  engine.currentTime = 0.75;
  assert.equal(engine.currentTime, 0.75);
  engine.currentTime = 1.25;
  assert.equal(engine.currentTime, 1.25);
});

test('currentTime is clamped into [0, animationSecondsToPlay]', () => {
  const engine = makeEngine();
  startWithoutPlay(engine, 2);

  engine.currentTime = 7;
  assert.equal(engine.currentTime, 2);
  engine.currentTime = -3;
  assert.equal(engine.currentTime, 0);
  engine.currentTime = Number.NaN;
  assert.equal(engine.currentTime, 0);
});

test('pause(time) moves the playhead to time', () => {
  const engine = makeEngine();
  startWithoutPlay(engine, 2);
  engine.update(1.5);

  engine.pause(0.5);
  assert.equal(engine.isPlaying, false);
  assert.equal(engine.currentTime, 0.5);
});

test('play() does not throw and plays up to the last keyframe', () => {
  const engine = makeEngine();

  assert.doesNotThrow(() => engine.play());
  assert.equal(engine.isPlaying, true);
  assert.equal(engine.animationSecondsToPlay, 2);
});

test('play() falls back to animationSeconds when the only keyframe is at 0', () => {
  const engine = new ATEPlaybackEngine();
  engine.initialize({
    animationSeconds: 5, fps: 30, layerCount: 1,
    layers: [{ name: 'x', dataType: ATEEnumDataType.Numeric, isInterpolable: true, extraParams: null,
      data: [{ name: 'k0', time: 0, value: 3, tweenType: ATEEnumTweenType.EaseLinear, extraParams: null }] }]
  });

  engine.play();
  assert.equal(engine.animationSecondsToPlay, 5);
});

test('a played clip ends, calls onAnimationEnd once, and reset via currentTime = 0 replays it', () => {
  const engine = makeEngine();
  const ends = [];
  engine.onAnimationEnd = (playbackObject) => ends.push(playbackObject);

  engine.play();
  engine.update(1);
  assert.equal(engine.animations.x.value, 5);
  engine.update(1);
  assert.equal(engine.currentTime, 2);
  engine.update(0.1);
  assert.deepEqual(ends, [engine]);

  engine.currentTime = 0;
  engine.update(0.5);
  assert.equal(engine.currentTime, 0.5);
});
