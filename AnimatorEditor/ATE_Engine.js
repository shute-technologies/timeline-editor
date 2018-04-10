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
    var mOnPlayOrPauseCallback = undefined;
    var mOnStopCallback = undefined;
    var mOnChangeCallback = undefined;
    
    this.GetButton_PlayOrPause = function() { return mButton_PlayOrPause; }
    this.GetButton_Record = function() { return mButton_Record; }
    this.GetButton_Stop = function() { return mButton_Stop; }
    
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
    this.SetOnPlayOrPauseCallback = function(callback) { mOnPlayOrPauseCallback = callback; }
    this.SetOnStopCallback = function(callback) { mOnStopCallback = callback; }
    
    this.SetOnChangeCallback = function(callback) { mOnChangeCallback = callback; }
    this.GetOnChangeCallback = function(callback) { return mOnChangeCallback; }
    
    this.GetAnimationData = function() {
        var resultData = ATE_Engine.DefaultAnimationData();
        resultData.AnimationSeconds = mAnimationSeconds;
        resultData.FPS = mPlaybackController.GetFPS();
        resultData.LayerCount = mLayers.length;
        
        for (var i = 0; i < mLayers.length; i++) {
            var layerObj = mLayers[i];

            resultData.Layers.push({
                Data: layerObj.GetLayerData(),
                Name: layerObj.GetLayerName(),
                DataType: layerObj.GetLayerDataType(),
                IsInterpolable: layerObj.GetLayerIsInterpolable(),
                ExtraParams: layerObj.GetExtraLayerParams()
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
                
                if (mOnPlayOrPauseCallback) { mOnPlayOrPauseCallback(mPlaybackController.GetIsPlaying()); }
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
                
                if (mOnStopCallback) { mOnStopCallback(); }
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
    
    this.AddLayer = function(name, time, value, dataType, extraLayerParams, extraKeyframeParams) {
        var result = {
            Layer: undefined,
            Keyframe: undefined
        };
        var layerResult = mSelf.GetLayer(name);
        
        if (layerResult.Exists) {
            result.Layer = layerResult.Layer;
            result.Layer.SetExtraLayerParams(extraLayerParams);
            result.Keyframe = layerResult.Layer.SetKeyframe(time, value, extraKeyframeParams);
        }
        else {
            var layer = new ATE_Layer(mSelf);
            layer.Initialize(name, dataType);
            layer.SetExtraLayerParams(extraLayerParams);
            
            // now first add it to the array
            mLayers.push(layer); 
            
            result.Layer = layer;;
            result.Keyframe = layer.SetKeyframe(time, value, extraKeyframeParams);
        }
        
        return result;
    }
    
    this.AddLayerFrom = function(layerData) {
        var layer = new ATE_Layer(mSelf);
        layer.Initialize(layerData.Name, layerData.DataType, layerData.IsInterpolable);
        layer.SetExtraLayerParams(layerData.ExtraParams);
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

ATE_Engine.IgnoreExtraParams = 999999019.091;
ATE_Engine.RemoveExtraParams = 999999019.092;

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
