var imageArray = new Array(),
        canvas = document.getElementById("canvas1"),
        ctx = canvas.getContext("2d"),
        canvasOffset = canvas,
        OffsetX, OffsetY, lastObj, timer;
var MINSIZE = 10;

resizeCanvas();
window.addEventListener('resize', resizeCanvas);
calculateCanvasOffset();

function calculateCanvasOffset() {

    var OffsetLeft =
            (parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0) +
            (parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0) +
            document.body.parentNode.offsetLeft;
    var OffsetTop =
            (parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0) +
            (parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0) +
            document.body.parentNode.offsetTop;

    OffsetX = OffsetLeft;
    OffsetY = OffsetTop;

    if (canvasOffset.offsetParent !== undefined) {
        do {
            OffsetX += canvasOffset.offsetLeft;
            OffsetY += canvasOffset.offsetTop;
        } while ((canvasOffset = canvasOffset.offsetParent));
    }

}

function resizeCanvas() {
    canvas.setAttribute("width", window.innerWidth - 17);
    canvas.setAttribute("height", Math.trunc(window.innerHeight - 200));
    ctx = canvas.getContext("2d");
    redrawImageArray(imageArray);
}

function redrawImageArray(imageArray) {
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    imageArray.forEach(function (image) {
        drawObject(image);
    });
}

function doRectangle() {
    var rectangle = getRandomRectangleObject();
    imageArray.push(rectangle);
    displayObjectCount();
    drawObject(rectangle);
}

function doCircle() {
    var circle = getRandomCircleObject();
    imageArray.push(circle);
    displayObjectCount();
    drawObject(circle);
}

function getRandomRectangleObject() {
    var Width = document.getElementById("canvas1").getAttribute("width");
    var Height = document.getElementById("canvas1").getAttribute("height");
    var rct = new Object();
    rct.type = "Rectangle";
    rct.posX = Math.trunc(Math.random() * Width);
    rct.posY = Math.trunc(Math.random() * Height);
    rct.rectWidth = Math.trunc(Math.random() * (Width - rct.posX));
    if (rct.rectWidth < MINSIZE) {
        rct.rectWidth = MINSIZE;
    }
    rct.rectHeight = Math.trunc(Math.random() * (Height - rct.posY));
    if (rct.rectHeight < MINSIZE) {
        rct.rectHeight = MINSIZE;
    }
    rct.color1 = getRandomColor("light");
    rct.color2 = getRandomColor("dark");
    rct.highlighted = 0;
    rct.selected = 0;
    return rct;
}

function getRandomCircleObject() {
    var Width = document.getElementById("canvas1").getAttribute("width");
    var Height = document.getElementById("canvas1").getAttribute("height");
    var crcl = new Object();
    crcl.type = "Circle";
    crcl.posX = Math.trunc(Math.random() * Width);
    crcl.posY = Math.trunc(Math.random() * Height);
    crcl.radius = Math.trunc(Math.random() * Width * 0.2);
    if (crcl.radius < MINSIZE) {
        crcl.radius = MINSIZE;
    }
    crcl.color1 = getRandomColor();
    crcl.highlighted = 0;
    crcl.selected = 0;
    return crcl;
}

function getRandomColor(spectrum) {

    function getSpecificRandomColor(letters) {
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
    }

    if (spectrum === "light") {
        return getSpecificRandomColor('789ABCDEF');
    } else {
        if (spectrum === "dark") {
            return getSpecificRandomColor('012345');
        } else {
            return getSpecificRandomColor('0123456789ABCDEF');
        }
    }
}

function drawObject(object) {
    if (object.type === "Rectangle") {
        drawRectangle(object);
    }
    if (object.type === "Circle") {
        drawCircle(object);
    }

    function drawRectangle(rct) {
        var RectHorizontalMid = Math.trunc((rct.rectWidth / 2) + rct.posX);
        var RectVerticalMid = Math.trunc((rct.rectHeight / 2) + rct.posY);
        var RectShorterDimension = rct.rectWidth > rct.rectHeight ? rct.rectHeight : rct.rectWidth;
        var RectLongerDimension = rct.rectWidth < rct.rectHeight ? rct.rectHeight : rct.rectWidth;
        var Gradient = ctx.createRadialGradient(
                RectHorizontalMid,
                RectVerticalMid,
                Math.trunc(RectShorterDimension / 8),
                RectHorizontalMid,
                RectVerticalMid, Math.trunc(RectLongerDimension / 2));
        if (rct.highlighted === 0) {
            Gradient.addColorStop(0, rct.color1);
            Gradient.addColorStop(1, rct.color2);
            ctx.fillStyle = Gradient;
        } else {
            ctx.fillStyle = "white";
        }
        ctx.fillRect(rct.posX, rct.posY, rct.rectWidth, rct.rectHeight);
        if (rct.selected === 0) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
        } else {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
        }
        ctx.strokeRect(rct.posX, rct.posY, rct.rectWidth, rct.rectHeight);
    }

    function drawCircle(crcl) {
        ctx.beginPath();
        ctx.arc(crcl.posX, crcl.posY, crcl.radius, 0, 2 * Math.PI, false);
        if (crcl.highlighted === 0) {
            ctx.fillStyle = crcl.color1;
        } else {
            ctx.fillStyle = "white";
        }
        ctx.fill();
        if (crcl.selected === 0) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
        } else {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
        }
        ctx.stroke();
    }
}

