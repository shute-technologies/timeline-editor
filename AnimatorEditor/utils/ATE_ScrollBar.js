function ATE_ScrollBar(ate) {
    var mSelf = this;
    var mATE = ate;
    
    this.ctx = mATE.ctx;
    
    var mScrollBarSizeX;
    var mScrollBarSizeY;
    var mCurrentScrollY;
    //var mCurrentScrollY_InitDragging;
    var mPercentageScroll;
    
    var mIsMouseDown = false;
    var mMousePos = false;
    var mMousePos_Init = false;
    
    this.GetCurrentScrollY = function() { return mCurrentScrollY; }
    
    this.Initialize = function() {
        mCurrentScrollY = 0;
        mPercentageScroll = 0;
        mScrollBarSizeX = 14;
        mScrollBarSizeY = 30;
    }   
    
    this.OnMouseOut = function(mousePos) {
        mIsMouseDown = false;
    }
    
    this.OnMouseMove = function(mousePos) {
        mMousePos = mousePos;
    }
    
    this.OnMouseUp = function(mousePos) {
        mIsMouseDown = false;
    }
    
    this.OnMouseDown = function(mousePos) {
        var bgHeight = ATE_Styles.CanvasHeight - ATE_Styles.AC_TimelineHeight;
        var scrollHeightLimit = ATE_Styles.CanvasHeight - mScrollBarSizeY;
        
        var x = mATE.GetWidth() - ATE_Styles.AC_Width - mScrollBarSizeX;
        var y = ATE_Styles.AC_TimelineHeight + (mPercentageScroll * bgHeight) - (mScrollBarSizeY*0.5);
        y = y < (mScrollBarSizeY*2) ? (mScrollBarSizeY*2) : y;
        y = y > scrollHeightLimit ? scrollHeightLimit : y;
        
        var isHitted = ATE_Util.HitTestByPoint(x, y, mScrollBarSizeX, mScrollBarSizeY, 
            mMousePos.x, mMousePos.y);
        
        if (isHitted) {
            mIsMouseDown = true;
            //mCurrentScrollY_InitDragging = mCurrentScrollY;
            mMousePos_Init = mousePos;
        }
    }
    
    this.SetScroll = function(val) {
        var y = ATE_Styles.AC_TimelineHeight;
        var scrollHeightLimit = ATE_Styles.CanvasHeight - ATE_Styles.AC_TimelineHeight - mScrollBarSizeY;
        
        mCurrentScrollY = Math.round(val);
        mCurrentScrollY = mCurrentScrollY < 0 ? 0: mCurrentScrollY;
        //mCurrentScrollY = mCurrentScrollY > scrollHeightLimit ? scrollHeightLimit : mCurrentScrollY;
    }
    
    this.Update = function(dt) {
        var ctx = mSelf.ctx;
        
        var bgWidth = mScrollBarSizeX;
        var bgHeight = ATE_Styles.CanvasHeight - ATE_Styles.AC_TimelineHeight;
        var scrollHeightLimit = ATE_Styles.CanvasHeight - mScrollBarSizeY;
        var sizeX = mATE.GetGUI_RealSegmentWidth() * mATE.GetAnimationSeconds();
        var x = mATE.GetWidth() - ATE_Styles.AC_Width - bgWidth;
        var y = ATE_Styles.AC_TimelineHeight;
        
        if (mIsMouseDown) {
            var scrollHeight = mATE.GetGUILayers_ScrollHeight();
            var offset = mMousePos_Init.y - ATE_Styles.AC_TimelineHeight;
            var relativeY = (mMousePos.y - mMousePos_Init.y)
            
            mPercentageScroll = (offset + relativeY) / bgHeight;
            mPercentageScroll = mPercentageScroll < 0 ? 0 : mPercentageScroll;
            mPercentageScroll = mPercentageScroll > 1 ? 1 : mPercentageScroll;
            
            var scrollY = mPercentageScroll * (scrollHeight - bgHeight)
            
            mSelf.SetScroll(scrollY);
        }
        
        // draw bg
        ctx.fillStyle = "#6e6e6e";
        ctx.fillRect(x, y, bgWidth, bgHeight);
        
        // draw scroll bar
        var yScroll = y + (mPercentageScroll * bgHeight) - (mScrollBarSizeY*0.5);
        yScroll = yScroll < (mScrollBarSizeY*2) ? (mScrollBarSizeY*2) : yScroll;
        yScroll = yScroll > scrollHeightLimit ? scrollHeightLimit : yScroll;
        
        ctx.fillStyle = "#9e9e9e";
        ctx.fillRect(x + 2,  yScroll, bgWidth - 5, mScrollBarSizeY);
    }
}