function buildCalendar(divID, useOtherDate=null) {
    let parentDiv = document.querySelector('#'+divID);
    let day;

    if (useOtherDate != null) {
        let monthVal = document.querySelector('#' + divID + '-month-input').value;
        let yearVal = document.querySelector('#' + divID + '-year-input').value;
        day = new Date(Date.parse(monthVal + ' 1 ' + yearVal));
    } else {
        day = new Date();
    }

    parentDiv.innerHTML = "<table class='calendar'></table>";
    let calendarTable = parentDiv.firstElementChild;
    
    let currentMonth = day.getMonth();
    
    let tableHead = document.createElement("th");
    tableHead.setAttribute('colspan', '7');

    let monthInput = document.createElement("input");
    monthInput.setAttribute("style", "width:4em;");
    monthInput.setAttribute("placeholder", "Month");
    monthInput.setAttribute("id", divID + "-month-input");

    let yearInput = document.createElement("input");
    yearInput.setAttribute("style", "width:4em;");
    yearInput.setAttribute("placeholder", "Year");
    yearInput.setAttribute("type", "number");
    yearInput.setAttribute("id", divID + "-year-input");

    let calendarButton = document.createElement("button");
    calendarButton.innerHTML = "Go";
    calendarButton.setAttribute("onclick", "buildCalendar('" + divID + "', 'true')")

    monthInput.value = day.toLocaleString('default', { month: 'long'});
    yearInput.value = day.toLocaleString('default', {year: 'numeric'});

    tableHead.appendChild(monthInput);
    tableHead.appendChild(yearInput);
    tableHead.appendChild(calendarButton);
    calendarTable.appendChild(tableHead);

    day.setDate(1);
    dayOfWeek = day.getDay();
    day.setDate(1-dayOfWeek);
    
    let numRows = 5;
    day.setDate(day.getDate() + 35);
    if (day.getMonth() == currentMonth) {
        numRows = 6;
    }
    day.setDate(day.getDate() - 35);
    

    for (var ii=0; ii<numRows; ii++) {
        calendarTable.insertRow();
        row = calendarTable.rows[ii];
        for (var jj=0; jj<7; jj++) {
            row.insertCell();
        }
    }

    let dayNum;
    let classString;
    for (var i=0, row; row = calendarTable.rows[i]; i++) {
        for (var j=0, cell; cell = row.cells[j]; j++) {
            dayNum = day.getDate();

            if (day.getMonth() == currentMonth) {
                classString = "on-month";
            } else {
                classString = "off-month";
            }
            cell.innerHTML = "<a href='#' class='" + classString + "'>" + dayNum + "</a>";

            day.setDate(dayNum + 1);
        }
    }
}