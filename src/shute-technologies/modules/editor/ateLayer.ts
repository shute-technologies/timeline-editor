import { ATEEngine } from './ateEngine';
import { ATEResources } from '../config/ateResources';
import { ATEIKeyframe, ATEIColor, ATEIKeyframeRenderData } from '../common/ateInterfaces';
import { ATEStyles } from '../config/ateStyles';
import { ATEEnumDataType } from '../runtime/ateEnumDataType';
import { ATEEnumTweenType } from '../runtime/ateEnumTweenType';
import { ATELayerHelper } from './helpers/ateLayerHelper';
import { ATEPlaybackEngine } from '../runtime/atePlaybackEngine';
import { ATEUtils } from '../common/ateUtils';
import { ATEEnumLayerEditControls } from './ateEnumLayerEditControls';

export class ATELayer {

  private readonly _diamondImage: HTMLElement;
  private readonly _diamondSelectedImage: HTMLElement;

  private _ctx: CanvasRenderingContext2D;
  private _layerName: string;
  private _layerValue;
  private _layerDataType: ATEEnumDataType;
  private _layerIsInterpolable: boolean;
  private _extraLayerParams;
  private _currentIndex: number;
  private _keyframes: Array<ATEIKeyframe>;

  // internal
  private _diamondRealWidth: number;
  private _diamondRealHeight: number;
  private _offsetXImg: number;
  private _offsetYImg: number;
  private _layerSelector: JQuery<HTMLElement>;
  private _layerNameSelector: JQuery<HTMLElement>;
  private _layerValueSelector: JQuery<HTMLElement>;
  private _selectOptionSelector: JQuery<HTMLElement>;
  private _buttonKeyframeAddSelector: JQuery<HTMLElement>;

  // [Only-Internal]
  __LayerName: string;
  __LayerValue;
  __ExtraLayerParams;

  get layerName(): string { return this._layerName; }
  get layerValue() { return this._layerValue; }
  get layerDataType(): ATEEnumDataType { return this._layerDataType; }
  get layerIsInterpolable(): boolean { return this._layerIsInterpolable; }
  get layerData(): Array<ATEIKeyframe> { return this._keyframes; }

  get extraLayerParams() { return this._extraLayerParams; }
  set extraLayerParams(val) {
    if (val) {
      if (val !== ATEEngine.IgnoreExtraParams) {
        this._extraLayerParams = val;
        this.__ExtraLayerParams = val;
      }
    } else {
      this._extraLayerParams = val;
    }
  }

  constructor (private readonly _ate: ATEEngine) {
    this._ctx = _ate.ctx;
    this._diamondImage = $(`#${ATEResources.diamond.id}`)[0];
    this._diamondSelectedImage = $(`#${ATEResources.diamondSelected.id}`)[0];
    this._keyframes = [];

    // internal
    this._diamondRealWidth = ATEResources.diamond.timelineWidth;
    this._diamondRealHeight = ATEResources.diamond.timelineHeight;
    this._offsetXImg = -this._diamondRealWidth * 0.5;
    this._offsetYImg = (ATEStyles.ac_TimelineLayerHeight * 0.5) + (-this._diamondRealWidth * 0.5);

    // [Only-Internal]
    this.__LayerName = '';
    this.__LayerValue = null;
    this.__ExtraLayerParams = null;
  }

