import { ATERenderLoop } from './src/shute-technologies/modules/common/ateRenderLoop';
import { ATEEngine } from './src/shute-technologies/modules/editor/ateEngine';
import { ATEEnumDataType } from './src/shute-technologies/modules/runtime/ateEnumDataType';

(function main() {
  const frameRate = 30;

  const timeline = new ATEEngine('#animation-timeline-editor');
  timeline.addLayer('x', 0, 0);
  timeline.addLayer('x', 0.3, 65);
  timeline.addLayer('x', 0.5, 100);
  timeline.addLayer('x', 0.7, 180);
  timeline.addLayer('x', 0.8, 205);
  timeline.addLayer('x', 2, 230);

  timeline.addLayer('y', 0.3, 240);
  timeline.addLayer('y', 1, 400);
  timeline.addLayer('y', 1.5, 700);

  timeline.addLayer('FlipX', 0, true, ATEEnumDataType.Boolean);
  timeline.addLayer('FlipX', 1, false, ATEEnumDataType.Boolean);

  timeline.addLayer('Color', 0, { r: 1, g: 0, b: 0, a: 1}, ATEEnumDataType.Color);
  timeline.addLayer('Color', 1, { r: 0, g: 0.5, b: 0, a: 1}, ATEEnumDataType.Color);
  timeline.addLayer('Color', 2, { r: 0.2, g: 0, b: 0.6, a: 1}, ATEEnumDataType.Color);

  // invalidate render
  timeline.invalidateLayers();

  ATERenderLoop.create((deltaTime) => timeline.update(deltaTime), frameRate);
})();
