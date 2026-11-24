import { ATEEnumTweenType } from '../runtime/ateEnumTweenType';
import { ATELayer } from '../editor/ateLayer';
import { ATEEnumDataType } from '../runtime/ateEnumDataType';
import { ATEITheme } from '../config/ateTheme';

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

/**
 * What the transport buttons show in each state, in place of the default images. A value starting with
 * '<' is markup, inserted as HTML (e.g. `<i class='icon icon-play'></i>`); anything else is an image URL,
 * used as given. A state left out keeps its image.
 */
export interface ATEITransportIcons {
  record?: string;
  stopRecording?: string;
  play?: string;
  pause?: string;
  stop?: string;
}

export interface ATEIHTMLButtonOptions {
  /** Extra classes for the button, besides 'ate-button'. */
  className?: string;
  /** The button's aria-label. */
  label?: string;
  /** The aria-label while toggled. Defaults to label. */
  toggledLabel?: string;
  /** A toggle button: it gets aria-pressed and, while toggled, the 'is-toggled' class. */
  toggle?: boolean;
}

export interface ATEExtraParams {
  externalResourcePath?: string;
  /** Applied with ATEStyles.applyTheme when the engine is built. */
  theme?: ATEITheme;
  /** Markup or image URLs for the transport buttons. */
  icons?: ATEITransportIcons;
}