  initialize(name: string, dataType: ATEEnumDataType, isInterpolable?: boolean): void {
    this._layerName = name;
    this.__LayerName = name;
    this._layerDataType = dataType;

    if (isInterpolable) {
      switch (this._layerDataType) {
        case ATEEnumDataType.Numeric:
        case ATEEnumDataType.Color:
          this._layerIsInterpolable = true;
          break;
        default:
          this._layerIsInterpolable = false;
          break;
      }
    } else {
      this._layerIsInterpolable = isInterpolable;
    }

    const parentSelector = this._ate.layersUI_Selector;
    this._layerSelector = $(`<div data-layer-name='${name}'></div>`);
    this._layerSelector.css('height', ATEStyles.ac_TimelineLayerHeight);

    const dataParentSelector = $('<div></div>');
    dataParentSelector.css('height', ATEStyles.ac_TimelineLayerHeight);

    this._layerNameSelector = $(`<div style='float:left;'>${this._layerName}</div>`);

    const parentControls = $(`<div style='float:right;padding-top: 5px;'></div>`);

    switch (this._layerDataType) {
      case ATEEnumDataType.Numeric:
      case ATEEnumDataType.String:
          this._layerValueSelector = $(`<input type='text'></input>`);
        break;
      case ATEEnumDataType.Color:
        this._layerValueSelector = $(`<input type='button'></input>`);
        break;
      case ATEEnumDataType.Boolean:
        this._layerValueSelector = $(`<input type='checkbox'></input>`);
        break;
    }

    this._selectOptionSelector = ATELayerHelper.createTweenSelect();
    this._buttonKeyframeAddSelector = ATELayerHelper.createKeyframeAddButton();

    // add controls to the parent controls div
    parentControls.append(this._selectOptionSelector);
    parentControls.append(this._buttonKeyframeAddSelector);
    parentControls.append(this._layerValueSelector);

    // set CSS for Labels
    ATE_Layer.SetLabelCSS_LayerName(this._layerNameSelector);
    ATE_Layer.SetLabelCSS_LayerValue(this._layerValueSelector, this._layerDataType);

    dataParentSelector.append(this._layerNameSelector);
    dataParentSelector.append(parentControls);

    this._layerSelector.append(dataParentSelector);
    this._layerSelector.append(ATELayerHelper.createHR());
    parentSelector.append(this._layerSelector);
  }

  reconstructFrom(data: Array<ATEIKeyframe>) {
    this._keyframes = data;
  }

  onPlayOrPause(isPlaying: boolean) {
    if (isPlaying) {
      // remove listeners
      this._layerValueSelector.off();
      this._selectOptionSelector.off();
      this._buttonKeyframeAddSelector.off();

      this._layerValueSelector.css('display', 'block');
      this._layerValueSelector.attr('disabled', 'true');
      this._selectOptionSelector.css('display', 'none');
      this._buttonKeyframeAddSelector.css('display', 'none');
    }
  }

  onStop(): void {
    // force to set GUI
    this.invalidate();
  }

  invalidate(): void {
    this.updateFromPlayback(this._ate.playbackController.currentTime, 33, true);
  }

  onMouseClick_Keyframe(keyframe: ATEIKeyframe): void {
    if (!this._ate.playbackController.isPlaying) {
        // Set the value of the keyframe to the HTML
      switch (this._layerDataType) {
        case ATEEnumDataType.Numeric:
          this._layerValueSelector.val((keyframe.value as number).toFixed(3));
          break;
        case ATEEnumDataType.Color:
          // TODO: Revisit this
          const colorValue = keyframe.value as ATEIColor;
          const cR = colorValue.r * 255.0;
          const cG = colorValue.g * 255.0;
          const cB = colorValue.b * 255.0;
          const cA = colorValue.a;

          this._layerValueSelector.attr('disabled', 'true');
          this._layerValueSelector.css('background-color', `rgba(${cR},${cG},${cB },${cA })`);
          break;
        case ATEEnumDataType.Boolean:
          this._layerValueSelector.prop('checked', this._layerValue);
          break;
        case ATEEnumDataType.String:
          this._layerValueSelector.val(this._layerValue);
          break;
      }
    }
  }

  setKeyframe (time: number, value, extraParams): ATEIKeyframe {
    let resultKeyframe = this.getKeyframeByTime(time);

    if (resultKeyframe) {
      resultKeyframe.value = value;

      if (extraParams) {
          if (extraParams !== ATE_Engine.IgnoreExtraParams) {
              resultKeyframe.extraParams = extraParams;
          }
      } else {
        resultKeyframe.extraParams = extraParams;
      }
    } else {
      let extraParamsValue = null;

      if (extraParams) {
        if (extraParams !== ATE_Engine.IgnoreExtraParams) {
          extraParamsValue = extraParams;
        }
      }

      resultKeyframe = {
        name: this._layerName,
        time,
        value,
        tweenType: ATEEnumTweenType.None,
        extraParams: extraParamsValue
      } as ATEIKeyframe;

      this._keyframes.push(resultKeyframe);
      this._keyframes.sort((a, b) => a.time - b.time);
    }

    // change
    if (this._ate.onChangeCallback) { this._ate.onChangeCallback(); }

    return resultKeyframe;
  }

  removeKeyframe(time: number): void {
    for (let i = 0; i < this._keyframes.length; i++) {
      const keyframe = this._keyframes[i];

      if (keyframe && keyframe.time === time) {
        this._keyframes.splice(i, 1);
        break;
      }
    }

    this._keyframes.sort((a, b) => a.time - b.time);

    // change
    if (this._ate.onChangeCallback) { this._ate.onChangeCallback(); }
  }

