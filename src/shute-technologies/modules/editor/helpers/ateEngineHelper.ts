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
        debugger;
        (result as any)['keyframeOnFocus'] = keyframe;
        break;
      }
    }

    return result;
  }

  static getSegment(ate: ATEEngine, mouseX: number, mouseY: number): number {
    const animationSeconds = ate.animationSeconds;
    const segmentWidth = ate.gui_RealSegmentWidth;
    const subSegmentWidth = ate.gui_RealSubSegmentWidth;
    const x = (ATEStyles.timeline.offsetX + (0 * segmentWidth)) -
      subSegmentWidth - (ATEStyles.playback.gui_Width / 4) + 1;
    const xCenter = x + (ATEStyles.playback.gui_Width * 0.5) + 1;
    const offset = subSegmentWidth / 2.0;
    const realPositionX = (mouseX + offset) - xCenter;
    const segmentsBySeconds = animationSeconds * ATEStyles.default_SubSegments;
    let inSegment = Math.floor((realPositionX) / subSegmentWidth);
    inSegment = inSegment < 0 ? 0 : inSegment;
    inSegment = inSegment > segmentsBySeconds ? segmentsBySeconds : inSegment;
    return inSegment;
  }

  static setStylesInputTime(selector: JQuery<HTMLElement>, isDisabled?: boolean): void {
    selector.css('text-align', 'center');
    selector.css('font-size', '12px');
    selector.css('padding', '1px');
    selector.css('width', '36px');
    selector.css('margin', '5px 0px 0px');
    selector.css('outline', 'none');
    selector.css('border-width', '0px 0px 1px');
    selector.css('border-top-style', 'initial');
    selector.css('border-right-style', 'initial');
    selector.css('border-bottom-style', 'dotted');
    selector.css('border-left-style', 'initial');
    selector.css('border-top-color', 'initial');
    selector.css('border-right-color', 'initial');
    selector.css('border-bottom-color', 'rgb(184, 184, 184)');
    selector.css('border-left-color', 'initial');
    selector.css('border-image', 'initial');
    selector.css('background', 'none');
    selector.css('color', 'rgb(184, 184, 184)');

    if (!!isDisabled) {
      selector.attr('disabled', isDisabled ? 'true' : 'false');
    }
  }
}
