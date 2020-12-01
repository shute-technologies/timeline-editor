import { ATEStyles } from '../../config/ateStyles';
import { ATEIAnimationData, ATEILayerByPositionResult, ATEIKeyframeByPositionResult } from '../../common/ateInterfaces';
import { ATEEngine } from '../ateEngine';
import { ATEUtils } from '../../common/ateUtils';

export class ATEEngineHelper {

  private constructor() {}

  static defaultAnimationData(): ATEIAnimationData {
    return {
      animationSeconds: ATEStyles.default_Seconds,
      fps: ATEStyles.playback.defaultTime,
      layers: [],
      layerCount: 0
    } as ATEIAnimationData;
  }

  static getLayerByPosition(ate: ATEEngine, x: number, y: number): ATEILayerByPositionResult {
    const layers = ate.layers;
    const result = {} as ATEILayerByPositionResult;
    result.layerIndex = -1;
    result.layerOnFocus = null;

    const offsetX = ATEStyles.timeline.offsetX;
    const offsetY = ATEStyles.ac_TimelineHeight + ATEStyles.timeline.offsetY;
    const layerHeight = ATEStyles.ac_TimelineLayerHeight;
    const layerSizeX = ate.gui_RealSegmentWidth * ate.animationSeconds;
    const layerSizeY = layerHeight;

    for (let i = 0; i < layers.length; i++) {
      const layerX = offsetX;
      const layerY = (i * layerHeight) + offsetY;

      if (ATEUtils.hitTestByPoint(layerX, layerY, layerSizeX, layerSizeY, x, y)) {
        result.layerIndex = i;
        result.layerOnFocus = layers[i];
        break;
      }
    }

    return result;
  }

  static getKeyframeByPosition(ate: ATEEngine, x: number, y: number): ATEIKeyframeByPositionResult {
    const result = {} as ATEIKeyframeByPositionResult;
    result.layerOnFocus = null;
    result.keyframeOnFocus = null;

    for (const layer of ate.layers) {
      const keyframe = layer.getKeyframeByPosition(x, y);

      if (keyframe) {
        result.layerOnFocus = layer;
        result.keyframeOnFocus = keyframe;
        break;
      }
    }

    return result;
  }
}