  removeKeyframesBetween(from: number, to: number): void {
    for (let i = 0; i < this._keyframes.length; i++) {
      const keyframe = this._keyframes[i];

      if (keyframe && (keyframe.time >= from && keyframe.time <= to)) {
        this._keyframes.splice(i, 1);
        i--;
      }
    }
  }

  getKeyframeByTime(time: number): ATEIKeyframe {
    return ATEPlaybackEngine.getKeyframeByTime(this._keyframes, time);
  }

  getKeyframeByPosition(x: number, y: number): ATEIKeyframe {
    let resultKeyframe = null;
    const layerHeight = ATEStyles.ac_TimelineLayerHeight;
    const segmentWidth = this._ate.gui_RealSegmentWidth;
    const offsetXImage = 0;
    const offsetYImage = (layerHeight * 0.5) + offsetXImage;

    for (const keyframe of this._keyframes) {
      if (keyframe) {
        const keyframeX = (keyframe.time * segmentWidth) + offsetXImage + ATEStyles.timeline.offsetX;
        const keyframeY = (this._currentIndex * layerHeight) + ATEStyles.ac_TimelineHeight + offsetYImage + ATEStyles.timeline.offsetY;
        const wasHitted = ATEUtils.hitTestCenterByPoint(keyframeX, keyframeY, this._diamondRealWidth, this._diamondRealHeight, x, y);

        if (wasHitted) {
          resultKeyframe = keyframe;
          break;
        }
      }
    }

    return resultKeyframe;
  }

  getKeyFrameRenderData(keyframe: ATEIKeyframe): ATEIKeyframeRenderData {
    const layerHeight = ATEStyles.ac_TimelineLayerHeight;
    const segmentWidth = this._ate.gui_RealSegmentWidth;

    const x = (keyframe.time * segmentWidth) + this._offsetXImg + ATEStyles.timeline.offsetX;
    const y = (this._currentIndex * layerHeight) + ATEStyles.ac_TimelineHeight +
      this._offsetYImg + ATEStyles.timeline.offsetY;

    return {
      x,
      y,
      width: this._diamondRealWidth,
      height: this._diamondRealHeight,
      img: this._diamondImage,
      keyframe
    };
  }

  showEditControls(editControlState): void {
    let canShowSelectEasing = true;

    switch (this.layerDataType) {
      case ATE_PlaybackEngine.DataTypes.Boolean:
      case ATE_PlaybackEngine.DataTypes.String:
        canShowSelectEasing = false;
        break;
    }

    if (!this._ate.playbackController.isPlaying) {
        const currentTime = this._ate.playbackController.currentTime;
        const keyframe = ATEPlaybackEngine.getKeyframeByTime(this._keyframes, currentTime);

        switch (editControlState) {
          case ATEEnumLayerEditControls.Value_Editable:
            this._layerValueSelector.css('display', 'block');
            this._layerValueSelector.removeAttr('disabled');
            this._layerValueSelector.off().on('change paste', this.onValueChange);

            if (canShowSelectEasing) {
              this._selectOptionSelector.css('display', 'none');
              this._selectOptionSelector.off();
            }

            this._buttonKeyframeAddSelector.css('display', 'block');
            this._buttonKeyframeAddSelector.off().on('click', this.onRemoveKeyframeButtonClick);
            break;
          case ATEEnumLayerEditControls.Keyframe:
            this._layerValueSelector.css('display', 'none');
            this._layerValueSelector.attr('disabled', 'true');
            this._layerValueSelector.off();

            if (canShowSelectEasing) {
                this._selectOptionSelector.css('display', 'none');
                this._selectOptionSelector.off();
            }

            this._buttonKeyframeAddSelector.css('display', 'block');
            this._buttonKeyframeAddSelector.off().on('click', this.onAddKeyframeButtonClick);
            break;
          case ATEEnumLayerEditControls.Tween:
            this._layerValueSelector.css('display', 'block');
            this._layerValueSelector.removeAttr('disabled');
            this._layerValueSelector.off().on('change paste', this.onValueChange);

            if (canShowSelectEasing) {
                this._selectOptionSelector.val(keyframe.tweenType);
                this._selectOptionSelector.css('display', 'block');
                this._selectOptionSelector.off().on('change', this.onTweenChange);
            }

            this._buttonKeyframeAddSelector.css('display', 'block');
            this._buttonKeyframeAddSelector.off().on('click', this.onRemoveKeyframeButtonClick);
            break;
        }

        if (!canShowSelectEasing) {
            this._selectOptionSelector.css('display', 'none');
            this._selectOptionSelector.off();
        }
    }
  }

