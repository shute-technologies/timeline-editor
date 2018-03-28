function ATE_Layer(ate) {
    var mSelf = this;
    var mATE = ate;
    var mDiamondImg = $("#" + ATE_Resources.Diamond.Id)[0];
    var mDiamondSelectedImg = $("#" + ATE_Resources.DiamondSelected.Id)[0];
    
    this.ctx = mATE.ctx;
    
    var mLayerName;
    var mCurrentIndex;
    var mKeyframes = [];
    
    // internal
    var mDiamondRealWidth = ATE_Resources.Diamond.TimelineWidth;
    var mDiamondRealHeight = ATE_Resources.Diamond.TimelineHeight;
    var mOffsetX_Img = (-mDiamondRealWidth * 0.5);
    var mOffsetY_Img = ((ATE_Styles.AC_TimelineLayerHeight * 0.5) + (-mDiamondRealWidth * 0.5));
    var mLayerSelector;
    var mLayerNameSelector;
    var mLayerValueSelector;
    var mSelectOptionSelector;
    var mButtonKeyframeAddSelector;
    
    this.GetLayerName = function() { return mLayerName; } 
    
    this.Initialize = function(name) {
        mLayerName = name;
        
        var parentSelector = mATE.GetLayersUI_Selector();
        mLayerSelector = $("<div data-layer-name='" + name + "'></div>");
        mLayerSelector.css("height", ATE_Styles.AC_TimelineLayerHeight);
        
        var dataParentSelector = $("<div></div>");
        dataParentSelector.css("height", ATE_Styles.AC_TimelineLayerHeight);
        
        mLayerNameSelector = $("<div style='float:left;'>" + mLayerName + "</div>");
        
        var parentControls = $("<div style='float:right;padding-top: 5px;'></div>");
        mLayerValueSelector = $("<input type='text'></input>");
        
        mSelectOptionSelector = ATE_Layer.CreateTweenSelect(ATE_Layer.TweenType);
        mButtonKeyframeAddSelector = ATE_Layer.CreateKeyframeAddButton();
        
        // add controls to the parent controls div
        parentControls.append(mSelectOptionSelector);
        parentControls.append(mButtonKeyframeAddSelector);
        parentControls.append(mLayerValueSelector);
        
        // set CSS for Labels
        ATE_Layer.SetLabelCSS_LayerName(mLayerNameSelector);
        ATE_Layer.SetLabelCSS_LayerValue(mLayerValueSelector);
        
        dataParentSelector.append(mLayerNameSelector);
        dataParentSelector.append(parentControls);
        
        mLayerSelector.append(dataParentSelector);
        mLayerSelector.append(ATE_Layer.CreateHR());
        parentSelector.append(mLayerSelector);
        
    }
    
    this.OnPlayOrPause = function(isPlaying) {
        if (isPlaying) {
            mLayerValueSelector.css('display', "block");
            mLayerValueSelector.attr('disabled', true);
            mSelectOptionSelector.css("display", "none");
            mButtonKeyframeAddSelector.css("display", "none");
        }
    }
    
    this.OnStop = function() {
        // force to set GUI
        mSelf.Invalidate();
    }
    
    this.Invalidate = function() {
        mSelf.UpdateFromPlayback(mATE.GetPlaybackController().GetCurrentTime(), 33, true);
    }
    
    this.OnMouseClick_Keyframe = function(keyframe) {
        var isPlaying = mATE.GetPlaybackController().GetIsPlaying();
        
        if (!isPlaying) {
            // Set the value of the keyframe to the HTML
            mLayerValueSelector.val(keyframe.Value.toFixed(3));
        }
    }
    
    this.GetKeyframeByPosition = function(x, y) {
        var resultKeyframe = undefined;
        var layerHeight = ATE_Styles.AC_TimelineLayerHeight;
        var segmentWidth = mATE.GetGUI_RealSegmentWidth();
        var offsetX_Image = 0;
        var offsetY_Image = ((layerHeight * 0.5) + offsetX_Image) ;
        
         for (var i = 0; i < mKeyframes.length; i++) {
            var keyframe = mKeyframes[i];
            
            if (keyframe) {
                var keyframeX = (keyframe.Time * segmentWidth) + offsetX_Image + ATE_Styles.Timeline.OffsetX;
                var keyframeY = (mCurrentIndex * layerHeight) + ATE_Styles.AC_TimelineHeight + 
                    offsetY_Image + ATE_Styles.Timeline.OffsetY;
                    
                var wasHitted = ATE_Util.HitTestCenterByPoint(keyframeX, keyframeY, 
                    mDiamondRealWidth, mDiamondRealHeight, x, y);
                    
                if (wasHitted) {
                    resultKeyframe = keyframe;
                    break;
                }
            }
        }
        
        return resultKeyframe;
    }
    
    this.GetKeyframeByTime = function(time) {
        var resultKeyframe = undefined;
        var layerHeight = ATE_Styles.AC_TimelineLayerHeight;
        var segmentWidth = mATE.GetGUI_RealSegmentWidth();
        var offsetX_Image = 0;
        var offsetY_Image = ((layerHeight * 0.5) + offsetX_Image) ;
       
        for (var i = 0; i < mKeyframes.length; i++) {
            var keyframe = mKeyframes[i];
            
            if (keyframe && (keyframe.Time >= (time - ATE_Engine.EPSILON) && keyframe.Time <= (time + ATE_Engine.EPSILON))) {
                resultKeyframe = keyframe;
                break;
            }
        }
        
        return resultKeyframe;
    }
    
    this.SetKeyframe = function (time, value) {
        var keyframe = {
            Name: mLayerName,
            Time: time,
            DataType: ATE_Layer.DataTypes.Numeric,
            Value: value,
            TweenType: ATE_Layer.TweenType.None,
            __Img: mDiamondImg,
            __ImgSelected: mDiamondSelectedImg,
            __Selected: false
        };
        
        mKeyframes.push(keyframe);
        
        mKeyframes.sort(function(a, b) {
          return a.Time - b.Time;
        });
        
        return keyframe;
    }
    
    this.RemoveKeyframe = function(time) {
        for (var i = 0; i < mKeyframes.length; i++) {
            var keyframe = mKeyframes[i];
            
            if (keyframe && keyframe.Time === time) {
                mKeyframes.splice(i, 1);
                break;
            }
        }
        
        mKeyframes.sort(function(a, b) {
          return a.Time - b.Time;
        });
    }
    
    this.RemoveKeyframesBetween = function(from, to) {
        for (var i = 0; i < mKeyframes.length; i++) {
            var keyframe = mKeyframes[i];
            
            if (keyframe && (keyframe.Time >= from && keyframe.Time <= to)) {
                mKeyframes.splice(i, 1);
                i--;
            }
        }
    }
    
    this.GetKeyframesBetween = function(time) {
        var result = {
            KFi: undefined,
            KFe: undefined,
            NoData: true,
            KFi_IsFirst: false,
            KFe_IsLast: false
        };
        
        var size = mKeyframes.length;
        
        if (size > 1) {
            for (var i = 0; i < size; i++) {
                var _kfI = mKeyframes[i];
                var _kfE = mKeyframes[i + 1];
                
                if (_kfI.Time <= time) {
                    if (_kfE && _kfE.Time >= time) {
                        result.KFi = _kfI;
                        result.KFe = _kfE;
                        result.NoData = false;
                        result.KFi_IsFirst = i === 0;
                        result.KFe_IsLast = (i + 1) === (size - 1);
                        break;
                    }
                    else if (_kfE === undefined) { // last
                        result.KFe_IsLast = true;
                        result.KFi = _kfI;
                        result.NoData = false;
                    }
                }
            }
        }
        else if (size === 1) {
            result.KFi = mKeyframes[0];
            result.NoData = false;
            result.KFi_IsFirst = true;
        }
        
        return result;
    }
    
    this.GetKeyFrameRenderData = function(keyframe) {
        var layerHeight = ATE_Styles.AC_TimelineLayerHeight;
        var segmentWidth = mATE.GetGUI_RealSegmentWidth();
        
        var x = (keyframe.Time * segmentWidth) + mOffsetX_Img + ATE_Styles.Timeline.OffsetX;
        var y = (mCurrentIndex * layerHeight) + ATE_Styles.AC_TimelineHeight + 
            mOffsetY_Img + ATE_Styles.Timeline.OffsetY;
        var img = keyframe.__Selected ? keyframe.__ImgSelected : keyframe.__Img;
        
        return {
            X: x,
            Y: y,
            Width: mDiamondRealWidth,
            Height: mDiamondRealHeight,
            Img: img,
            Keyframe: keyframe
        };
    }
    
    this.Update = function(index, dt) {
        var ctx = mSelf.ctx;
        
        for (var i = 0; i < mKeyframes.length; i++) {
            var keyframe = mKeyframes[i];
            var nextKeyframe = mKeyframes[i + 1];
            
            if (keyframe) {
                mSelf.DrawKeyframe(keyframe, nextKeyframe, index, dt);
            }
        }
    }
    
    this.ShowEditControls = function(editControlState) {
        if (!mATE.GetPlaybackController().GetIsPlaying()) {
            var currentTime = mATE.GetPlaybackController().GetCurrentTime();
            var keyframe = mSelf.GetKeyframeByTime(currentTime);
            
            switch (editControlState) {
                case ATE_Layer.EditControls.Value_Editable:
                    mLayerValueSelector.css('display', "block");
                    mLayerValueSelector.removeAttr('disabled');
                    mLayerValueSelector.off().on('change paste keyup', OnValueChange);
                    
                    mSelectOptionSelector.css("display", "none");
                    mSelectOptionSelector.off();
                    
                    mButtonKeyframeAddSelector.css("display", "none");
                    mButtonKeyframeAddSelector.off();
                    break;
                case ATE_Layer.EditControls.Keyframe:
                    mLayerValueSelector.css('display', "none");
                    mLayerValueSelector.attr('disabled', "true");
                    mLayerValueSelector.off();
                    
                    mSelectOptionSelector.css("display", "none");
                    mSelectOptionSelector.off();
                    
                    mButtonKeyframeAddSelector.css("display", "block");
                    mButtonKeyframeAddSelector.off().on('click', OnAddKeyframeButtonClick);
                    break;
                case ATE_Layer.EditControls.Tween:
                    mLayerValueSelector.css('display', "block");
                    mLayerValueSelector.removeAttr('disabled');
                    mLayerValueSelector.off().on('change paste keyup', OnValueChange);
                    
                    mSelectOptionSelector.val(keyframe.TweenType);
                    mSelectOptionSelector.css("display", "block");
                    mSelectOptionSelector.off().on('change', OnTweenChange);
                    
                    mButtonKeyframeAddSelector.css("display", "block");
                    mButtonKeyframeAddSelector.off().on('click', OnRemoveKeyframeButtonClick);
                    break;
            }
        }
    }
    
    var OnAddKeyframeButtonClick = function(evt) {
        var currentTime = mATE.GetPlaybackController().GetCurrentTime();
        var result = mATE.AddLayer(mLayerName, currentTime, 0);
        
        // Force set in ATE current Keyframe and Layer
        mSelf.OnMouseClick_Keyframe(result.Keyframe);
        // Invalidate GUI
        mSelf.Invalidate();
    }
    
    var OnRemoveKeyframeButtonClick = function(evt) {
        var currentTime = mATE.GetPlaybackController().GetCurrentTime();
        mSelf.RemoveKeyframe(currentTime);
        // Invalidate GUI
        mSelf.Invalidate();
    }
    
    var OnValueChange = function(evt) {
        var currentTime = mATE.GetPlaybackController().GetCurrentTime();
        var keyframe = mSelf.GetKeyframeByTime(currentTime);
        
        if (keyframe) {
            var selectValue = parseInt($(this).val());
            
            switch (keyframe.DataType) {
                case ATE_Layer.DataTypes.Numeric:
                    keyframe.Value = parseFloat(selectValue);
                    break;
                default:
                    // code
                    break;
            }
        }
    }
    
    var OnTweenChange = function(evt) {
        var selectValue = parseInt($(this).val());
        var currentTime = mATE.GetPlaybackController().GetCurrentTime();
        var keyframe = mSelf.GetKeyframeByTime(currentTime);
        
        if (keyframe) {
            keyframe.TweenType = selectValue;
        }
    }
    
    this.UpdateFromPlayback = function(time, dt, isEditable) {
        isEditable = isEditable !== undefined ? isEditable : false;
        
        var keyframe = mSelf.GetKeyframeByTime(time);
        var keyframes = mSelf.GetKeyframesBetween(time);
        
        if (!keyframes.NoData) {
            // Editable logic
            if (isEditable) {
                if (keyframe) {
                    var canHaveTween = keyframes.KFi && keyframes.KFe;
                    var isLastSelected = canHaveTween && keyframes.KFe.Time === time && keyframes.KFe_IsLast;  
                    canHaveTween = canHaveTween && !isLastSelected;
                                  
                    mSelf.ShowEditControls(canHaveTween 
                        ? ATE_Layer.EditControls.Tween 
                        : ATE_Layer.EditControls.Value_Editable);
                }
                else {
                    mSelf.ShowEditControls(ATE_Layer.EditControls.Keyframe);
                }
                
                // change keyframe image button if has keyframe
                mButtonKeyframeAddSelector.attr("src", keyframe 
                    ? ATE_Resources.DiamondSelected.Path 
                    : ATE_Resources.Diamond.Path);
            }
            ////////////////
            
            var kfiValue = keyframes.KFi.Value;
            var resultValue = keyframe ? keyframe.Value : kfiValue;
            
            if (keyframes.KFe) {
                var fkiTime = keyframes.KFi.Time;
                var fkeTime = keyframes.KFe.Time;
                var kfeValue = keyframes.KFe.Value;
                
                // compute real time between frames for the tween
                var diffTime = fkeTime - fkiTime;
                var actualTime = 1.0 - ((fkeTime - time) / diffTime);
                
                switch (keyframes.KFi.TweenType) {
                    case ATE_Layer.TweenType.Linear:
                        resultValue = Easing.Equations.linear(actualTime, kfiValue, kfeValue, 1);
                        break;
                } 
            }
            
            // set value in label
            mLayerValueSelector.val(resultValue.toFixed(3));
        }
        else {
            mSelf.ShowEditControls(ATE_Layer.EditControls.Keyframe);
            
            // change keyframe image button if has keyframe
            mButtonKeyframeAddSelector.attr("src", ATE_Resources.Diamond.Path);
        }
    }
    
    this.DrawGUI = function(index, dt) {
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
                case ATE_Layer.TweenType.Linear:
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
        var parentSelector = mATE.GetLayersUI_Selector();
        parentSelector.remove(mLayerSelector);
        
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

ATE_Layer.DataTypes = {
  Numeric: 1  
};

ATE_Layer.TweenType = {
    None: 0,
    Linear: 1
}

ATE_Layer.EditControls = {
    None: 0,
    Value_Editable: 1,
    Keyframe: 2,
    Tween: 3
}


ATE_Layer.SetLabelCSS_LayerName = function(selector) {
    selector.css("height", ATE_Styles.AC_TimelineLayerHeight);
    selector.css("font-size", "13px");
    selector.css("color", ATE_Styles.AC_TimelineSubSegment_Color);
    selector.css("font-family", "arial");
    selector.css("margin-left", "4px");
    selector.css("white-space", "nowrap");
    selector.css("overflow", "hidden");
    selector.css("text-overflow", "ellipsis");
    selector.css("max-width", "90px");
    selector.css("padding-top", "8px");
    selector.css("max-height", "20px");
} 

ATE_Layer.SetLabelCSS_LayerValue = function(selector) {
    selector.css("font-size", "11px");
    selector.css("font-family", "arial");
    selector.css("margin-right", "2px");
    selector.css("width", "40px");
    selector.css("float", "right");
    selector.attr("disabled", true);
}

ATE_Layer.CreateTweenSelect = function(tweens) {
    var html = "";
    html += "<select style='display:none;margin-right:2px;float:left;width:55px'>";
    
    for (var name in tweens) {
        html += "   <option value='" + tweens[name] + "'>" + name + "</option>";
    }
    
    html += "</select>";
    
    return $(html);
}

ATE_Layer.CreateKeyframeAddButton = function() {
    var html = "";
    html += "<img src='" + ATE_Resources.Diamond.Path + "' width='" + ATE_Resources.Diamond.TimelineWidth + 
        "' height='" + ATE_Resources.Diamond.TimelineHeight + "' style='display:none;margin-right:2px;float:right;margin-top: 5px;'/>";
    
    return $(html);
}

ATE_Layer.CreateHR = function() {
    var hrSelector = $("<hr />");
    hrSelector.css("border-color", ATE_Styles.CStroke_Color);
    hrSelector.css("border-width", "0.5px");
    hrSelector.css("margin", "0");
    hrSelector.css("padding", "0");
    hrSelector.css("-webkit-margin-before", "0");
    hrSelector.css("-webkit-margin-before", "0");
    hrSelector.css("-webkit-margin-start", "0");
    hrSelector.css("-webkit-margin-end", "0");
    
    return hrSelector;
}