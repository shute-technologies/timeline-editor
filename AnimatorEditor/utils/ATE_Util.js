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

ATE_Util.DeepClone = function(item) {
    return JSON.parse(JSON.stringify(item));
}