  private onAddKeyframeButtonClick(evt): void {
    const currentTime = this._ate.playbackController.currentTime;
    const result = this._ate.addLayer(this._layerName, currentTime, 0, this._layerDataType,
      ATE_Engine.IgnoreExtraParams, ATE_Engine.IgnoreExtraParams);

    // Force set in ATE current Keyframe and Layer
    this.onMouseClick_Keyframe(result.Keyframe);
    // Invalidate GUI
    this.invalidate();
  }

  private onRemoveKeyframeButtonClick(evt): void {
    const currentTime = this._ate.playbackController.currentTime;
    this.removeKeyframe(currentTime);
    // Invalidate GUI
    this.invalidate();
  }

  private onValueChange(evt): void {
    if (!this._ate.playbackController.isPlaying) {
      const currentTime = this._ate.playbackController.currentTime;
      const keyframe = ATE_PlaybackEngine.GetKeyframeByTime(this._keyframes, currentTime);

      if (keyframe) {
        switch (this._layerDataType) {
          case ATEEnumDataType.Numeric:
            debugger;
            keyframe.Value = parseFloat($(this).val() as any);
            break;
          case ATEEnumDataType.Boolean:
            keyframe.Value = $(this).is(':checked');
            break;
          case ATEEnumDataType.String:
            keyframe.Value = $(this).val();
            break;
        }

        // change
        if (this._ate.onChangeCallback) { this._ate.onChangeCallback(); }
      }
    }
  }

