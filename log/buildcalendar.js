selectedDay = new Date(2001, 5, 4);
function buildCalendar(divID, useOtherDate=null) {
    let parentDiv = document.querySelector('#'+divID);
    let day;
    let todayString = new Date().toDateString();

    if (useOtherDate == 'true') {
        let monthVal = document.querySelector('#' + divID + '-month-input').value;
        let yearVal = document.querySelector('#' + divID + '-year-input').value;
        day = new Date(Date.parse(monthVal + ' 1 ' + yearVal));
    } else if (useOtherDate == null) {
        day = new Date();
    } else {
        day = new Date(Date.parse(useOtherDate));
    }

    parentDiv.innerHTML = "<table class='calendar'></table>";
    let calendarTable = parentDiv.firstElementChild;
    
    let currentMonth = day.getMonth();
    
    let tableHead = document.createElement("th");
    tableHead.setAttribute('colspan', '7');

    let monthInput = document.createElement("select");
    // Add all of the months
    let monthsArray = ["January", "February", "March", "April",
                       "May", "June", "July", "August",
                       "September", "October", "November", "December"];
    for (const monthString in monthsArray) {
        monthOption = document.createElement("option");
        monthOption.value = monthsArray[monthString];
        monthOption.innerHTML = monthsArray[monthString];
        monthInput.appendChild(monthOption);
    }
    // monthInput.setAttribute("style", "text-align:left;width:5em;");
    monthInput.setAttribute("placeholder", "Month");
    monthInput.setAttribute("id", divID + "-month-input");

    let yearInput = document.createElement("input");
    yearInput.setAttribute("placeholder", "Year");
    yearInput.setAttribute("type", "number");
    yearInput.setAttribute("id", divID + "-year-input");

    let calendarButton = document.createElement("input");
    calendarButton.type = "button";
    calendarButton.defaultValue = "Go";
    calendarButton.onclick = function () {
        buildCalendar(divID, "true");
    }

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
    let dayMonth;
    for (var i=0, row; row = calendarTable.rows[i]; i++) {
        for (var j=0, cell; cell = row.cells[j]; j++) {
            dayNum = day.getDate();
            dayMonth = day.getMonth();
            day.setHours(0, 0, 0, 0);

            if (dayMonth == currentMonth) {
                classString = "on-month";
            } else {
                classString = "off-month";
            }
            let fileString = day.getFullYear().toString() + '-' + (day.getMonth() + 1).toString().padStart(2,'0') + '-' + dayNum.toString().padStart(2, '0');
            if (day.toDateString() == selectedDay.toDateString()) {
                cell.setAttribute('class', 'selected');
            }
            let cellInnerHTML;
            if (day.toDateString() == todayString) {
                cell.getAttribute('class')
                cell.setAttribute('class', cell.getAttribute('class') + ' today');
            }
            cell.innerHTML = "<a href='#' class='" + classString + "' onclick=\"buildLog('" + fileString + "')\">" + dayNum + "</a>";

            day.setDate(dayNum + 1);
        }

    }
    let buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'month-buttons';
    parentDiv.appendChild(buttonsDiv);

    let lastMonthButton = document.createElement('input');
    lastMonthButton.type = "button";
    day.setMonth(day.getMonth() - 2);
    let prevMonthString = day.toDateString();
    lastMonthButton.defaultValue = day.toLocaleString('default', { month: 'long'}) + " <";
    lastMonthButton.onclick = function () { 
        buildCalendar(divID, prevMonthString);
    };
    buttonsDiv.appendChild(lastMonthButton);

    let nextMonthButton = document.createElement('input');
    nextMonthButton.type = "button";
    day.setMonth(day.getMonth() + 2);
    let nextMonthString = day.toDateString();
    nextMonthButton.defaultValue = "> " + day.toLocaleString('default', { month: 'long'});
    nextMonthButton.onclick = function () {
        buildCalendar(divID, day.toDateString());
    }

    buttonsDiv.appendChild(nextMonthButton);
}