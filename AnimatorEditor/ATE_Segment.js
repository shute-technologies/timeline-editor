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
        
        // Compute the real width
        //tsWidth = tsWidth + subSegmentWidth;
        //subSegmentWidth += subSegmentWidth / subSegments;
        
        var initX = (mActualSecond * tsWidth) - (mActualSecond !== 0 ? subSegmentWidth * mActualSecond : 0);
        var initY = ATE_Styles.AC_TimelineHeight;
        
        for (var i = 0; i < subSegments; i++) {
            var x = Math.round(initX + (i * subSegmentWidth)) + ATE_Styles.Timeline.OffsetX;
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
            ctx.lineTo(x, ATE_Styles.CanvasHeight);
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