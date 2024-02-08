const MILE_STRINGS = ['mi', 'mile', 'miles']
const KM_STRINGS = ['km', 'kilometer', 'kilometre']
const METER_STRINGS = ['m', 'meter', 'metre']

const KM_CONVERSION = 1.609344
const METER_CONVERSION = 1609.344


function secToString(sec) {
        let hrs = Math.floor(sec / 3600);
        let mins = Math.floor((sec - hrs * 3600) / 60);
        let minsStr = mins.toString().padStart(2, '0');
        let secs = (sec - hrs * 3600 - mins * 60).toFixed(2);
        let secsStr = secs.split('.')[0].padStart(2, '0') + (secs.split('.')[1] != '00' ? '.' + secs.split('.')[1] : '');

        let res = `${hrs}:${minsStr}:${secsStr}`;
        if (hrs == 0) {
                res = `${mins}:${secsStr}`;
        }
        return res;
}

function stringToSec(s) {
        let sSplit = s.split(':');
        let format = sSplit.length > 2 ? 'hms' : 'ms';
        let sec = parseFloat(sSplit[0] * 3600 + parseInt(sSplit[1]) * 60 + parseFloat(sSplit[2]));
        if (format == 'ms') {
                sec = parseFloat(sSplit[0] * 60 + parseFloat(sSplit[1]));
        }
        return sec;
}

function paceFromTimeDist(t, d, u='mi') {
        let sec = stringToSec(t);
        console.log(sec);
        let paceSec;
        if (MILE_STRINGS.includes(u)) {
                paceSec = sec / d;
        } else if (KM_STRINGS.includes(u)) {
                paceSec = sec * KM_CONVERSION / d;
        } else if (METER_STRINGS.includes(u)) {
                paceSec = sec * METER_CONVERSION / d;
        }
        let pace = secToString(paceSec);
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
        if (typeof p == 'string') {
                paceSec = stringToSec(p);
        }
        
        let totalSec = paceSec * distMiles;
        return secToString(totalSec);
}

function distFromTimePace(t, p) {
        let paceSec = stringToSec(p);
        let totalMiles = 1 / paceSec * stringToSec(t);
        return totalMiles * METER_CONVERSION;

}

function getSplits(t, d, u='mi', intvl=undefined) {
        intvl = intvl ? intvl : {'dist': 400, 'unit': 'm'};
        let pace = stringToSec(paceFromTimeDist(t, d, u=u));

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

        let totalSec = stringToSec(t);
        let splitSec = splitTime;

        let splits = [];

        let i = 1;
        while (totalSec - splitSec > 0.1) {
                splits.push({'time': splitSec, 'dist': i * intvl.dist,'unit': intvl.unit});
                i++;
                splitSec = splitTime * i;
                if (i == 100) {
                        break;
                }
        }
        splits.push({'time': stringToSec(t), 'dist': d, 'unit': u});

        return splits;
}

function testStuff() {
        console.log(getSplits('14:10', 5, 'km', {'dist': 400, 'unit': 'm'}));
}

