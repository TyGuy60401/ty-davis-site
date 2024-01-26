let distInput = document.getElementById("distance");

distInput.addEventListener('input', function (evt) {
        console.log(this.value);
})

function validateInput() {
        let time = document.getElementById('time').value;
        let dist = document.getElementById('distance').value;
        let unit = document.getElementById('unit').value;

        if (time == '' || dist == '') {
                return false;
        }
        return true;
}

function fillSplits() {
        if (!validateInput()) {
                console.log("Fill in the required fields");
                return;
        }
        let time = document.getElementById('time').value;
        let dist = document.getElementById('distance').value;
        let unit = document.getElementById('unit').value;

        let splitDist = document.getElementById('splitDist').value;
        let splitUnit = document.getElementById('splitUnit').value;

        let splits = getSplits(time, dist, unit, {'dist': splitDist, 'unit': splitUnit});

        let splitsTableDiv = document.getElementById('splitsTableDiv');
        splitsTableDiv.innerHTML = "";
        let splitsTable = document.createElement('table');
        splitsTableDiv.appendChild(splitsTable);

        // let splitsTable = document.getElementById('splitsTable');
        let headerRow = splitsTable.insertRow();
        let splitHead = headerRow.insertCell();
        splitHead.innerHTML = 'Split';
        splitHead.colSpan = 2;
        splitHead.className = 'table-header'
        let timeHead = headerRow.insertCell();
        timeHead.innerHTML = 'Time';
        timeHead.className = 'table-header'
        splits.forEach( (spl) => {
                let newRow = splitsTable.insertRow();

                let distCell = newRow.insertCell();
                distCell.innerHTML = spl.dist;
                distCell.className = 'dist-cell';
                let unitCell = newRow.insertCell();
                unitCell.innerHTML = spl.unit;
                unitCell.className = 'unit-cell';
                let timeCell = newRow.insertCell();
                timeCell.innerHTML = secToString(spl.time);

                // console.log(secToString(spl.time), spl.dist, spl.unit);
        })
}
