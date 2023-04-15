function secondsFromTimeString(timeString) {
    let strs = timeString.split(':')
    if (strs.length == 3) {
        return parseInt(strs[0]) * 3600 + parseInt(strs[1]) * 60 + parseFloat(strs[2]); 
    } else if(strs.length == 2) {
        return parseInt(strs[0]) * 60 + parseFloat(strs[1]);
    }
}
function timeStringFromSeconds(seconds, numDecimals=2) {
    let hour = Math.floor(seconds / 3600)
    let min = Math.floor(seconds % 3600 / 60)
    let sec = seconds % 60
    let secString = (Math.round(sec * 100) / 100).toFixed(numDecimals).toString();
    let addNum = 3;
    if (numDecimals == 0) {
        addNum = 2;
    }
    if (hour == 0) {
        return min + ':' + secString.padStart(numDecimals + addNum, '0');
    } else {
        return hour + ':' + min.toString().padStart(2, '0') + ':' + secString;
    }
}