function clearCanvas() {
    imageArray = new Array();
    displayObjectCount();
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lastObj = null;
}

function displayObjectCount() {
    document.getElementById("objCount").innerHTML = imageArray.length;
}

function imageHitTest(obj, mx, my) {

    if (obj.type === "Rectangle") {
        var rectPosX2 = obj.rectWidth + obj.posX;
        var rectPosY2 = obj.rectHeight + obj.posY;
        if (mx >= obj.posX && mx <= rectPosX2 && my >= obj.posY && my <= rectPosY2) {
            return obj;
        }
        return null;
    }

    if (obj.type === "Circle") {
        var aSquared = (obj.posX - mx) * (obj.posX - mx);
        var bSquared = (obj.posY - my) * (obj.posY - my);
        var cSquared = obj.radius * obj.radius;
        if (aSquared + bSquared <= cSquared) {
            return obj;
        }
        return null;
    }
}

canvas.onmousemove = trackHighlight;

function trackHighlight(e) {

    var pt = getMouse(e);
    document.getElementById("mousePosition").innerHTML = "X:" + pt.x + "_Y:" + pt.y;

    if (imageArray !== null && imageArray.length !== 0) {
        if (lastObj !== null && lastObj !== undefined) {
            imageArray[lastObj].highlighted = 0;
            lastObj = null;
        }

        for (var i = imageArray.length - 1; i >= 0; i--) {
            var obj = imageHitTest(imageArray[i], pt.x, pt.y);
            if (obj !== null) {
                obj.highlighted = 1;
                lastObj = i;
                break;
            }
        }
        redrawImageArray(imageArray);
    }
}
;

canvas.onclick = selectHandler;

function selectHandler() {
    flipSelect();
    redrawImageArray(imageArray);
}
;

function flipSelect() {
    if (lastObj !== null && lastObj !== undefined) {
        if (imageArray[lastObj].selected === 0) {
            imageArray[lastObj].selected = 1;
        } else {
            imageArray[lastObj].selected = 0;
        }
    }
}
;
canvas.oncontextmenu = function () {

    for (var i = 0, max = imageArray.length; i < max; i++) {
        /* console.log("imageArray.length"+imageArray.length);*/
        if (imageArray[i].selected === 1) {
            if (imageArray[i].highlighted === 1) {
                if (lastObj !== null && lastObj !== undefined) {
                    lastObj = null;
                }
            }
            imageArray.splice(i, 1);
            i--;
            max--;
        }

    }
    displayObjectCount();
    redrawImageArray(imageArray);
    return false;
};


canvas.onmousedown = function (e) {

    var pt = getMouse(e);
    var lastX = pt.x, lastY = pt.y, dx = 0, dy = 0;
    var moved = false;
    canvas.onmousemove = trackMove;

    function trackMove(e) {
        var pt2 = getMouse(e);
        /*   console.log("lastx:"+lastX+"lasty:"+lastY+"currentx:"+pt2.x+"currentY"+pt2.y);*/
        if (lastObj !== null && lastObj !== undefined) {
            dx = (pt2.x - lastX);
            dy = (pt2.y - lastY);
            if (dx !== 0 || dy !== 0) {
                moved = true;
            }
            moveObject(imageArray[lastObj], dx, dy);
            lastX = pt2.x;
            lastY = pt2.y;
            redrawImageArray(imageArray);
        }
    }
    ;

    canvas.onmouseup = function () {
        canvas.onmousemove = trackHighlight;
        if (moved) {
            flipSelect();
            redrawImageArray(imageArray);
        }
    };
};

function getMouse(e) {
    var mx, my;
    mx = e.pageX - OffsetX;
    my = e.pageY - OffsetY;
    return {
        x: mx,
        y: my
    };
}
;

