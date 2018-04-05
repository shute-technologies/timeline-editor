/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */

function Easing() {}
Easing.Equations = {

	easeLinear: function (t, b, c, d) {
		return c * t / d + b;
	},
	easeInQuad: function (t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	//easeInBack: function (t, b, c, d, s) {
	//	if (s == undefined) s = 1.70158;
	//	return c*(t/=d)*t*((s+1)*t - s) + b;
	//},
	//easeOutBack: function (t, b, c, d, s) {
	//	if (s == undefined) s = 1.70158;
	//	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	//},
	//easeInOutBack: function (t, b, c, d, s) {
	//	if (s == undefined) s = 1.70158; 
	//	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	//	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	//},
	//easeInBounce: function (t, b, c, d) {
	//	return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	//},
	easeOutBounce: function (t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	//easeInOutBounce: function (t, b, c, d) {
	//	if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
	//	return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	//}
};
function ATE_Resources() {}
ATE_Resources.Diamond = {
    Id: "ate-img-diamond",
    Path: "res/spATE_diamond.png",
    TimelineWidth: 10,
    TimelineHeight: 10
};
ATE_Resources.DiamondSelected = {
    Id: "ate-img-diamond-selected",
    Path: "res/spATE_diamond_selected.png",
    TimelineWidth: 10,
    TimelineHeight: 10
};

function ATE_Styles() {}
ATE_Styles.Default_Seconds = 10;
ATE_Styles.Default_SubSegments = 10;

ATE_Styles.ScrollbarHeight = 16;
ATE_Styles.GUIHeight = 140;
ATE_Styles.CanvasHeight = ATE_Styles.GUIHeight - ATE_Styles.ScrollbarHeight;
ATE_Styles.BackgroundColor = "#4e4e4e";

// Controls: Styles
ATE_Styles.CStroke_Color = "#6e6e6e";
ATE_Styles.Font_Color = "#f9f9f9";
ATE_Styles.AC_Width = 200;
// Controls: Timeline GUI
ATE_Styles.AC_TimelineHeight = 60;
ATE_Styles.AC_TimelineSegmentWidth = 160;
ATE_Styles.AC_TimelineSubSegmentHeight = 6;
ATE_Styles.AC_TimelineSubSegmentLimitsHeight = 20;
ATE_Styles.AC_TimelineSubSegment_Color = "#f9f9f9";
ATE_Styles.AC_TimelineSubSegment_TextStyle = "bold 9px Arial";
// Controls: Layer GUI
ATE_Styles.AC_TimelineLayerHeight = 30;

ATE_Styles.Timeline = {
    OffsetX: 22,
    OffsetY: 0
};

// Controls: Playback
ATE_Styles.Playback = {
    DefaultTime: 60,
    GUI_Width: 52,
    GUI_Height: 15,
    GUI_TextStyle: "bold 12px Arial",
    GUI_TextColor: "white",
    GUI_BackgroundColor: "red",
    GUI_LineColor: "#FF000066",
    GUI_TextTimeOffset: {
        X: 2,
        Y: -4
    }
};

ATE_Styles.Scrollbar = {
  HorizontalSize: 14,
  VerticalSize: 30
};
function ATE_Button(ate) {
    
    var mSelf = this;
    var mATE = ate;
    
    this.ctx = mATE.ctx;
    
    this.Initialize = function() {
        
    }
    
    this.Update = function(dt) {
        
    }
}
function ATE_HtmlButton(ate) {
    
    var mSelf = this;
    var mATE = ate;
    
    this.ctx = mATE.ctx;
    
    var mSrcState1;
    var mSrcState2;
    var mButton;
    var mIsToggled = false;
    var mCallback_click;
    
    this.GetButtonSelector = function() { return mButton; }
    
    this.Initialize = function(srcState1, srcState2) {
        mSrcState1 = srcState1;
        mSrcState2 = srcState2;
        
        mButton = $("<img src='" + mSrcState1 + "' width='20' />");
        
        // click: record
        mButton.on('click', mSelf.OnClick);
    }
    
    this.Reset = function() {
        mIsToggled = false;
        mButton.attr("src", mSrcState1);
    }
    
    this.SetClickCallback = function(callback) {
        mCallback_click = callback;
    }
    
    this.AddMargin = function() {
        mButton.css("margin-left", "4px");
    }
    
    this.OnClick = function(evt) {
        mIsToggled = !mIsToggled;
        
        if (mSrcState2) {
            mButton.attr("src", mIsToggled ? mSrcState2 : mSrcState1);
        }
        
        if (mCallback_click) {
            mCallback_click(evt);
        }
    }
    
    this.Update = function(dt) {
        
    }
}
function ATE_Util() {}

ATE_Util.GetDigitsByValue = function(value, num_digits) {
	var s = String(value);
	var offset = num_digits - s.length;
	
	for (var i = 0; i < offset; i++) { s = "0" + s; }
	return s;
}

ATE_Util.FormatTime = function(milliseconds, secondDigits, showDecimals) {
    secondDigits = secondDigits <= 1 ? 2 : secondDigits;

    var minutes = (milliseconds / 1000.0) / 60.0;
    var minutesFloor = Math.floor(minutes);
    var secondsRaw = minutes - minutesFloor;
    var seconds = 0.0;
    var decimals = "";
    var canShowDecimals = showDecimals === undefined ? false : showDecimals;

    if (secondDigits === 2 && !canShowDecimals) { 
        seconds = Math.floor(secondsRaw * 60); 
    }
    else {
        var factor = Math.pow(10, (secondDigits - 2));

        seconds = secondsRaw * 60.0;
        decimals = Math.floor((seconds - Math.floor(seconds) * factor) * 100);
        seconds = Math.floor(secondsRaw * 60); 
    }
    
    return ATE_Util.GetDigitsByValue(minutesFloor, minutesFloor > 9 ? 1 : 2) +
        ":" + ATE_Util.GetDigitsByValue(seconds, 2) + 
        (canShowDecimals ? ("." + ATE_Util.GetDigitsByValue(decimals, 2)) : "");
}

ATE_Util.FormatTimeAsSeconds = function(milliseconds) {
    var seconds = milliseconds / 1000;
    var decimals = "";

    decimals = Math.floor((seconds - Math.floor(seconds)) * 100);
    seconds = Math.floor(seconds); 
    
    return ATE_Util.GetDigitsByValue(seconds, 2) + "." + ATE_Util.GetDigitsByValue(decimals, 2);
}

ATE_Util.HitTestCenterByPoint = function (x, y, sizeX, sizeY, pointX, pointY) {
    var hSize = sizeX * 0.5;        
    var vSize = sizeY * 0.5;        
    
    var result = (x - hSize) < pointX && (x + hSize) > pointX && 
        (y - vSize) < pointY && (y + vSize) > pointY;
    
    return result;
}

ATE_Util.HitTestByPoint = function (x, y, sizeX, sizeY, pointX, pointY) {
    var result = x < pointX && (x + sizeX) > pointX && 
        y < pointY && (y + sizeY) > pointY;
    
    return result;
}
function ATE_PlaybackEngine() {
    var mSelf = this;
    var mAnimationData = undefined;
    
    var mFPS;
    var mAnimationSeconds;
    
    var mPlayingSpeed = 0;
    var mCurrentTime = 0;
    var mIsPlaying = false;
    
    this.Animations = {};
    
    this.GetIsPlaying = function() { return mIsPlaying; }
    this.GetCurrentTime = function() { return mCurrentTime; }
    this.GetAnimationSeconds = function() { return mAnimationSeconds; }
    this.GetFPS = function() { return mFPS; }
    
    this.Initialize = function(animationData) {
        mAnimationData = animationData;
        mAnimationSeconds = animationData.AnimationSeconds;
        
        mSelf.ConfigureFPS(animationData.FPS);
        
        // Initialize Animations object reference
        for (var i = 0; i < mAnimationData.LayerCount; i++) {
            var layerObj = mAnimationData.Layers[i];
            
            var layerName = layerObj.Name;
            var resultValue = ATE_PlaybackEngine.ByLayer(layerObj.Data, mCurrentTime);
            
            this.Animations[layerName] = resultValue;
        }
    }
    
    this.ConfigureFPS = function(fps) {
        mFPS = fps;
        
        var deltaTime = 1000.0 / fps;
        mPlayingSpeed = (1 / ATE_PlaybackEngine.DefaultTime) / deltaTime;
    }
    
    this.Play = function() {
        if (!mIsPlaying) {
            mIsPlaying = true;
        }
    }
    
    this.Stop = function() {
        if (mIsPlaying) {
            mIsPlaying = false;
            mCurrentTime = 0;
        }
    }
    
    this.Update = function(dt) {
        if (mIsPlaying) {
            if (mCurrentTime >= mAnimationSeconds) { mCurrentTime = 0; }
            else {
                mCurrentTime += mPlayingSpeed * dt;
                mCurrentTime = mCurrentTime < 0 ? 0 : mCurrentTime;
                mCurrentTime = mCurrentTime > mAnimationSeconds ? mAnimationSeconds : mCurrentTime;
            }
            
            for (var i = 0; i < mAnimationData.LayerCount; i++) {
                var layerObj = mAnimationData.Layers[i];
                
                var layerName = layerObj.Name;
                var resultValue = ATE_PlaybackEngine.ByLayer(layerObj.Data, mCurrentTime);
                
                this.Animations[layerName] = resultValue;
            }
        }
    }
}

// Configurable
ATE_PlaybackEngine.EasingEquations = Easing.Equations;
ATE_PlaybackEngine.DefaultTime = 60;

ATE_PlaybackEngine.ByLayer = function(keyframesData, time) {
    var resultValue = undefined;
    var keyframe = ATE_PlaybackEngine.GetKeyframeByTime(keyframesData, time);
    var keyframes = ATE_PlaybackEngine.GetKeyframesBetween(keyframesData, time);
    
    if (!keyframes.NoData) {
        var kfiValue = keyframes.KFi.Value;
        resultValue = keyframe ? keyframe.Value : kfiValue;
        
        if (keyframes.KFe) {
            var fkiTime = keyframes.KFi.Time;
            var fkeTime = keyframes.KFe.Time;
            var kfeValue = keyframes.KFe.Value;
            
            // compute real time between frames for the tween
            var diffTime = fkeTime - fkiTime;
            var actualTime = 1.0 - ((fkeTime - time) / diffTime);
            var functionObj = undefined;
            
            switch (keyframes.KFi.TweenType) {
                case ATE_PlaybackEngine.TweenType.EaseLinear:    functionObj = ATE_PlaybackEngine.EasingEquations.easeLinear; break;
                case ATE_PlaybackEngine.TweenType.EaseInQuad:    functionObj = ATE_PlaybackEngine.EasingEquations.easeInQuad; break;
                case ATE_PlaybackEngine.TweenType.EaseOutQuad:   functionObj = ATE_PlaybackEngine.EasingEquations.easeOutQuad; break;
                case ATE_PlaybackEngine.TweenType.EaseInOutQuad: functionObj = ATE_PlaybackEngine.EasingEquations.easeInOutQuad; break;
                case ATE_PlaybackEngine.TweenType.EaseInCubic:    functionObj = ATE_PlaybackEngine.EasingEquations.easeInCubic; break;
                case ATE_PlaybackEngine.TweenType.EaseOutCubic:   functionObj = ATE_PlaybackEngine.EasingEquations.easeOutCubic; break;
                case ATE_PlaybackEngine.TweenType.EaseInOutCubic: functionObj = ATE_PlaybackEngine.EasingEquations.easeInOutCubic; break;
                case ATE_PlaybackEngine.TweenType.EaseInSine:    functionObj = ATE_PlaybackEngine.EasingEquations.easeInSine; break;
                case ATE_PlaybackEngine.TweenType.EaseOutSine:   functionObj = ATE_PlaybackEngine.EasingEquations.easeOutSine; break;
                case ATE_PlaybackEngine.TweenType.EaseInOutSine: functionObj = ATE_PlaybackEngine.EasingEquations.easeInOutSine; break;
                case ATE_PlaybackEngine.TweenType.EaseInExpo:    functionObj = ATE_PlaybackEngine.EasingEquations.easeInExpo; break;
                case ATE_PlaybackEngine.TweenType.EaseOutExpo:   functionObj = ATE_PlaybackEngine.EasingEquations.easeOutExpo; break;
                case ATE_PlaybackEngine.TweenType.EaseInOutExpo: functionObj = ATE_PlaybackEngine.EasingEquations.easeInOutExpo; break;
                case ATE_PlaybackEngine.TweenType.EaseInElastic:    functionObj = ATE_PlaybackEngine.EasingEquations.easeInElastic; break;
                case ATE_PlaybackEngine.TweenType.EaseOutElastic:   functionObj = ATE_PlaybackEngine.EasingEquations.easeOutElastic; break;
                case ATE_PlaybackEngine.TweenType.EaseInOutElastic: functionObj = ATE_PlaybackEngine.EasingEquations.easeInOutElastic; break;
            } 
            
            if (functionObj) {
                resultValue = functionObj(actualTime, kfiValue, kfeValue - kfiValue, 1);
            }
        }
    }
    
    return resultValue;
}

ATE_PlaybackEngine.GetKeyframeByTime = function(keyframesData, time) {
    var resultKeyframe = undefined;
   
    for (var i = 0; i < keyframesData.length; i++) {
        var keyframe = keyframesData[i];
        
        if (keyframe && (keyframe.Time >= (time - ATE_PlaybackEngine.EPSILON) && 
            keyframe.Time <= (time + ATE_PlaybackEngine.EPSILON))) {
            
            resultKeyframe = keyframe;
            break;
        }
    }
    
    return resultKeyframe;
}

ATE_PlaybackEngine.GetKeyframesBetween = function(keyframesData, time) {
    var result = {
        KFi: undefined,
        KFe: undefined,
        NoData: true,
        KFi_IsFirst: false,
        KFe_IsLast: false
    };
    
    var size = keyframesData.length;
    
    if (size > 1) {
        for (var i = 0; i < size; i++) {
            var _kfI = keyframesData[i];
            var _kfE = keyframesData[i + 1];
            
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
        result.KFi = keyframesData[0];
        result.NoData = false;
        result.KFi_IsFirst = true;
    }
    
    return result;
}

ATE_PlaybackEngine.EPSILON = 0.001;

ATE_PlaybackEngine.DataTypes = {
  Numeric: 1  
};

ATE_PlaybackEngine.TweenType = {
    None: 0,
    EaseLinear: 1,
    EaseInQuad: 2,
    EaseOutQuad: 3,
    EaseInOutQuad: 4,
    EaseInCubic: 5,
    EaseOutCubic: 6,
    EaseInOutCubic: 7,
    EaseInSine: 8,
    EaseOutSine: 9,
    EaseInOutSine: 10,
    EaseInExpo: 11,
    EaseOutExpo: 12,
    EaseInOutExpo: 13,
    EaseInElastic: 14,
    EaseOutElastic: 15,
    EaseInOutElastic: 16
}
function ATE_Engine() {
    var mSelf = this;
    
    var mParentSelectorName;
    var mParentSelector;
    
    var mParentGUISelectorNamemParentCanvasSelector;
    var mParentCanvasSelectorName;
    
    var mParentGUISelector;
    var mParentGUISelectorName;
    
    var mInputCurrentTimeSelector;
    var mInputTimeLimitSelector;
    
    // UI Controls
    var mControlsUI_Selector;
    
    // Layers Controls
    var mLayersUI_Selector;
    
    var mWidth = 0;
    var mHeight = 0;
    var mContentHeight = 0;
    var mScrollX = 0;
    var mScrollY = 0;
    
    this.ctx = undefined;
    
    // variables
    var mAnimationSeconds;
    var mSubSegments = ATE_Styles.Default_SubSegments;
    var mSegments = [];
    var mLayers = [];
    var mPlaybackController;
    var mCurrentFocusSegment = -1;
    
    // internal variables for GUI
    var mGUI_RealSegmentWidth;
    var mGUI_RealSubSegmentWidth;
    //var mGUILayers_ScrollHeight;
    
    // buttons
    var mButton_PlayOrPause;
    var mButton_Record;
    var mButton_Stop;
    
    // scrollBar: X
    var mScrollXSelector;
    var mScrollXContentSelector;
    // scrollBar: Y
    var mScrollYSelector;
    var mScrollYContentSelector;
    
    // functions callback events
    var mOnRecordCallback = undefined;
    var mOnChangeCallback = undefined;
    
    this.GetCanvasContext = function() { return mCanvasContext; }
    this.GetAnimationSeconds = function() { return mAnimationSeconds; }
    this.GetSubSegments = function() { return mSubSegments; }
    this.GetParentSelector = function() { return mParentSelector; }
    this.GetParentGUISelector = function() { return mParentGUISelector; }
    this.GetControlsUI_Selector = function() { return mControlsUI_Selector; }
    this.GetLayersUI_Selector = function() { return mLayersUI_Selector; }
    this.GetInputCurrentTimeSelector = function() { return mInputCurrentTimeSelector; }
    
    // internal for GUI
    this.GetWidth = function() { return mWidth; }
    this.GetHeight = function() { return mHeight; }
    this.GetScrollX = function() { return mScrollX; }
    this.GetScrollY = function() { return mScrollY; }
    this.GetGUI_RealSegmentWidth = function() { return mGUI_RealSegmentWidth; }
    this.GetGUI_RealSubSegmentWidth = function() { return mGUI_RealSubSegmentWidth; }
    
    this.GetLayers = function() { return mLayers; }
    this.GetSegments = function() { return mSegments; }
    this.GetPlaybackController = function() { return mPlaybackController; }
    this.GetCurrentFocusSegment = function() { return mCurrentFocusSegment; }
    
    this.SetForceATEHeight = function(val) { mHeight = val; }
    this.SetOnRecordCallback = function(callback) { mOnRecordCallback = callback; }
    
    this.SetOnChangeCallback = function(callback) { mOnChangeCallback = callback; }
    this.GetOnChangeCallback = function(callback) { return mOnChangeCallback; }
    
    this.GetAnimationData = function() {
        var resultData = ATE_Engine.DefaultAnimationData();
        resultData.AnimationSeconds = mAnimationSeconds;
        resultData.FPS = mPlaybackController.GetFPS();
        resultData.LayerCount = mLayers.length;
        
        for (var i = 0; i < mLayers.length; i++) {
            var layerName = mLayers[i].GetLayerName();
            var layerData = mLayers[i].GetLayerData();
            
            resultData.Layers.push({
                Data: layerData,
                Name: layerName
            });
        }
        
        return resultData;
    }
    
    this.Initialize = function(selectorName) {
        mParentSelectorName = selectorName;
        mParentSelector = $(mParentSelectorName);
        mParentSelector.css("height", "100%");
        mWidth = mParentSelector.width();
        mHeight = ATE_Styles.GUIHeight;
        mContentHeight = mHeight - ATE_Styles.ScrollbarHeight;
        
        var imgSelector = $("<img id='" + ATE_Resources.Diamond.Id + "' src='" + 
            ATE_Resources.Diamond.Path + "' />");
        imgSelector.css("display", "none");
        var imgSelector_selected = $("<img id='" + ATE_Resources.DiamondSelected.Id + "' src='" + 
            ATE_Resources.DiamondSelected.Path + "' />");
        imgSelector_selected.css("display", "none");
        
        mParentSelector.append(imgSelector);
        mParentSelector.append(imgSelector_selected);
        
        mSelf.CreateGUI();
        mSelf.CreateMouseEvents();
        mSelf.ChangeAnimationSeconds(ATE_Styles.Default_Seconds);
        
        mPlaybackController = new ATE_Playback(mSelf);
        mPlaybackController.Initialize();
        mPlaybackController.ConfigureFPS(ATE_Styles.Playback.DefaultTime);
    }
    
    this.Reset = function() {
        mButton_PlayOrPause.Reset();
        mButton_Record.Reset();
        mButton_Stop.Reset();
        mPlaybackController.Stop();
        
        mSelf.InvalidateLayers();
    }
    
    this.InvalidateLayers = function() {
        for (var i = 0; i < mLayers.length; i++) {
            mLayers[i].Invalidate();
        }
    }
    
    this.CreateMouseEvents = function() {
        // Mouse Move
        mParentCanvasSelector.on('mousemove', function(evt) {
            var mousePos = __getMousePos(mParentCanvasSelector[0], evt);
            // on mouse move
            mPlaybackController.OnMouseMove(mousePos);
        });
        
        // Mouse Up
        mParentCanvasSelector.on('mouseup', function(evt) {
            var mousePos = __getMousePos(mParentCanvasSelector[0], evt);
            // on mouse move
            mPlaybackController.OnMouseUp(mousePos);
        });
        
        // Move Down
        mParentCanvasSelector.on('mousedown', function(evt) {
            var mousePos = __getMousePos(mParentCanvasSelector[0], evt);
            // on mouse move
            mPlaybackController.OnMouseDown(mousePos);
        });
        
        // Mouse Click
        mParentCanvasSelector.on('click', function(evt) { 
            //var mousePos = __getMousePos(mParentCanvasSelector[0], evt);
        });
        
        // Move DoubleClick
        mParentCanvasSelector.on('dblclick', function(evt) {
            //var mousePos = __getMousePos(mParentCanvasSelector[0], evt);
        });
        
        mParentCanvasSelector.on('mouseout', function(evt) {
            var mousePos = __getMousePos(mParentCanvasSelector[0], evt);
            
            //mScrollBar_GeneralY.OnMouseOut(mousePos);
            mPlaybackController.OnMouseOut(mousePos);
        });
        
        
        function __getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
    }
    
    this.CreateGUI = function() {
        mParentGUISelectorName = "gui-" + mParentSelectorName.substring(1);
        mParentGUISelector = $("<div id='" + mParentGUISelectorName + "'></div>");
        mParentGUISelector.css("width", ATE_Styles.AC_Width + "px");
        mParentGUISelector.css("height", mHeight + "px");
        mParentGUISelector.css("float", "left");
        mParentGUISelector.css("background-color", ATE_Styles.BackgroundColor);
        // add HTML canvas
        mParentSelector.append(mParentGUISelector);
        
        mParentCanvasSelectorName = "canvas-" + mParentSelectorName.substring(1);
        mParentCanvasSelector = $("<canvas id='" + mParentCanvasSelectorName + 
            "' width='" + (mWidth - ATE_Styles.AC_Width) + 
            "' height='" + mContentHeight + "'></canvas>");
        mParentCanvasSelector.css("float", "left");
        // add HTML canvas
        mParentSelector.append(mParentCanvasSelector);
        
        // ScrollY HTML
        mScrollYSelector = $("<div style='height:" + mContentHeight + "px;width:" + 
            ATE_Styles.ScrollbarHeight + "px;float: right;overflow-y: auto;'></div>");
        mScrollYContentSelector = $("<div style='height:" + mContentHeight +"px'></div>");
        mScrollYSelector.append(mScrollYContentSelector);
        mParentSelector.append(mScrollYSelector);
        
        // ScrollX HTML
        mScrollXSelector = $("<div style='height:" + (mHeight - mContentHeight) + 
            "px;width: 0px;float: left;overflow-X: auto;'></div>");
        mScrollXContentSelector = $("<div style='width:0px;height:1px'></div>");
        mScrollXSelector.append(mScrollXContentSelector);
        mParentSelector.append(mScrollXSelector);
        
        // get Canvas Context as 2D
        mSelf.ctx = mParentCanvasSelector[0].getContext("2d");
        
        CreateControls_GUI();
        CreateLayers_GUI();
        
        function CreateControls_GUI() {
            var hrSelector = $("<hr style='border-color:" + ATE_Styles.CStroke_Color + 
                ";border-width: 0.5px;margin: 0;padding: 0;-webkit-margin-before: 0;" + 
                "-webkit-margin-after: 0;-webkit-margin-start: 0;-webkit-margin-end: 0;" +
                "transform: translateY(1px);' />");
            
            mControlsUI_Selector = $("<div><div>");
            mControlsUI_Selector.css("height", ATE_Styles.AC_TimelineHeight - 1);
            
            // create container for buttons
            var buttonsUI_selector = $("<div><div>");
            buttonsUI_selector.css("padding-top", "4px");
            buttonsUI_selector.css("padding-left", "4px");
            mControlsUI_Selector.append(buttonsUI_selector);
            
            // buttons: Record
            mButton_Record = new ATE_HtmlButton(mSelf);
            mButton_Record.Initialize("res/spRecord.png", "res/spStopRecording.png");
            mButton_Record.SetClickCallback(function() {
                // on record
                if (mOnRecordCallback) { mOnRecordCallback(); }
            });
            
            // buttons: Play/Pause
            mButton_PlayOrPause = new ATE_HtmlButton(mSelf);
            mButton_PlayOrPause.Initialize("res/spPlay.png", "res/spPause.png");
            mButton_PlayOrPause.AddMargin();
            mButton_PlayOrPause.SetClickCallback(function() {
                // play/pause playback
                mPlaybackController.PlayOrPause();
            });
            
            // buttons: Stop
            mButton_Stop = new ATE_HtmlButton(mSelf);
            mButton_Stop.Initialize("res/spStop.png");
            mButton_Stop.AddMargin();
            mButton_Stop.SetClickCallback(function() {
                // reset button play/pause
                mButton_PlayOrPause.Reset();
                // stop playback
                mPlaybackController.Stop();
            });
            
            // time limit
            var inputTimeLimitLabelSelector = $("<label style='font-size:12px;color:white;margin-left:5px'>Time:<label/>");
            mInputCurrentTimeSelector = $("<input type='text' value='0.00' />");
            
            mInputTimeLimitSelector = $("<input type='text' value='" + ATE_Util.GetDigitsByValue(ATE_Styles.Default_Seconds, 2) + ".00'/>");
            mInputTimeLimitSelector.on('change', function() {
                var val = Math.floor(parseFloat($(this).val()));
                val = ATE_Util.GetDigitsByValue(val, 2);
                $(this).val(val + ".00");
                
                // change animation seconds
                mSelf.ChangeAnimationSeconds(parseInt(val));
            });
            
            ATE_Engine.SetStylesInput_Time(mInputCurrentTimeSelector, true);
            ATE_Engine.SetStylesInput_Time(mInputTimeLimitSelector);
            
            // add buttons to the selector
            buttonsUI_selector.append(mButton_Record.GetButtonSelector());
            buttonsUI_selector.append(mButton_PlayOrPause.GetButtonSelector());
            buttonsUI_selector.append(mButton_Stop.GetButtonSelector());
            
            buttonsUI_selector.append(inputTimeLimitLabelSelector);
            buttonsUI_selector.append(mInputCurrentTimeSelector);
            buttonsUI_selector.append($("<label style='color:white'>/<label/>"));
            buttonsUI_selector.append(mInputTimeLimitSelector);
            
            mParentGUISelector.append(mControlsUI_Selector);
            mParentGUISelector.append(hrSelector);
        }
        
        function CreateLayers_GUI() {
            mLayersUI_Selector = $("<div><div>");
            mLayersUI_Selector.css("height", 
                (mContentHeight - ATE_Styles.AC_TimelineHeight -1) + "px");
            mLayersUI_Selector.css("overflow-y", "hidden");
            
            mParentGUISelector.append(mLayersUI_Selector);
            
            // add empty div for offset
            mLayersUI_Selector.append($("<div style='height:" + ATE_Styles.Timeline.OffsetY + "px'></div>"));
        }
    }
    
    this.ChangeAnimationSeconds = function(seconds, noChange) {
        mAnimationSeconds = seconds;
        mSelf.CreateSegments(mAnimationSeconds);
        
        // update UI control
        var val = Math.floor(parseFloat(mAnimationSeconds));
        val = ATE_Util.GetDigitsByValue(val, 2);
        mInputTimeLimitSelector.val(val + ".00");
        
        // change
        if (noChange === undefined) {
            if (mOnChangeCallback) { mOnChangeCallback(); }
        }
    }
    
    this.ReconstructFrom = function(animationData) {
        mSelf.RemoveAllLayers();
        
        if (animationData && Object.keys(animationData).length > 0) {
            var animationSeconds = animationData.AnimationSeconds === undefined ?
                ATE_Styles.Default_Seconds : animationData.AnimationSeconds;
            var fps = animationData.FPS === undefined ? 
                ATE_Styles.Playback.DefaultTime : animationData.FPS;
            
            mSelf.ChangeAnimationSeconds(animationSeconds, true);
            mPlaybackController.ConfigureFPS(fps, true);
            
            for (var i = 0; i < animationData.LayerCount; i++) {
                var layerData = animationData.Layers[i];
                
                mSelf.AddLayerFrom(layerData);
            }
        }
    }
    
    this.RemoveAllLayers = function() {
        for (var i = 0; i < mLayers.length; i++) {
            mLayers[i].Destroy();
        }
        
        mLayers = [];
    }
    
    this.GetLayer = function(name) {
        var result = {
            Exists: false,
            Layer: undefined
        };
        
        for (var i = 0; i < mLayers.length; i++) {
            if (mLayers[i].GetLayerName() === name) {
                result.Exists = true;
                result.Layer = mLayers[i];
                break;
            }
        }
        
        return result;
    }
    
    this.AddLayer = function(name, time, value) {
        var result = {
            Layer: undefined,
            Keyframe: undefined
        };
        var layerResult = mSelf.GetLayer(name);
        
        if (layerResult.Exists) {
            result.Layer = layerResult.Layer;
            result.Keyframe = layerResult.Layer.SetKeyframe(time, value);
        }
        else {
            var layer = new ATE_Layer(mSelf);
            layer.Initialize(name);
            
            // now first add it to the array
            mLayers.push(layer); 
            
            result.Layer = layer;;
            result.Keyframe = layer.SetKeyframe(time, value);
        }
        
        return result;
    }
    
    this.AddLayerFrom = function(layerData) {
        var layer = new ATE_Layer(mSelf);
        layer.Initialize(layerData.Name);
        layer.ReconstructFrom(layerData.Data);
        
        mLayers.push(layer);
    }
    
    this.CreateSegments = function(seconds) {
        if (mSegments.length === 0) {
            createSegmentsBy(0, seconds);
        }
        else {
            var offset = seconds - mSegments.length;
            
            if (offset > 0) {
                createSegmentsBy(mSegments.length, seconds);
            }
            else {
                // destroy unneeded segments
                var __size = mSegments.length;
                
                for (var i = __size - 1; i >= __size + offset; i--) { 
                    mSegments[i].Destroy();
                }
                
                mSegments.splice((__size + offset), Math.abs(offset));
                
                // destroy unnecesary keyframe
                for (var i = 0; i < mLayers.length; i++) {
                    mLayers[i].RemoveKeyframesBetween(
                        seconds + ATE_PlaybackEngine.EPSILON,
                        Number.MAX_VALUE);
                }
            }
            
            // update segments
            updateSegments();
        }
        
        function updateSegments() {
            for (var i = 0; i < mSegments.length; i++) {
                var segment = mSegments[i];
                segment.FirstSegment = i === 0;
                segment.LastSegment = i === (seconds - 1);
            }
        }
        
        function createSegmentsBy(startIndex, size) {
            var startIndex = startIndex === undefined ? 0 : startIndex;
            
            for (var i = startIndex; i < size; i++) {
                var segment = new ATE_Segment(mSelf);
                segment.Initialize(i);
                segment.FirstSegment = i === 0;
                segment.LastSegment = i === (seconds - 1);
                
                mSegments.push(segment);
            }
        }
    }
    
    this.DrawGUI = function(dt) {
        var ctx = mSelf.ctx;
        
        // Clear
        ctx.clearRect(0, 0, mWidth, mHeight);
        
        // Background
        ctx.fillStyle = ATE_Styles.BackgroundColor;
        ctx.fillRect(0, 0, mWidth, mHeight);
        
        // Change coordinate system by half
        ctx.translate(0.5, 0.5)
        
        // Draw controls strokes background
        ctx.beginPath()
        ctx.moveTo(0, 0);
        ctx.lineTo(0, mContentHeight);
        ctx.lineWidth = 1;
        ctx.strokeStyle = ATE_Styles.CStroke_Color;
        ctx.stroke();
        ctx.closePath()
        
        // Draw Timeline GUI
        ctx.beginPath()
        ctx.moveTo(0, ATE_Styles.AC_TimelineHeight + ATE_Styles.Timeline.OffsetY);
        ctx.lineTo(mWidth, ATE_Styles.AC_TimelineHeight + ATE_Styles.Timeline.OffsetY);
        ctx.lineWidth = 1;
        ctx.strokeStyle = ATE_Styles.CStroke_Color;
        ctx.stroke();
        ctx.closePath()
    }
    
    this.DrawSegments = function(dt) {
        var ctx = mSelf.ctx;
        var sizeX = (mSelf.GetGUI_RealSegmentWidth() * mAnimationSeconds) + 
            ATE_Styles.Timeline.OffsetX;
        var sizeY = ATE_Styles.AC_TimelineHeight;
        
        // clear
        ctx.fillStyle = ATE_Styles.BackgroundColor;
        ctx.fillRect(0, 0, sizeX, sizeY);
        
        for (var i = 0; i < mAnimationSeconds; i++) {
            mSegments[i].Update(dt);
        }
    }
    
    this.DrawLayers = function(dt) {
        for (var i = 0; i < mLayers.length; i++) {
            mLayers[i].Update(i, dt);
        }
    }
    
    this.DrawLayersGUI = function(dt) {
        for (var i = 0; i < mLayers.length; i++) {
            mLayers[i].DrawGUI(i, dt);
        }
    }
    
    this.ComputeVariables = function() {
        mGUI_RealSubSegmentWidth = ATE_Styles.AC_TimelineSegmentWidth / (mSubSegments + 1);
        mGUI_RealSegmentWidth = ATE_Styles.AC_TimelineSegmentWidth - mGUI_RealSubSegmentWidth;
        
        // ScrollX
        var layerContentWidth = (mGUI_RealSegmentWidth * mAnimationSeconds) + ATE_Styles.AC_TimelineHeight;
        mScrollXSelector.css('width', (mWidth - ATE_Styles.AC_Width));
        mScrollXContentSelector.css('width', layerContentWidth);
        // set scroll value
        mScrollX = -mScrollXSelector[0].scrollLeft;
        
        // ScrollY
        var layerContentHeight = ((mLayers.length + 2) * ATE_Styles.AC_TimelineLayerHeight);
        mScrollYContentSelector.css('height', layerContentHeight);
        // set scroll valiue
        mScrollY = -mScrollYSelector[0].scrollTop;
        mLayersUI_Selector[0].scrollTop = -mScrollY;
        
        // responsive size
        mParentCanvasSelector.attr('width', mWidth - ATE_Styles.AC_Width - 20);
        mParentCanvasSelector.attr('height', mContentHeight);
        mParentGUISelector.css("height", mHeight + "px");
        mScrollYSelector.css('height', mContentHeight + "px");
        //mScrollYContentSelector.css('height', mContentHeight + "px");
        mScrollXSelector.css("height", (mHeight - mContentHeight) + "px");
        mLayersUI_Selector.css("height", (mContentHeight - ATE_Styles.AC_TimelineHeight -1) + "px");
    }
    
    this.Update = function (dt) {
        // Update size dynamically
        mWidth = mParentSelector.width();
        //mHeight = mParentSelector.height();
        mContentHeight = mHeight - ATE_Styles.ScrollbarHeight;
        
        // Compute
        mSelf.ComputeVariables();
        
        // Draw
        mSelf.DrawGUI(dt);
        mSelf.DrawLayersGUI(dt);
        mSelf.DrawLayers(dt);
        mSelf.DrawSegments(dt);
        
        mButton_Record.Update(dt);
        mButton_PlayOrPause.Update(dt);
        mButton_Stop.Update(dt);
        
        mPlaybackController.Update(dt);
    }
    
    this.Destroy = function() {
        
    }
}

ATE_Engine.DefaultAnimationData = function() {
    var resultData = {
        AnimationSeconds: ATE_Styles.Default_Seconds,
        FPS: ATE_Styles.Playback.DefaultTime,
        Layers: [],
        LayerCount: 0
    };
    
    return resultData;
}

ATE_Engine.GetLayerByPosition = function(ate, x, y) {
    var layers = ate.GetLayers();
    var result = {};
    result.LayerIndex = -1;
    result.LayerOnFocus = undefined;
    
    var offsetX = ATE_Styles.Timeline.OffsetX;
    var offsetY = ATE_Styles.AC_TimelineHeight + ATE_Styles.Timeline.OffsetY;
    var layerHeight = ATE_Styles.AC_TimelineLayerHeight;
    var layerSizeX = ate.GetGUI_RealSegmentWidth() * ate.GetAnimationSeconds();
    var layerSizeY = layerHeight;
    
    for (var i = 0; i < layers.length; i++) {
        var layerX = offsetX;
        var layerY = (i * layerHeight) + offsetY;
        
        var wasHitted = ATE_Util.HitTestByPoint(layerX, layerY, 
            layerSizeX, layerSizeY, x, y);
        
        if (wasHitted) {
            result.LayerIndex = i;
            result.LayerOnFocus = layers[i];
            break;
        }
    }
    
    return result;
}

ATE_Engine.GetKeyframeByPosition = function(ate, x, y) {
    var layers = ate.GetLayers();
    var result = {};
    result.LayerOnFocus = undefined;
    result.KeyframeOnFocus = undefined;
    
    for (var i = 0; i < layers.length; i++) {
        var keyframe = layers[i].GetKeyframeByPosition(x, y);
        
        if (keyframe) { 
            result.LayerOnFocus = layers[i];
            result.KeyframeOnFocus = keyframe;
            break; 
        }
    }
    
    return result;
}

ATE_Engine.GetSegment = function(ate, mouseX, mouseY) {
    var animationSeconds = ate.GetAnimationSeconds();
    var segmentWidth = ate.GetGUI_RealSegmentWidth();
    var subSegmentWidth = ate.GetGUI_RealSubSegmentWidth();
    var x = (ATE_Styles.Timeline.OffsetX + (0 * segmentWidth)) - 
        subSegmentWidth - (ATE_Styles.Playback.GUI_Width / 4) + 1;
    var xCenter = x + (ATE_Styles.Playback.GUI_Width * 0.5) + 1;
    var subSegmentWidth = ate.GetGUI_RealSubSegmentWidth();
    
    //////
    var offset = subSegmentWidth / 2.0;
    //////
    var realPositionX = (mouseX + offset) - xCenter;
    var realTimelineSize = (ate.GetGUI_RealSegmentWidth() * animationSeconds);
    var segmentsBySeconds = animationSeconds * ATE_Styles.Default_SubSegments;
    var inSegment = Math.floor((realPositionX) / subSegmentWidth);
    inSegment = inSegment < 0 ? 0 : inSegment;
    inSegment = inSegment > segmentsBySeconds ? segmentsBySeconds : inSegment;
    
    return inSegment;
}

ATE_Engine.SetStylesInput_Time = function(selector, isDisabled) {
    selector.css("text-align", "center");
    selector.css("font-size", "12px");
    selector.css("padding", "1px");
    selector.css("width", "36px");
    selector.css("margin", "5px 0px 0px");
    selector.css("outline", "none");
    selector.css("border-width", "0px 0px 1px");
    selector.css("border-top-style", "initial");
    selector.css("border-right-style", "initial");
    selector.css("border-bottom-style", "dotted");
    selector.css("border-left-style", "initial");
    selector.css("border-top-color", "initial");
    selector.css("border-right-color", "initial");
    selector.css("border-bottom-color", "rgb(184, 184, 184)");
    selector.css("border-left-color", "initial");
    selector.css("border-image", "initial");
    selector.css("background", "none");
    selector.css("color", "rgb(184, 184, 184)");
    
    if (isDisabled !== undefined){
        selector.attr('disabled', isDisabled);
    }
}

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
    this.GetLayerData = function () { return mKeyframes; }
    
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
        
        mSelectOptionSelector = ATE_Layer.CreateTweenSelect(ATE_PlaybackEngine.TweenType);
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
    
    this.ReconstructFrom = function(data) {
        mKeyframes = data;
    }
    
    this.OnPlayOrPause = function(isPlaying) {
        if (isPlaying) {
            // remove listeners
            mLayerValueSelector.off();
            mSelectOptionSelector.off();
            mButtonKeyframeAddSelector.off();
            
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
    
    this.SetKeyframe = function (time, value) {
        var resultKeyframe = mSelf.GetKeyframeByTime(time);
        
        if (resultKeyframe) {
            resultKeyframe.Value = value;
        }
        else {
            resultKeyframe = {
                Name: mLayerName,
                Time: time,
                DataType: ATE_PlaybackEngine.DataTypes.Numeric,
                Value: value,
                TweenType: ATE_PlaybackEngine.TweenType.None
            };
            
            mKeyframes.push(resultKeyframe);
            
            mKeyframes.sort(function(a, b) {
              return a.Time - b.Time;
            });
        }
        
        // change
        if (mATE.GetOnChangeCallback()) { mATE.GetOnChangeCallback()(); }
        
        return resultKeyframe;
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
        
        // change
        if (mATE.GetOnChangeCallback()) { mATE.GetOnChangeCallback()(); }
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
    
    this.GetKeyframeByTime = function(time) {
        return ATE_PlaybackEngine.GetKeyframeByTime(mKeyframes, time);
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
    
    this.GetKeyFrameRenderData = function(keyframe) {
        var layerHeight = ATE_Styles.AC_TimelineLayerHeight;
        var segmentWidth = mATE.GetGUI_RealSegmentWidth();
        
        var x = (keyframe.Time * segmentWidth) + mOffsetX_Img + ATE_Styles.Timeline.OffsetX;
        var y = (mCurrentIndex * layerHeight) + ATE_Styles.AC_TimelineHeight + 
            mOffsetY_Img + ATE_Styles.Timeline.OffsetY;
        
        return {
            X: x,
            Y: y,
            Width: mDiamondRealWidth,
            Height: mDiamondRealHeight,
            Img: mDiamondImg,
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
            var keyframe = ATE_PlaybackEngine.GetKeyframeByTime(mKeyframes, currentTime);
            
            switch (editControlState) {
                case ATE_Layer.EditControls.Value_Editable:
                    mLayerValueSelector.css('display', "block");
                    mLayerValueSelector.removeAttr('disabled');
                    mLayerValueSelector.off().on('change paste keyup', OnValueChange);
                    
                    mSelectOptionSelector.css("display", "none");
                    mSelectOptionSelector.off();
                    
                    mButtonKeyframeAddSelector.css("display", "block");
                    mButtonKeyframeAddSelector.off().on('click', OnRemoveKeyframeButtonClick);
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
        var isPlaying = mATE.GetPlaybackController().GetIsPlaying();
        
        if (!isPlaying) {
            var currentTime = mATE.GetPlaybackController().GetCurrentTime();
            var keyframe = ATE_PlaybackEngine.GetKeyframeByTime(mKeyframes, currentTime);
            
            if (keyframe) {
                var selectValue = $(this).val();
                
                switch (keyframe.DataType) {
                    case ATE_PlaybackEngine.DataTypes.Numeric:
                        keyframe.Value = parseFloat(selectValue);
                        break;
                    default:
                        // code
                        break;
                }
                
                // change
                if (mATE.GetOnChangeCallback()) { mATE.GetOnChangeCallback()(); }
            }
        }
    }
    
    var OnTweenChange = function(evt) {
        var selectValue = parseInt($(this).val());
        var currentTime = mATE.GetPlaybackController().GetCurrentTime();
        var keyframe = ATE_PlaybackEngine.GetKeyframeByTime(mKeyframes, currentTime);
        
        if (keyframe) {
            keyframe.TweenType = selectValue;
            
            // change
            if (mATE.GetOnChangeCallback()) { mATE.GetOnChangeCallback()(); }
        }
    }
    
    this.UpdateFromPlayback = function(time, dt, isEditable) {
        isEditable = isEditable !== undefined ? isEditable : false;
        
        var keyframe = ATE_PlaybackEngine.GetKeyframeByTime(mKeyframes, time);
        var keyframes = ATE_PlaybackEngine.GetKeyframesBetween(mKeyframes, time);
        
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
            
            // Playback Engine
            resultValue = ATE_PlaybackEngine.ByLayer(mKeyframes, time);
            
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
function ATE_Playback(ate) {
    var mSelf = this;
    var mATE = ate;
    
    this.ctx = mATE.ctx;
    
    var mIsPlaying = false;
    var mFPS = 0;
    var mCurrentTime = 0;
    var mPlayingSpeed = 1 / ATE_Styles.Playback.DefaultTime;
    var mInputCurrentTimeSelector = mATE.GetInputCurrentTimeSelector();
    
    // variables: not playing
    var mIsMouseDown = false;
    var mMousePos = false;
    
    this.GetIsPlaying = function() { return mIsPlaying; }
    this.GetCurrentTime = function() { return mCurrentTime; }
    this.GetFPS = function() { return mFPS; }
    
    this.Initialize = function() {
        
    }
    
    this.ConfigureFPS = function(fps, noChange) {
        mFPS = fps;
        
        var deltaTime = 1000.0 / fps;
        mPlayingSpeed = (1 / ATE_Styles.Playback.DefaultTime) / deltaTime;
        
        if (noChange === undefined) {
            // change
            if (mATE.GetOnChangeCallback()) { mATE.GetOnChangeCallback()(); }
        }
    }
    
    this.OnMouseOut = function(mousePos) {
        if (!mIsPlaying) {
            mIsMouseDown = false;
        }
    }
    
    this.OnMouseMove = function(mousePos) {
        mMousePos = mousePos;
    }
    
    this.OnMouseUp = function(mousePos) {
        if (!mIsPlaying) {
            mIsMouseDown = false;
        }
    }
    
    this.OnMouseDown = function(mousePos) {
        if (!mIsPlaying) {
            var scrollX = mATE.GetScrollX();
            var offsetX = ATE_Styles.Timeline.OffsetX;
            var animationSeconds = mATE.GetAnimationSeconds();
            var segmentWidth = mATE.GetGUI_RealSegmentWidth();
            
            var x = offsetX;
            var y = 0;
            var width = (segmentWidth * animationSeconds);
            var height = mATE.GetHeight() + ATE_Styles.AC_TimelineHeight;
            
            var isHitted = ATE_Util.HitTestByPoint(x, y, width, height, 
                mousePos.x, mousePos.y);
        
            if (isHitted) {
                mIsMouseDown = true;
            }
        }
    }
    
    this.PlayOrPause = function() {
        mIsPlaying = !mIsPlaying;
        
        // Layers: OnPlayOrPause
        var layers = mATE.GetLayers();
        for (var i = 0; i < layers.length; i++) { layers[i].OnPlayOrPause(mIsPlaying); }
    }
    
    this.Stop = function() {
        mIsPlaying = false;
        mCurrentTime = 0;
        
        // Layers: OnPlayOrPause
        var layers = mATE.GetLayers();
        for (var i = 0; i < layers.length; i++) { layers[i].OnStop(); }
        //Update
        mInputCurrentTimeSelector.val(ATE_Util.FormatTimeAsSeconds(mCurrentTime * 1000));
    }
    
    this.Update = function(dt) {
        var animationSeconds = mATE.GetAnimationSeconds();
        var changedTime = false;
        
        if (mIsPlaying) {
            if (mCurrentTime >= animationSeconds) { mCurrentTime = 0; }
            else {
                mCurrentTime += mPlayingSpeed * dt;
                mCurrentTime = mCurrentTime < 0 ? 0 : mCurrentTime;
                mCurrentTime = mCurrentTime > animationSeconds ? animationSeconds : mCurrentTime;
            }
            
            changedTime = true;
        }
        else {
            if (mIsMouseDown) {
                var scrollX = mATE.GetScrollX();
                var inSegment = ATE_Engine.GetSegment(mATE, mMousePos.x - scrollX, mMousePos.y);
                var newTime = inSegment / ATE_Styles.Default_SubSegments;
                
                if (mCurrentTime !== newTime) {
                    mCurrentTime = newTime;
                    mCurrentTime = mCurrentTime < 0 ? 0 : mCurrentTime;
                    mCurrentTime = mCurrentTime > animationSeconds ? animationSeconds : mCurrentTime;
                    
                    changedTime = true;
                }
            }
        }
        
        var layers = mATE.GetLayers();
        var isEditable = !mIsPlaying && mIsMouseDown;
            
        if (mIsPlaying || mIsMouseDown) {
            for (var i = 0; i < layers.length; i++) {
                layers[i].UpdateFromPlayback(mCurrentTime, dt, isEditable);
            }
        }
        
        mSelf.Draw(dt, changedTime);
    }
    
    this.Draw = function(dt, changedTime) {
        var ctx = mSelf.ctx;
        
        var scrollX = mATE.GetScrollX();
        var segmentWidth = mATE.GetGUI_RealSegmentWidth();
        var subSegmentWidth = mATE.GetGUI_RealSubSegmentWidth();
        var x = ((ATE_Styles.Timeline.OffsetX + (mCurrentTime * segmentWidth)) - 
            subSegmentWidth - (ATE_Styles.Playback.GUI_Width / 4) + 1) + scrollX;
        var y = ATE_Styles.Timeline.OffsetY;
        var xCenter = x + (ATE_Styles.Playback.GUI_Width * 0.5) + 1;
        
        // Draw box
        ctx.beginPath();
        ctx.fillStyle = ATE_Styles.Playback.GUI_BackgroundColor;
        ctx.fillRect(x + ATE_Styles.Playback.GUI_TextTimeOffset.X, y, 
            ATE_Styles.Playback.GUI_Width, ATE_Styles.Playback.GUI_Height);
        ctx.closePath();
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(xCenter, y);
        ctx.lineTo(xCenter, mATE.GetHeight());
        ctx.lineWidth = 1;
        ctx.strokeStyle = ATE_Styles.Playback.GUI_LineColor;
        ctx.stroke();
        ctx.closePath();
        
        // Draw time
        ctx.font = ATE_Styles.Playback.GUI_TextStyle;
        ctx.fillStyle = ATE_Styles.Playback.GUI_TextColor;
        ctx.textAlign = "center";
        ctx.fillText(
            ATE_Util.FormatTime((mCurrentTime + ATE_PlaybackEngine.EPSILON) * 1000, 2, true), 
            xCenter,
            y + ATE_Styles.Playback.GUI_Height + ATE_Styles.Playback.GUI_TextTimeOffset.Y);
            
        if (changedTime) {
            // set the GUI current time 
            mInputCurrentTimeSelector.val(ATE_Util.FormatTimeAsSeconds((mCurrentTime + ATE_PlaybackEngine.EPSILON) * 1000));
        }
    }
}
function ATE_Segment(ate) {
    
    var mSelf = this;
    var mATE = ate;
    
    this.ctx = mATE.ctx;
    this.FirstSegment = false;
    this.LastSegment = false;
    
    var mActualSecond = 0;
    var mActualSecondString = "";
    var mLastSecondString = "";
    
    this.Initialize = function(second) {
        mActualSecond = second;
        mActualSecondString = ATE_Util.FormatTime(mActualSecond * 1000, 2);
        mLastSecondString = ATE_Util.FormatTime((mActualSecond + 1) * 1000, 2);
    }
    
    this.Update = function(dt) {
        mSelf.Draw(dt);
    }
    
    this.Draw = function(dt) {
        var ctx = mSelf.ctx;
        
        var tsWidth = ATE_Styles.AC_TimelineSegmentWidth;
        var subSegments = mATE.GetSubSegments() + 1;
        var subSegmentWidth = (tsWidth / subSegments);
        
        var scrollX = mATE.GetScrollX();
        var initX = (mActualSecond * tsWidth) - (mActualSecond !== 0 ? subSegmentWidth * mActualSecond : 0);
        var initY = ATE_Styles.AC_TimelineHeight;
        
        for (var i = 0; i < subSegments; i++) {
            var x = Math.round(initX + (i * subSegmentWidth)) + ATE_Styles.Timeline.OffsetX + scrollX;
            var y = Math.round(initY) + ATE_Styles.Timeline.OffsetY;
            var isLimit = i === 0 || (i === subSegments - 1);
            var subSegmentHeight = isLimit
                ? ATE_Styles.AC_TimelineSubSegmentLimitsHeight
                : ATE_Styles.AC_TimelineSubSegmentHeight;
            var canRenderTime = i === 0 || (i === subSegments - 1) && mSelf.LastSegment;
            
            // Draw second and milliseconds lines
            ctx.beginPath()
            ctx.moveTo(x, y);
            ctx.lineTo(x, y - subSegmentHeight);
            ctx.lineWidth = 1;
            ctx.strokeStyle = ATE_Styles.AC_TimelineSubSegment_Color;
            ctx.stroke();
            ctx.closePath()
            
            // Draw background line
            ctx.beginPath()
            ctx.moveTo(x, y);
            ctx.lineTo(x, mATE.GetHeight() - ATE_Styles.ScrollbarHeight);
            ctx.lineWidth = 1;
            ctx.strokeStyle = isLimit ? ATE_Styles.AC_TimelineSubSegment_Color : ATE_Styles.CStroke_Color;
            ctx.stroke();
            ctx.closePath()
            
            if (canRenderTime) {
                var offsetTextY = 10;
                var text = ((i === subSegments - 1) && mSelf.LastSegment) ? mLastSecondString : mActualSecondString;
                
                ctx.font = ATE_Styles.AC_TimelineSubSegment_TextStyle;
                ctx.fillStyle = ATE_Styles.Font_Color;
                ctx.textAlign = /*mActualSecond === 0 ? "left" : */"center";
                ctx.fillText(
                    text, 
                    x,
                    y - ATE_Styles.AC_TimelineSubSegmentLimitsHeight - offsetTextY);
            }
        }
    }
    
    this.Destroy = function() {
        mSelf.ctx = undefined;
        mSelf = undefined;
        mATE = undefined;
    }
}