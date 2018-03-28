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