function moveObject(object, dx, dy) {

    if (object.type === "Rectangle") {
        moveRectangle(object, dx, dy);
    }
    if (object.type === "Circle") {
        moveCircle(object, dx, dy);
    }

    function moveRectangle(object, dx, dy) {
        object.posX += dx;
        object.posY += dy;
    }
    function moveCircle(object, dx, dy) {
        object.posX += dx;
        object.posY += dy;
    }
}

function save() {

    var filename = prompt("Please enter name of your image", "DefaultImageName");
    if (filename !== null) {
        var jsonString = JSON.stringify(imageArray);
        /* console.log(jsonString); */
        var type = 'text/plain';
        var a = document.createElement("a");
        var file = new Blob([jsonString], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = filename + '.json';
        a.click();
    }
}

var loaderDiv = document.createElement('div');
function loadDialog() {
    loaderDiv.innerHTML = "<form id=\"jsonFile\" name=\"jsonFile\" enctype=\"multipart/form-data\" method=\"post\">" +
            "<fieldset><input type='file' id='fileinput'> </fieldset>" +
            "</form>" +
            "Clearload? <input type=\"checkbox\" id=\"clearLoad\" checked>" +
            "<button id=\"btnD1\" type=\"button\" onclick=\"load()\">Load</button>" +
            "<button id=\"btnD2\" type=\"button\" onclick=\"hideLoad()\">Cancel</button>";
    loaderDiv.setAttribute('class', 'loadDialog');
    document.body.appendChild(loaderDiv);

}
;

function hideLoad() {
    document.body.removeChild(loaderDiv);
}

function load() {

    var input, file, fr;

    if (typeof window.FileReader !== 'function') {
        alert("The file API isn't supported on this browser yet.");
        hideLoad();
        return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
        hideLoad();
    } else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
        hideLoad();
    } else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    } else {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);
    }

    function receivedText(e) {
        lines = e.target.result;
        try {
            var newArr = JSON.parse(lines);
            if (checkProperties(newArr)) {
                if (document.getElementById("clearLoad").checked)
                {
                    clearCanvas();
                    imageArray = newArr;
                    displayObjectCount();
                } else
                {
                    imageArray = imageArray.concat(newArr);
                    displayObjectCount();
                }

                redrawImageArray(imageArray);
                hideLoad();
            } else {
                alert("Please select a valid JSON file containing DVT_Coding_Assignment image data before clicking 'Load'");
                return;
            }

        } catch (e) {
            alert("Please select a valid JSON file before clicking 'Load'");
            return;
        }
    }

}

function checkProperties(newArr) {

    for (var i = 0, max = newArr.length; i < max; i++) {
        if (newArr[i].hasOwnProperty('type') &&
                newArr[i].hasOwnProperty('posX') &&
                newArr[i].hasOwnProperty('posY') &&
                newArr[i].hasOwnProperty('highlighted') &&
                newArr[i].hasOwnProperty('selected') &&
                newArr[i].hasOwnProperty('color1') &&
                checkNumeric(newArr[i].posX) &&
                checkNumeric(newArr[i].posY) &&
                checkNumeric(newArr[i].highlighted) &&
                checkNumeric(newArr[i].selected) &&
                checkColorHex(newArr[i].color1)
                ) {
            if (newArr[i].type === "Rectangle") {
                if (newArr[i].hasOwnProperty('rectWidth') &&
                        newArr[i].hasOwnProperty('rectHeight') &&
                        newArr[i].hasOwnProperty('color2') &&
                        checkNumeric(newArr[i].rectWidth) &&
                        checkNumeric(newArr[i].rectHeight) &&
                        checkColorHex(newArr[i].color2)
                        ) { /*console.log("Proper Rectangle");*/

                } else {
                    return false;
                }
            } else {
                if (newArr[i].type === "Circle") {
                    if (newArr[i].hasOwnProperty('radius') &&
                            checkNumeric(newArr[i].radius)
                            ) {/* console.log("Proper Circle");*/

                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }

        } else {
            return false;
        }
    }
    return true;

    function checkColorHex(colorString) {
        return /^#[0-9A-F]{6}$/i.test(colorString);
    }
    function checkNumeric(n) {
        return !isNaN(parseInt(n)) && isFinite(n);
    }

}

function loop() {
    timer = setInterval(randomImage, 300);
}

function randomImage() {
    if (Math.random() > 0.5) {
        doRectangle();
    } else {
        doCircle();
    }
}

function stopLoop() {
    clearInterval(timer);
}


