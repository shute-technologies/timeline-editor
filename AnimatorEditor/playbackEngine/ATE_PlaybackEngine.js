function ATE_PlaybackEngine() { }

// Configurable
ATE_PlaybackEngine.EasingEquations = Easing.Equations;

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
                case ATE_Layer.TweenType.EaseLinear:    functionObj = ATE_PlaybackEngine.EasingEquations.easeLinear; break;
                case ATE_Layer.TweenType.EaseInQuad:    functionObj = ATE_PlaybackEngine.EasingEquations.easeInQuad; break;
                case ATE_Layer.TweenType.EaseOutQuad:   functionObj = ATE_PlaybackEngine.EasingEquations.easeOutQuad; break;
                case ATE_Layer.TweenType.EaseInOutQuad: functionObj = ATE_PlaybackEngine.EasingEquations.easeInOutQuad; break;
                case ATE_Layer.TweenType.EaseInCubic:    functionObj = ATE_PlaybackEngine.EasingEquations.easeInCubic; break;
                case ATE_Layer.TweenType.EaseOutCubic:   functionObj = ATE_PlaybackEngine.EasingEquations.easeOutCubic; break;
                case ATE_Layer.TweenType.EaseInOutCubic: functionObj = ATE_PlaybackEngine.EasingEquations.easeInOutCubic; break;
                case ATE_Layer.TweenType.EaseInSine:    functionObj = ATE_PlaybackEngine.EasingEquations.easeInSine; break;
                case ATE_Layer.TweenType.EaseOutSine:   functionObj = ATE_PlaybackEngine.EasingEquations.easeOutSine; break;
                case ATE_Layer.TweenType.EaseInOutSine: functionObj = ATE_PlaybackEngine.EasingEquations.easeInOutSine; break;
                case ATE_Layer.TweenType.EaseInExpo:    functionObj = ATE_PlaybackEngine.EasingEquations.easeInExpo; break;
                case ATE_Layer.TweenType.EaseOutExpo:   functionObj = ATE_PlaybackEngine.EasingEquations.easeOutExpo; break;
                case ATE_Layer.TweenType.EaseInOutExpo: functionObj = ATE_PlaybackEngine.EasingEquations.easeInOutExpo; break;
                case ATE_Layer.TweenType.EaseInElastic:    functionObj = ATE_PlaybackEngine.EasingEquations.easeInElastic; break;
                case ATE_Layer.TweenType.EaseOutElastic:   functionObj = ATE_PlaybackEngine.EasingEquations.easeOutElastic; break;
                case ATE_Layer.TweenType.EaseInOutElastic: functionObj = ATE_PlaybackEngine.EasingEquations.easeInOutElastic; break;
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
        
        if (keyframe && (keyframe.Time >= (time - ATE_Engine.EPSILON) && keyframe.Time <= (time + ATE_Engine.EPSILON))) {
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