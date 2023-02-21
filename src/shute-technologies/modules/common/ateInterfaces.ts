import { ATEEnumTweenType } from '../runtime/ateEnumTweenType';
import { ATELayer } from '../editor/ateLayer';
import { ATEEnumDataType } from '../runtime/ateEnumDataType';

export type SimpleCallback = () => void;
export type FnCallback<T> = () => T;
export type SimpleGCallback<T> = (args?: T) => void;
export type ATEEasingFn = (actualTime: number, a: number, b: number, maxTime: number) => number;
export interface ATEDictionary<T> {
  [Key: string]: T;
}

export interface ATEIColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface ATEIKeyframe {
  name: string;
  time: number;
  value: ATEIColor | number | boolean | string;
  tweenType: ATEEnumTweenType;
  extraParams;
}

export interface ATEVector2 {
  x: number;
  y: number;
}

export interface ATEIAnimationData {
  animationSeconds: number;
  fps: number;
  layers: Array<ATEAnimationDataLayer>;
  layerCount: number;
}

export interface ATEAnimationDataLayer {
  data: Array<ATEIKeyframe>;
  name: string;
  dataType: ATEEnumDataType;
  isInterpolable: boolean;
  extraParams;
} 

export interface ATEILayerByPositionResult {
  layerIndex: number;
  layerOnFocus: ATELayer;
}

export interface ATEIKeyframeByPositionResult {
  layerOnFocus: ATELayer;
  keyframeOnFocus: ATELayer;
}

export interface ATEIKeyframeInAnimationResult {
  layer: ATELayer;
  keyframe: ATEIKeyframe;
  time: number;
}

export interface ATEIKeyframeNode {
  KFi: ATEIKeyframe;
  KFe: ATEIKeyframe;
  noData: boolean;
  KFi_IsFirst: boolean;
  KFe_IsLast: boolean;
}

export interface ATEIKeyframeRenderData {
  x: number;
  y: number;
  width: number;
  height: number;
  img: HTMLImageElement;
  keyframe: ATEIKeyframe;
}

export interface ATEIGetLayerResult {
  exists: boolean;
  layer: ATELayer;
}

export interface ATEIAddLayerResult {
  layer: ATELayer;
  keyframe;
}

export interface ATEIPlaybackEngineByLayerResult {
  value: string | number | boolean | ATEIColor;
  extraParams: unknown;
}

export interface ATEExtraParams {
  externalResourcePath?: string;
}
