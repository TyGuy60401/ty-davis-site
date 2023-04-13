function buildCalendar(month, year, divID) {
    let calendarTableDiv = document.querySelector('#calendar-div-template');
    let parentDiv = document.querySelector('#'+divID);
    parentDiv.innerHTML = calendarTableDiv.innerHTML;
    let calendarTable = parentDiv.firstElementChild;
    
    let day = new Date(2023, 2, 12);
    let currentMonth = day.getMonth();
    day.setDate(1);
    dayOfWeek = day.getDay();
    day.setDate(1-dayOfWeek);
    let dayNum;
    let classString;

    for (var i=0, row; row = calendarTable.rows[i]; i++) {
        for (var j=0, cell; cell = row.cells[j]; j++) {
            dayNum = day.getDate();

            if (day.getMonth() == currentMonth) {
                classString = "'on-month'";
            } else {
                classString = "'off-month'";
            }
            cell.innerHTML = "<a href='#' class=" + classString + ">" + dayNum + "</a>";

            day.setDate(dayNum + 1);
        }
    }
    if (day.getMonth() == currentMonth) {
        console.log("We need another row");
    }
}