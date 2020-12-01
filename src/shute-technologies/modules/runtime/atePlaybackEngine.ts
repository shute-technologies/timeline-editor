import { ATELayer } from '../editor/ateLayer';
import { ATEUtils } from '../common/ateUtils';
import { ATEEnumTweenType } from './ateEnumTweenType';
import { ATEEnumDataType } from './ateEnumDataType';
import {
  ATEEasingFn,
  ATEIKeyframe,
  ATEIKeyframeNode,
  ATEIColor,
  ATEIKeyframeInAnimationResult,
  ATEIAnimationData,
  ATEDictionary
} from '../common/ateInterfaces';
import { Easing } from '../../../external-libs/easing/Easing';

export class ATEPlaybackEngine {

  // Configurable
  static DefaultTime = 60;

  //  Not configurable
  static readonly EPSILON = 0.001;

  private readonly _animationData: ATEIAnimationData;
  private _fps: number;
  private _animationSeconds: number;
  private _animationSecondsToPlay: number;

  private _playingSpeed: number;
  private _currentTime: number;
  private _isPlaying:  boolean;

  animations: ATEDictionary<number | ATEIColor | boolean>;

  get isPlaying(): boolean { return this._isPlaying; }
  get currentTime(): number { return this._currentTime; }
  get animationSeconds(): number { return this._animationSeconds; }
  get animationSecondsToPlay(): number { return this._animationSecondsToPlay; }
  get fps(): number { return this._fps; }

  constructor(animationData: ATEIAnimationData) {
    this._animationData = animationData;
    this._animationSeconds = animationData.animationSeconds;

    this._playingSpeed = 0;
    this._currentTime = 0;
    this._isPlaying = false;
    this.animations = {};

    this.configureFPS(animationData.fps);

    // Initialize Animations object reference
    for (let i = 0; i < this._animationData.layerCount; i++) {
      const layerObj = this._animationData.layers[i];

      const layerName = layerObj.name;
      const resultValue = ATEPlaybackEngine.byLayer(layerObj.data, this._currentTime, layerObj.dataType, layerObj.isInterpolable);

      this.animations[layerName] = resultValue;
    }
  }

  configureFPS(fps: number): void {
    this._fps = fps;

    const deltaTime = 1000.0 / fps;
    this._playingSpeed = (1 / ATE_PlaybackEngine.DefaultTime) / deltaTime;
  }

  play(): void {
    if (!this._isPlaying) {
      this._isPlaying = true;

      const lastKeyframe = ATEPlaybackEngine.getLastKeyframeInAnimation(this.animations as any); // TODO: Revisit this
      this._animationSecondsToPlay = lastKeyframe.time === 0 ? this._animationSeconds : lastKeyframe.time;
    }
  }

  stop(): void {
    if (this._isPlaying) {
      this._isPlaying = false;
      this._currentTime = 0;
    }
  }

  update(dt: number): void {
    if (this._isPlaying) {
      if (this._currentTime >= this._animationSecondsToPlay) {
        this._currentTime = 0;
      } else {
        this._currentTime += this._playingSpeed * dt;
        this._currentTime = this._currentTime < 0 ? 0 : this._currentTime;
        this._currentTime = this._currentTime > this._animationSecondsToPlay ? this._animationSecondsToPlay : this._currentTime;
      }

      for (const aniData of this._animationData.layers) {
        const layerName = aniData.name;
        const resultValue = ATEPlaybackEngine.byLayer(aniData.data, this._currentTime, aniData.dataType, aniData.isInterpolable);

        this.animations[layerName] = resultValue;
      }
    }
  }