  private onTweenChange(evt): void {
    debugger;
    const selectValue = parseInt($(this).val() as any);
    const currentTime = this._ate.playbackController.currentTime;
    const keyframe = ATE_PlaybackEngine.GetKeyframeByTime(this._keyframes, currentTime);

    if (keyframe) {
      keyframe.TweenType = selectValue;

      // change
      if (this._ate.onChangeCallback { this._ate.onChangeCallback(); }
    }
  }

  // tslint:disable-next-line: cyclomatic-complexity
  updateFromPlayback(time: number, dt: number, isEditable?: boolean): void {
    isEditable = !!isEditable ? isEditable : false;

    const keyframe = ATEPlaybackEngine.getKeyframeByTime(this._keyframes, time);
    const keyframes = ATEPlaybackEngine.getKeyframesBetween(this._keyframes, time);

    if (!keyframes.noData) {
      // Editable logic
      if (isEditable) {
        if (keyframe) {
          let canHaveTween = !!keyframes.KFi && !!keyframes.KFe;
          const isLastSelected = canHaveTween && keyframes.KFe.time === time && keyframes.KFe_IsLast;
          canHaveTween = canHaveTween && !isLastSelected;

          this.showEditControls(canHaveTween
            ? ATE_Layer.EditControls.Tween
            : ATE_Layer.EditControls.Value_Editable
          );
        } else {
          this.showEditControls(ATE_Layer.EditControls.Keyframe);
        }

        // change keyframe image button if has keyframe
        this._buttonKeyframeAddSelector.attr('src', keyframe
          ? ATEResources.diamondSelected.path
          : ATEResources.diamond.path
        );
      }
      ////////////////

      // Playback Engine
      this._layerValue = ATE_PlaybackEngine.ByLayer(this._keyframes, time,
          this._layerDataType, this._layerIsInterpolable);
      this.__LayerValue = this._layerValue;

      // set value in label
      switch (this._layerDataType) {
        case ATE_PlaybackEngine.DataTypes.Numeric:
          this._layerValueSelector.val(this._layerValue.toFixed(3));
          break;
        case ATE_PlaybackEngine.DataTypes.Color:
          const cR = this._layerValue.r * 255.0;
          const cG = this._layerValue.g * 255.0;
          const cB = this._layerValue.b * 255.0;
          const cA = this._layerValue.a;

          const resultColor = `rgba(${cR},${cG },${cB},${cA})`;

          this._layerValueSelector.attr('disabled', 'true');
          this._layerValueSelector.css('background-color', resultColor);
          break;
        case ATE_PlaybackEngine.DataTypes.Boolean:
          this._layerValueSelector.prop('checked', this._layerValue);
          break;
        case ATE_PlaybackEngine.DataTypes.String:
          this._layerValueSelector.val(this._layerValue);
          break;
      }
    } else {
      this.showEditControls(ATEEnumLayerEditControls.Keyframe);

      // change keyframe image button if has keyframe
      this._buttonKeyframeAddSelector.attr('src', ATEResources.diamond.path);
    }
  }

  update(index: number, dt: number): void {
    for (let i = 0; i < this._keyframes.length; i++) {
      const keyframe = this._keyframes[i];
      const nextKeyframe = this._keyframes[i + 1];

      if (keyframe) {
        this.drawKeyframe(keyframe, nextKeyframe, index, dt);
      }
    }
  }

  DrawGUI = function(index, dt) {
    var ctx = mSelf.ctx;
    var layerHeight = ATE_Styles.AC_TimelineLayerHeight;
    
    var scrollX = mATE.GetScrollX();
    var scrollY = mATE.GetScrollY();
    var x = scrollX;
    var y = scrollY + ((index + 1) * layerHeight) + 
        ATE_Styles.AC_TimelineHeight + ATE_Styles.Timeline.OffsetY;
    var toX = (mATE.GetAnimationSeconds() * mATE.GetGUI_RealSegmentWidth() + 
        ATE_Styles.Timeline.OffsetX);
    
    // Draw layer line
    ctx.beginPath()
    ctx.moveTo(x, y);
    ctx.lineTo(toX, y);
    ctx.lineWidth = 1;
    ctx.lineHeight = 1;
    ctx.strokeStyle = ATE_Styles.CStroke_Color;
    ctx.stroke();
    ctx.closePath()
}

this.DrawKeyframe = function(keyframe, nextKeyframe, index, dt) {
    mCurrentIndex = index;
    
    var ctx = mSelf.ctx;
    var scrollX = mATE.GetScrollX();
    var scrollY = mATE.GetScrollY();
    var keyframeRD = mSelf.GetKeyFrameRenderData(keyframe);
    
    if (nextKeyframe) {
        switch (keyframe.TweenType) {
            case ATE_PlaybackEngine.TweenType.EaseLinear:
            case ATE_PlaybackEngine.TweenType.EaseInQuad:
            case ATE_PlaybackEngine.TweenType.EaseOutQuad:
            case ATE_PlaybackEngine.TweenType.EaseInOutQuad:
            case ATE_PlaybackEngine.TweenType.EaseInCubic:
            case ATE_PlaybackEngine.TweenType.EaseOutCubic:
            case ATE_PlaybackEngine.TweenType.EaseInOutCubic:
            case ATE_PlaybackEngine.TweenType.EaseInSine:
            case ATE_PlaybackEngine.TweenType.EaseOutSine:
            case ATE_PlaybackEngine.TweenType.EaseInOutSine:
            case ATE_PlaybackEngine.TweenType.EaseInExpo:
            case ATE_PlaybackEngine.TweenType.EaseOutExpo:
            case ATE_PlaybackEngine.TweenType.EaseInOutExpo:
            case ATE_PlaybackEngine.TweenType.EaseInElastic:
            case ATE_PlaybackEngine.TweenType.EaseOutElastic:
            case ATE_PlaybackEngine.TweenType.EaseInOutElastic:
                var nextKeyframeRD = mSelf.GetKeyFrameRenderData(nextKeyframe);
                
                var rectX = keyframeRD.X + (ATE_Resources.Diamond.TimelineWidth * 0.5) + scrollX;
                var rectY = (keyframeRD.Y - mOffsetY_Img) + scrollY;
                var rectW = nextKeyframeRD.X - keyframeRD.X;
                var rectH = ATE_Styles.AC_TimelineLayerHeight;
                
                // Draw box
                ctx.beginPath();
                ctx.fillStyle = "#0000FF55";
                ctx.fillRect(rectX, rectY, rectW, rectH);
                ctx.closePath();
                break;
        }
    }
    
    // finally draw keyframe
    ctx.drawImage(keyframeRD.Img, keyframeRD.X + scrollX, keyframeRD.Y + scrollY, 
        keyframeRD.Width, keyframeRD.Height);
}

this.Destroy = function() {
    mLayerSelector.remove();
    
    mKeyframes = undefined;
    mSelf.ctx = undefined;
    mATE = undefined;
    mSelf = undefined;
    mLayerSelector = undefined;
    mLayerNameSelector = undefined;
    mLayerValueSelector = undefined;
    mSelectOptionSelector = undefined;
    mButtonKeyframeAddSelector = undefined;
    mDiamondImg = undefined;
    mDiamondSelectedImg = undefined;
  }
}
