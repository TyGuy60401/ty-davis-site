function buildCalendar(divID) {
    let calendarTableDiv = document.querySelector('#calendar-div-template');
    let parentDiv = document.querySelector('#'+divID);
    parentDiv.innerHTML = calendarTableDiv.innerHTML;
    let calendarTable = parentDiv.firstElementChild;
    console.log(calendarTable);
    
    let day = new Date();
    let currentMonth = day.getMonth();
    day.setDate(1);
    dayOfWeek = day.getDay();
    day.setDate(1-dayOfWeek);
    
    let numRows = 5;
    day.setDate(day.getDate() + 35);
    if (day.getMonth() == currentMonth) {
        numRows = 6;
        console.log("We need another row ... 1")
    }
    day.setDate(day.getDate() - 35);
    
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