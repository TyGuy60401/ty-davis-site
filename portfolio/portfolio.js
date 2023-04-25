function moveImgs(direction) {
    // let imgsDiv = document.querySelector("#imgs");
    let imgsList = $('#imgs').children('img');
    if (direction == 'right') {
        for (var i = imgsList.length - 1; i >= 0; i--) {
            let idString = imgsList[i].id;
            console.log(idString);
        }
    }
    if (direction == 'left') {
        for (var i = 0; i < imgsList.length; i++) {
            let idString = imgsList[i].id;
            console.log(idString);
        }

    }

}