  // tslint:disable-next-line: cyclomatic-complexity
  static byLayer(keyframesData: Array<ATEIKeyframe>, time: number, dataType: ATEEnumDataType,
    isInterpolable: boolean): number | boolean | ATEIColor {

    let resultValue: number | boolean | ATEIColor = null;
    const keyframe: ATEIKeyframe = ATEPlaybackEngine.getKeyframeByTime(keyframesData, time);
    const keyframes: ATEIKeyframeNode = ATEPlaybackEngine.getKeyframesBetween(keyframesData, time);

    if (!keyframes.noData) {
      const kfiValue = keyframes.KFi.value;
      resultValue = keyframe ? keyframe.value : kfiValue;

      if (keyframes.KFe) {
        const fkiTime = keyframes.KFi.time;
        const fkeTime = keyframes.KFe.time;
        const kfeValue = keyframes.KFe.value;

        // compute real time between frames for the tween
        const diffTime = fkeTime - fkiTime;
        const actualTime = 1.0 - (fkeTime - time) / diffTime;

        if (isInterpolable) {
          let easingChoosedFn: ATEEasingFn = null;

          switch (keyframes.KFi.tweenType) {
            case ATEEnumTweenType.EaseLinear:       easingChoosedFn = Easing.Equations.easeLinear; break;
            case ATEEnumTweenType.EaseInQuad:       easingChoosedFn = Easing.Equations.easeInQuad; break;
            case ATEEnumTweenType.EaseOutQuad:      easingChoosedFn = Easing.Equations.easeOutQuad; break;
            case ATEEnumTweenType.EaseInOutQuad:    easingChoosedFn = Easing.Equations.easeInOutQuad; break;
            case ATEEnumTweenType.EaseInCubic:      easingChoosedFn = Easing.Equations.easeInCubic; break;
            case ATEEnumTweenType.EaseOutCubic:     easingChoosedFn = Easing.Equations.easeOutCubic; break;
            case ATEEnumTweenType.EaseInOutCubic:   easingChoosedFn = Easing.Equations.easeInOutCubic; break;
            case ATEEnumTweenType.EaseInSine:       easingChoosedFn = Easing.Equations.easeInSine; break;
            case ATEEnumTweenType.EaseOutSine:      easingChoosedFn = Easing.Equations.easeOutSine; break;
            case ATEEnumTweenType.EaseInOutSine:    easingChoosedFn = Easing.Equations.easeInOutSine; break;
            case ATEEnumTweenType.EaseInExpo:       easingChoosedFn = Easing.Equations.easeInExpo; break;
            case ATEEnumTweenType.EaseOutExpo:      easingChoosedFn = Easing.Equations.easeOutExpo; break;
            case ATEEnumTweenType.EaseInOutExpo:    easingChoosedFn = Easing.Equations.easeInOutExpo; break;
            case ATEEnumTweenType.EaseInElastic:    easingChoosedFn = Easing.Equations.easeInElastic; break;
            case ATEEnumTweenType.EaseOutElastic:   easingChoosedFn = Easing.Equations.easeOutElastic; break;
            case ATEEnumTweenType.EaseInOutElastic: easingChoosedFn = Easing.Equations.easeInOutElastic; break;
          }

          if (easingChoosedFn) {
            switch (dataType) {
              case ATEEnumDataType.Numeric:
                resultValue = easingChoosedFn(actualTime, kfiValue as number, (kfeValue as number) - (kfiValue as number), 1);
                break;
              case ATEEnumDataType.Color:
                const kfiColorValue = kfiValue as ATEIColor;
                const kfeColorValue = kfiValue as ATEIColor;

                resultValue = ATEUtils.deepClone(resultValue) as ATEIColor;
                resultValue.r = easingChoosedFn(actualTime, kfiColorValue.r, kfeColorValue.r - kfiColorValue.r, 1);
                resultValue.g = easingChoosedFn(actualTime, kfiColorValue.g, kfeColorValue.g - kfiColorValue.g, 1);
                resultValue.b = easingChoosedFn(actualTime, kfiColorValue.b, kfeColorValue.b - kfiColorValue.b, 1);
                resultValue.a = easingChoosedFn(actualTime, kfiColorValue.a, kfeColorValue.a - kfiColorValue.a, 1);
                break;
            }
          }
        } else {
          switch (dataType) {
            case ATEEnumDataType.Boolean:
            case ATEEnumDataType.String:
              resultValue = Math.floor(actualTime) >= 1 ? kfeValue : kfiValue;
              break;
          }
        }
      }
    }

    return resultValue;
  }

  static getKeyframeByTime(keyframesData: Array<ATEIKeyframe>, time: number): ATEIKeyframe {
    let resultKeyframe: ATEIKeyframe = null;

    for (const keyframe of keyframesData) {
      if (keyframe && (keyframe.time >= (time - ATEPlaybackEngine.EPSILON) &&
        keyframe.time <= (time + ATEPlaybackEngine.EPSILON))) {

        resultKeyframe = keyframe;
        break;
      }
    }

    return resultKeyframe;
  }

  static getKeyframesBetween(keyframesData: Array<ATEIKeyframe>, time: number): ATEIKeyframeNode {
    const result = {
      KFi: null,
      KFe: null,
      noData: true,
      KFi_IsFirst: false,
      KFe_IsLast: false
    } as ATEIKeyframeNode;

    const size = keyframesData.length;

    if (size > 1) {
      for (let i = 0; i < size; i++) {
        const _kfI = keyframesData[i];
        const _kfE = keyframesData[i + 1];

        if (_kfI.time <= time) {
          if (_kfE && _kfE.time >= time) {
            result.KFi = _kfI;
            result.KFe = _kfE;
            result.noData = false;
            result.KFi_IsFirst = i === 0;
            result.KFe_IsLast = (i + 1) === (size - 1);
            break;
          } else if (_kfE === undefined) { // last
            result.KFe_IsLast = true;
            result.KFi = _kfI;
            result.noData = false;
          }
        }
      }
    } else if (size === 1) {
      result.KFi = keyframesData[0];
      result.noData = false;
      result.KFi_IsFirst = true;
    }

    return result;
  }

  static getLastKeyframeInAnimation(animationData: Array<ATELayer>): ATEIKeyframeInAnimationResult {
    const result = {
      layer: null,
      keyframe: null,
      time: 0,
    } as ATEIKeyframeInAnimationResult;

    for (const layer of animationData) {
      const layerKeyframes = layer.layerData;
      const lastKeyframe = layerKeyframes.length > 0 ? layerKeyframes[layerKeyframes.length - 1] : null;

      if (lastKeyframe && result.time < lastKeyframe.time) {
        result.layer = layer;
        result.keyframe = lastKeyframe;
        result.time = lastKeyframe.time;
      }
    }

    return result;
  }
}
