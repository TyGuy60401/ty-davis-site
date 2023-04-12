function buildCalendar(month, year, divID) {
    let calendarTableDiv = document.querySelector('#calendar-div-template');
    let parentDiv = document.querySelector('#'+divID);
    parentDiv.innerHTML = calendarTableDiv.innerHTML;
    let calendarTable = parentDiv.firstElementChild;
    for (var i=0, row; row = calendarTable.rows[i]; i++) {
        for (var j=0, cell; cell = row.cells[j]; j++) {
            cell.innerHTML = i*7+j;
        }
    }
}