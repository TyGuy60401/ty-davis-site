const MILE_STRINGS = ['mi', 'mile', 'miles']
const KM_STRINGS = ['km', 'kilometer', 'kilometre']
const METER_STRINGS = ['m', 'meter', 'metre']

const KM_CONVERSION = 1.609344
const METER_CONVERSION = 1609.344


function secToString(sec, decimals=2) {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec - hrs * 3600) / 60);
    const minsStr = mins.toString().padStart(2, '0');
    let secs;
    let secsStr;
    if (decimals === 0) {
        secs = Math.round(sec - hrs * 3600 - mins * 60)
        secsStr = secs.toString().padStart(2, '0');
    } else {
        secs = (sec - hrs * 3600 - mins * 60).toFixed(decimals);
        secsStr = secs.split('.')[0].padStart(2, '0') + (secs.split('.')[1] !== '00' ? `.${secs.split('.')[1]}` : '');
    }

    let res = `${hrs}:${minsStr}:${secsStr}`;
    if (hrs === 0) {
        res = `${mins}:${secsStr}`;
    }
    return res;
}

function stringToSec(s) {
    const sSplit = s.split(':');
    const format = sSplit.length > 2 ? 'hms' : 'ms';
    let sec = parseFloat(sSplit[0] * 3600 + parseInt(sSplit[1]) * 60 + parseFloat(sSplit[2]));
    if (format === 'ms') {
        sec = parseFloat(sSplit[0] * 60 + parseFloat(sSplit[1]));
    }
    return sec;
}

function paceFromTimeDist(t, d, u='mi') {
    const sec = stringToSec(t);
    console.log(sec);
    let paceSec;
    if (MILE_STRINGS.includes(u)) {
        paceSec = sec / d;
    } else if (KM_STRINGS.includes(u)) {
        paceSec = sec * KM_CONVERSION / d;
    } else if (METER_STRINGS.includes(u)) {
        paceSec = sec * METER_CONVERSION / d;
    }
    const pace = secToString(paceSec);
    return pace;
}

function timeFromPaceDist(p, d, u='mi') {
    let distMiles;
    if (MILE_STRINGS.includes(u)) {
        distMiles = d;
    } else if (KM_STRINGS.includes(u)) {
        distMiles = d / KM_CONVERSION;
    } else if (METER_STRINGS.includes(u)) {
        distMiles = d / METER_CONVERSION;
    }

    let paceSec = p;
    if (typeof p === 'string') {
        paceSec = stringToSec(p);
    }
    
    const totalSec = paceSec * distMiles;
    return secToString(totalSec);
}

function distFromTimePace(t, p) {
    const paceSec = stringToSec(p);
    const totalMiles = 1 / paceSec * stringToSec(t);
    return totalMiles * METER_CONVERSION;

}

function getSplits(t, d, u='mi', intvl=undefined) {
    intvl = intvl ? intvl : {'dist': 400, 'unit': 'm'};
    const pace = stringToSec(paceFromTimeDist(t, d, u));

    let splitTime = pace * intvl.dist;
    if (MILE_STRINGS.includes(intvl.unit)) {
        unit = 'mi';
    } else if (KM_STRINGS.includes(intvl.unit)) {
        unit = 'km';
        splitTime = (pace/KM_CONVERSION * intvl.dist)
    } else if (METER_STRINGS.includes(intvl.unit)) {
        unit = 'm';
        splitTime = (pace/METER_CONVERSION * intvl.dist)
    }

    const totalSec = stringToSec(t);
    let splitSec = splitTime;

    const splits = [];

    let i = 1;
    while (totalSec - splitSec > 0.1) {
        splits.push({time: splitSec, dist: i * intvl.dist, unit: intvl.unit});
        i++;
        splitSec = splitTime * i;
        if (i === 100) {
            break;
        }
    }
    splits.push({time: stringToSec(t), dist: d, unit: u});

    return splits;
}

function testStuff() {
    console.log(getSplits('14:10', 5, 'km', {dist: 400, unit: 'm'}));
}

