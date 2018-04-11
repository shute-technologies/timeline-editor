function ATE_PlaybackEngine() {
    var mSelf = this;
    var mAnimationData = undefined;
    
    var mFPS;
    var mAnimationSeconds;
    var mAnimationSecondsToPlay;
    
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
            var resultValue = ATE_PlaybackEngine.ByLayer(layerObj.Data, 
                mCurrentTime, layerObj.IsInterpolable);
            
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
            
            var lastKeyframe = ATE_PlaybackEngine.GetLastKeyframeInAnimation(mSelf.Animations);
            mAnimationSecondsToPlay = lastKeyframe.Time === 0 ? mAnimationSeconds : lastKeyframe.Time;
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
            if (mCurrentTime >= mAnimationSecondsToPlay) { mCurrentTime = 0; }
            else {
                mCurrentTime += mPlayingSpeed * dt;
                mCurrentTime = mCurrentTime < 0 ? 0 : mCurrentTime;
                mCurrentTime = mCurrentTime > mAnimationSecondsToPlay ? mAnimationSecondsToPlay : mCurrentTime;
            }
            
            for (var i = 0; i < mAnimationData.LayerCount; i++) {
                var layerObj = mAnimationData.Layers[i];
                
                var layerName = layerObj.Name;
                var resultValue = ATE_PlaybackEngine.ByLayer(layerObj.Data, 
                    mCurrentTime, layerObj.IsInterpolable);
                
                this.Animations[layerName] = resultValue;
            }
        }
    }
}

// Configurable
ATE_PlaybackEngine.EasingEquations = Easing.Equations;
ATE_PlaybackEngine.DefaultTime = 60;

ATE_PlaybackEngine.ByLayer = function(keyframesData, time, dataType, isInterpolable) {
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
            
            if (isInterpolable) {
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
                    switch (dataType) {
                        case ATE_PlaybackEngine.DataTypes.Numeric:
                            resultValue = functionObj(actualTime, kfiValue, kfeValue - kfiValue, 1);
                            break;
                        case ATE_PlaybackEngine.DataTypes.Color:
                            resultValue = ATE_Util.DeepClone(resultValue);
                            resultValue.r = functionObj(actualTime, kfiValue.r, kfeValue.r - kfiValue.r, 1);
                            resultValue.g = functionObj(actualTime, kfiValue.g, kfeValue.g - kfiValue.g, 1);
                            resultValue.b = functionObj(actualTime, kfiValue.b, kfeValue.b - kfiValue.b, 1);
                            resultValue.a = functionObj(actualTime, kfiValue.a, kfeValue.a - kfiValue.a, 1);
                            break;
                    }
                }
            }
            else {
               switch (dataType) {
                    case ATE_PlaybackEngine.DataTypes.Boolean:
                        resultValue = Math.floor(actualTime) >= 1 ? kfeValue : kfiValue;
                        break;
                } 
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

ATE_PlaybackEngine.GetLastKeyframeInAnimation = function(animationData) {
    var result = {
        Layer: undefined,
        Keyframe: undefined,
        Time: 0
    };
    
    for (var i = 0; i < animationData.length; i++) {
        var layer = animationData[i];
        var layerKeyframes = layer.GetLayerData();
        var lastKeyframe = layerKeyframes.length > 0 ? layerKeyframes[layerKeyframes.length - 1] : undefined;
        
        if (lastKeyframe && result.Time < lastKeyframe.Time) {
            result.Layer = layer;
            result.Keyframe = lastKeyframe;
            result.Time = lastKeyframe.Time;
        }
        
    }
    
    return result;
}

ATE_PlaybackEngine.EPSILON = 0.001;

ATE_PlaybackEngine.DataTypes = {
  Numeric: 1,
  Boolean: 2,
  Image: 3,
  Sound: 4,
  Material: 5,
  Font: 5,
  Color: 6,
  String: 7
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