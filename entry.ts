import { ATERenderLoop } from './src/shute-technologies/modules/common/ateRenderLoop';

(function main() {
  const frameRate = 30;

  ATERenderLoop.create((deltaTime) => {/* CODE */}, frameRate);
})();
