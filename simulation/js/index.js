var text = [
    "'Breadboard' also known as Prototypeboard is a type of solderless electronic circuit building. A breadboard is used to build and test circuits. A breadboard image is shown below.",
    "The rows labeled + and - are called power rails.The power rails are used to provide power supply to the circuit. Rows holes are connected horizontally as shown in below.",
    "The column holes are connected vertically as shown below.",
    "Right way to connect power supply",
    "Right way to connect LED component to the breadboard.",
    "If we connect a LED vertically to the holes of column, then it would result a wrong connection as both pins are shorted.",
    "Ways to connect IC to breadboard.",
    "Ways to connect resistance to breadboard.",
    "This  is a simple electronic circuit in series for breadboard familiarisation.",
    "This  is a simple electronic circuit in parallel for breadboard familiarisation.",
    "",
    ""
]

var slider_img = document.querySelector('.slider-img');

var images = [
    'board.png',
    'r1.png',
    'c.png',
    'image001.jpg',
    'c-correct.jpg',
    'c-wrong.jpg',
    'ic.jpg',
    'resistance.png',
    'first circuit.jpg',
    'second circuit.jpg',
    '',
    ''
];
var Current = 0;
var i = 0;

document.getElementById("textHere").innerHTML = text[Current];


function setImg() {
    if (Current == text.length - 1) {
        if (con3 == true && con2 == true) {
            document.getElementById("simulation1").style.display = "none";
            document.getElementById("simulation2").style.display = "none";
            document.getElementById('simulation4').style.display = "inline-block";
        } else {
            alert("Complete both Series and Parallel Connection to move on next")
            Current--;
        }

    } else if (Current == text.length - 2) {
        document.getElementById("simulation1").style.display = "none";
        document.getElementById('simulation2').style.display = "inline-block";
        document.getElementById('simulation4').style.display = "none";
        radioBtnfun();
    } else if (Current < text.length - 2) {
        document.getElementById("simulation1").style.display = "inline-block";
        document.getElementById('simulation2').style.display = "none";
        document.getElementById('simulation4').style.display = "none";
    }

    return slider_img.setAttribute("src", "images/" + images[Current]);
}

function imgNext() {
    if (i == images.length - 1) {
        i = images.length - 1;
    } else {
        i++;
    }
    return setImg();
}

function msgNext() {
    if (Current == text.length - 1) {
        Current = text.length - 1
    } else {
        Current++;
    }
    document.getElementById("textHere").innerHTML = text[Current];
}

function imgPrev() {
    if (i == 0) {
        i = 0;
    } else {
        i--;
    }
    return setImg();
}

function msgPrev() {
    if (Current == 0) {
        Current = 0;
    } else {
        Current--;
    }
    document.getElementById("textHere").innerHTML = text[Current];
}

function Prev() {
    console.log("click on previous button");
    msgPrev();
    imgPrev();
}

function Next() {
    console.log("click on next button");
    msgNext();
    imgNext();
}



function radioBtnfun() {
    var radio = document.getElementsByName('radio');
    var run;
    for (i = 0; i < radio.length; i++) {
        if (radio[i].checked)
            run = radio[i].value;
    }
    console.log(run);

    if (run == "Series") {
        document.getElementById('mid2').style.display = "block";
        document.getElementById('mid3').style.display = "none";

        document.getElementById('First2').style.display = "inline-block";
        document.getElementById('First3').style.display = "none";

        document.getElementById('seriesComp').style.display = "block";
        document.getElementById('parallelComp').style.display = "none";
    }

    if (run == "Parallel") {
        document.getElementById('mid2').style.display = "none";
        document.getElementById('mid3').style.display = "block";

        document.getElementById('First2').style.display = "none";
        document.getElementById('First3').style.display = "inline-block";

        document.getElementById('seriesComp').style.display = "none";
        document.getElementById('parallelComp').style.display = "block";
    }

}


// Components Button Code

//const Second = document.getElementById('second');
//const Second_Data = document.getElementById('Second_Data')
//const btn_close = document.getElementById('btn_close');;
//
//Second.addEventListener('click', () => {
//    Second_Data.classList.toggle('visible')
//});
//
//btn_close.addEventListener('click', () => {
//    Second_Data.classList.remove('visible')
//});


//JSPlumb codes

var connections = [];

function reload(event) {
    window.location.reload()
}


function BoardController() {
    var jsPlumbInstance = null;
    var endPoints = [];

    this.setJsPlumbInstance = function(instance) {
        jsPlumbInstance = instance;
    };

    this.setCircuitContainer = function(drawingContainer) {
        jsPlumbInstance.Defaults.Container = drawingContainer;
    };

    this.initDefault = function() {

        jsPlumbInstance.importDefaults({
            Connector: ["Bezier", { curviness: 30 }],
            PaintStyle: { strokeStyle: '#87321b', lineWidth: 4 },
            EndpointStyle: { radius: 3, fillStyle: 'blue' },
            HoverPaintStyle: { strokeStyle: "#26c947" }
        });

        jsPlumbInstance.bind("beforeDrop", function(params) {
            var sourceEndPoint = params.connection.endpoints[0];
            var targetEndPoint = params.dropEndpoint;
            if (!targetEndPoint || !sourceEndPoint) {
                return false;
            }
            var sourceEndPointgroup = sourceEndPoint.getParameter('groupName');
            var targetEndPointgroup = targetEndPoint.getParameter('groupName');

            if (sourceEndPointgroup == targetEndPointgroup) {
                alert("Already connected internally");
                return false;
            } else {
                return true;
            }
        });

        jsPlumbInstance.bind("dblclick", function(conn) {
            jsPlumb.detach(conn);
            return false;
        });

        jsPlumbInstance.bind("jsPlumbConnection", function(conn) {
            var source = conn.connection.endpoints[0].getParameter('endPointName')
            connections[source] = conn.connection;

        });
    };

    this.addEndPoint = function(radius, divID, groupName, endPointName, anchorArray, color, stroke) {
        var Stroke;
        if (typeof(stroke) == 'undefined') {
            Stroke = '#87321b';
        } else {
            Stroke = stroke;
        }
       var endpointOptions = {
            isSource: true,
            isTarget: true,
            anchor: anchorArray,
            maxConnections: 1,
            parameters: {
                "divID": divID,
                "endPointName": endPointName,
                "groupName": groupName,
                "type": 'output',
                "acceptType": 'input'
            },
            paintStyle: { radius: radius, fillStyle: color },
            connectorStyle: { strokeStyle: Stroke, lineWidth: 4 }
        };

        jsPlumbInstance.addEndpoint(divID, endpointOptions);

        setEndpoint(endPointName, endpointOptions);
    };

    var setEndpoint = function(endPointName, endpointOptions) {
        endPoints[endPointName] = {
            "endPointName": endpointOptions.parameters.endPointName,
            "groupName": endpointOptions.parameters.groupName,
            "divID": endpointOptions.parameters.divID
        };

    };

}

// Simulation 2 codes
// Instruction Button Code

const First2 = document.getElementById('First2');
const close_btn2 = document.getElementById('close-btn2');
const First_data2 = document.getElementById('First_Data2');

First2.addEventListener('click', () => {
    First_data2.classList.toggle('visible')
});

close_btn2.addEventListener('click', () => {
    First_data2.classList.remove('visible')
});



//Components

const check_button = document.getElementById('check');
const check1_button = document.getElementById('check1');

const bread_but=document.getElementById("breadbutton");
const supply_but=document.getElementById("supplybutton");
const r_but=document.getElementById("resistancebutton");
const led_but=document.getElementById("ledbutton");

//var p1;
function breadboard2() {
    var x = document.getElementById("board2");
    x.style.visibility = "visible";

    bread_but.disabled=true;
    bread_but.style.cursor="not-allowed";

    var instance = new BoardController();

    instance.setJsPlumbInstance(jsPlumb);
    instance.initDefault();
    instance.setCircuitContainer('mid2');

    //breadboard definition 
    {
        instance.addEndPoint(4.5, 'board2', 'row1', 'r1', [0, 0, 0, -1, 59, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r2', [0, 0, 0, -1, 72.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r4', [0, 0, 0, -1, 99.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r5', [0, 0, 0, -1, 113, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r3', [0, 0, 0, -1, 86, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r9', [0, 0, 0, -1, 180.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r11', [0, 0, 0, -1, 221, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r8', [0, 0, 0, -1, 167, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r6', [0, 0, 0, -1, 140, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r10', [0, 0, 0, -1, 194, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r14', [0, 0, 0, -1, 261.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r15', [0, 0, 0, -1, 275, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r7', [0, 0, 0, -1, 153.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r16', [0, 0, 0, -1, 302, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r12', [0, 0, 0, -1, 234.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r19', [0, 0, 0, -1, 342.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r20', [0, 0, 0, -1, 356, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r18', [0, 0, 0, -1, 329, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r21', [0, 0, 0, -1, 383, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r17', [0, 0, 0, -1, 315.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r13', [0, 0, 0, -1, 248, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r22', [0, 0, 0, -1, 396.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r23', [0, 0, 0, -1, 410, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r24', [0, 0, 0, -1, 423.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row1', 'r25', [0, 0, 0, 0, 437, 26], 'blue');



        instance.addEndPoint(4.5, 'board2', 'row2', 'r27', [0, 0, 0, 1, 72.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r26', [0, 0, 0, 1, 59, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r30', [0, 0, 0, 1, 113, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r28', [0, 0, 0, 1, 86, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r32', [0, 0, 0, 1, 153.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r31', [0, 0, 0, 1, 140, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r29', [0, 0, 0, 1, 99.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r35', [0, 0, 0, 1, 194, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r34', [0, 0, 0, 1, 180.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r36', [0, 0, 0, 1, 221, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r33', [0, 0, 0, 1, 167, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r37', [0, 0, 0, 1, 234.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r38', [0, 0, 0, 1, 248, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r39', [0, 0, 0, 1, 261.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r41', [0, 0, 0, 1, 302, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r40', [0, 0, 0, 1, 275, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r42', [0, 0, 0, 1, 315.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r43', [0, 0, 0, 1, 329, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r45', [0, 0, 0, 1, 356, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r44', [0, 0, 0, 1, 342.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r46', [0, 0, 0, 1, 383, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r47', [0, 0, 0, 1, 396.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r49', [0, 0, 0, 1, 423.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r50', [0, 0, 0, 0, 437, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row2', 'r48', [0, 0, 0, 1, 410, 39.5], 'blue');



        instance.addEndPoint(4.5, 'board2', 'row3', 'r51', [0, 0, 0, 0, 478, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r52', [0, 0, 0, -1, 491.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r55', [0, 0, 0, -1, 532, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r54', [0, 0, 0, -1, 518.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r53', [0, 0, 0, -1, 505, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r56', [0, 0, 0, -1, 559, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r57', [0, 0, 0, -1, 572.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r58', [0, 0, 0, -1, 586, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r59', [0, 0, 0, -1, 599.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r61', [0, 0, 0, -1, 640, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r62', [0, 0, 0, -1, 653.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r60', [0, 0, 0, -1, 613, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r63', [0, 0, 0, -1, 667, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r64', [0, 0, 0, -1, 680.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r66', [0, 0, 0, -1, 721, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r67', [0, 0, 0, -1, 734.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r65', [0, 0, 0, -1, 694, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r68', [0, 0, 0, -1, 748, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r69', [0, 0, 0, -1, 761.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r72', [0, 0, 0, -1, 815.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r71', [0, 0, 0, -1, 802, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r70', [0, 0, 0, -1, 775, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r73', [0, 0, 0, -1, 829, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r75', [0, 0, 0, -1, 856, 26], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row3', 'r74', [0, 0, 0, -1, 842.5, 26], 'blue');



        instance.addEndPoint(4.5, 'board2', 'row4', 'r77', [0, 0, 0, 1, 491.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r78', [0, 0, 0, 1, 505, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r81', [0, 0, 0, 1, 559, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r76', [0, 0, 0, 0, 478, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r82', [0, 0, 0, 1, 572.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r79', [0, 0, 0, 1, 518.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r80', [0, 0, 0, 1, 532, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r84', [0, 0, 0, 1, 599.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r86', [0, 0, 0, 1, 640, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r85', [0, 0, 0, 1, 613, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r87', [0, 0, 0, 1, 653.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r89', [0, 0, 0, 1, 680.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r88', [0, 0, 0, 1, 667, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r91', [0, 0, 0, 1, 721, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r83', [0, 0, 0, 1, 586, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r90', [0, 0, 0, 1, 694, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r92', [0, 0, 0, 1, 734.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r96', [0, 0, 0, 1, 802, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r95', [0, 0, 0, 1, 775, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r94', [0, 0, 0, 1, 761.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r93', [0, 0, 0, 1, 748, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r97', [0, 0, 0, 1, 815.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r99', [0, 0, 0, 1, 842.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r98', [0, 0, 0, 1, 829, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row4', 'r100', [0, 0, 0, 1, 856, 39.5], 'blue');


        instance.addEndPoint(4.5, 'board2', 'row5', 'r101', [0, 0, 0, -1, 59.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r102', [0, 0, 0, -1, 73, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r103', [0, 0, 0, -1, 86.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r104', [0, 0, 0, -1, 100, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r105', [0, 0, 0, -1, 113.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r106', [0, 0, 0, -1, 140.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r108', [0, 0, 0, -1, 167.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r110', [0, 0, 0, -1, 194.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r107', [0, 0, 0, -1, 154, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r109', [0, 0, 0, -1, 181, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r111', [0, 0, 0, -1, 221.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r112', [0, 0, 0, -1, 235, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r113', [0, 0, 0, -1, 248.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r115', [0, 0, 0, -1, 275.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r114', [0, 0, 0, -1, 262, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r117', [0, 0, 0, -1, 316, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r118', [0, 0, 0, -1, 329.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r116', [0, 0, 0, -1, 302.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r119', [0, 0, 0, -1, 343, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r120', [0, 0, 0, -1, 356.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r121', [0, 0, 0, -1, 383.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r122', [0, 0, 0, -1, 397, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r124', [0, 0, 0, -1, 424, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r123', [0, 0, 0, -1, 410.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row5', 'r125', [0, 0, 0, 0, 434.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r127', [0, 0, 0, 1, 73, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r126', [0, 0, 0, 1, 59.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r129', [0, 0, 0, 1, 100, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r128', [0, 0, 0, 1, 86.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r130', [0, 0, 0, 1, 113.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r131', [0, 0, 0, 1, 140.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r132', [0, 0, 0, 1, 154, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r133', [0, 0, 0, 1, 167.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r134', [0, 0, 0, 1, 181, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r136', [0, 0, 0, 1, 221.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r135', [0, 0, 0, 1, 194.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r137', [0, 0, 0, 1, 235, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r138', [0, 0, 0, 1, 248.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r140', [0, 0, 0, 1, 275.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r142', [0, 0, 0, 1, 316, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r139', [0, 0, 0, 1, 262, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r141', [0, 0, 0, 1, 302.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r143', [0, 0, 0, 1, 329.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r145', [0, 0, 0, 1, 356.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r144', [0, 0, 0, 1, 343, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r147', [0, 0, 0, 1, 397, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r146', [0, 0, 0, 1, 383.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r148', [0, 0, 0, 1, 410.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r149', [0, 0, 0, 1, 424, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row6', 'r150', [0, 0, 0, 1, 437.5, 282.5], 'blue');



        instance.addEndPoint(4.5, 'board2', 'row7', 'r151', [0, 0, 0, 0, 478, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r152', [0, 0, 0, -1, 491.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r155', [0, 0, 0, -1, 532, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r153', [0, 0, 0, -1, 505, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r157', [0, 0, 0, -1, 572.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r156', [0, 0, 0, -1, 559, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r154', [0, 0, 0, -1, 518.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r160', [0, 0, 0, -1, 613, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r162', [0, 0, 0, -1, 653.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r161', [0, 0, 0, -1, 640, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r159', [0, 0, 0, -1, 599.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r158', [0, 0, 0, -1, 586, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r163', [0, 0, 0, -1, 667, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r164', [0, 0, 0, -1, 680.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r165', [0, 0, 0, -1, 694, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r166', [0, 0, 0, -1, 721, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r168', [0, 0, 0, -1, 748, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r167', [0, 0, 0, -1, 734.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r169', [0, 0, 0, -1, 761.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r170', [0, 0, 0, -1, 775, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r171', [0, 0, 0, -1, 802, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r172', [0, 0, 0, -1, 814.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r174', [0, 0, 0, -1, 842.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r173', [0, 0, 0, -1, 829, 269], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row7', 'r175', [0, 0, 0, -1, 856, 269], 'blue');


        instance.addEndPoint(4.5, 'board2', 'row8', 'r176', [0, 0, 0, 1, 478, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r177', [0, 0, 0, 1, 491.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r180', [0, 0, 0, 1, 532, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r178', [0, 0, 0, 1, 505, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r182', [0, 0, 0, 1, 572.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r181', [0, 0, 0, 1, 559, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r179', [0, 0, 0, 1, 518.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r187', [0, 0, 0, 1, 653.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r183', [0, 0, 0, 1, 586, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r186', [0, 0, 0, 1, 640, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r185', [0, 0, 0, 1, 613, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r184', [0, 0, 0, 1, 599.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r188', [0, 0, 0, 1, 667, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r189', [0, 0, 0, 1, 680.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r191', [0, 0, 0, 1, 721, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r190', [0, 0, 0, 1, 694, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r192', [0, 0, 0, 1, 734.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r193', [0, 0, 0, 1, 748, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r194', [0, 0, 0, 1, 761.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r196', [0, 0, 0, 1, 802, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r195', [0, 0, 0, 1, 775, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r197', [0, 0, 0, 1, 815.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r198', [0, 0, 0, 1, 829, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r199', [0, 0, 0, 1, 842.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board2', 'row8', 'r200', [0, 0, 0, 1, 856, 282.5], 'blue');
    }
    disabledButton();
}

function supply2() {
    var x = document.getElementById("supply2");
    x.style.visibility = "visible";

    supply_but.disabled=true;
    supply_but.style.cursor="not-allowed";

    var supply = new BoardController();
    supply.setJsPlumbInstance(jsPlumb);
    supply.setCircuitContainer('mid2');

    supply.addEndPoint(8, 'supply2', 'VCC', 'VCC', [0, 0, -1, 0, 40, 45], 'blue', 'red');
    supply.addEndPoint(8, 'supply2', 'GND', 'GND', [0, 0, 1, 0, 80, 45], 'red', 'black');

    disabledButton();
}

function R21() {
    var x = document.getElementById("R21");
    x.style.visibility = "visible";
    
    r_but.disabled=true;
    r_but.style.cursor="not-allowed";

    var elms = document.querySelectorAll("[id='r1']");
 
       for(var i = 0; i < elms.length; i++) 
        elms[i].style.visibility='visible';

    var R21 = new BoardController();
    R21.setJsPlumbInstance(jsPlumb);
    R21.setCircuitContainer('mid2');

    R21.addEndPoint(4.2, 'R21', 'R21_A', 'R21_A01', [0, 0, -1, 0, 8, 4], 'red');
    R21.addEndPoint(4.2, 'R21', 'R21_A', 'R21_A02', [0, 0, -1, 0, 8, 17.5], 'red');
    R21.addEndPoint(4.2, 'R21', 'R21_A', 'R21_A03', [0, 0, -1, 0, 8, 31], 'red');
    R21.addEndPoint(4.2, 'R21', 'R21_A', 'R21_A04', [0, 0, -1, 0, 8, 44.5], 'red');
    R21.addEndPoint(4.2, 'R21', 'R21_B', 'R21_B01', [0, 0, 0, 1, 8, 111.5], 'red');
    R21.addEndPoint(4.2, 'R21', 'R21_B', 'R21_B02', [0, 0, 0, 1, 8, 125], 'red');
    R21.addEndPoint(4.2, 'R21', 'R21_B', 'R21_B03', [0, 0, 0, 1, 8, 138.5], 'red');
    R21.addEndPoint(4.2, 'R21', 'R21_B', 'R21_B04', [0, 0, 0, 1, 8, 152], 'red');
    disabledButton();
}

function led21() {
    var x = document.getElementById("led21");
    x.style.visibility = "visible";

    led_but.disabled=true;
    led_but.style.cursor="not-allowed";

    var elms = document.querySelectorAll("[id='l1']");
 
for(var i = 0; i < elms.length; i++) 
  elms[i].style.visibility='visible';
    
    

    var led = new BoardController();
    led.setJsPlumbInstance(jsPlumb);
    led.setCircuitContainer('mid2');

    led.addEndPoint(4.5, 'led21', 'led21_A', 'led21_A01', [0, 0, 0, 1, 10, 78], 'red');
    led.addEndPoint(4.5, 'led21', 'led21_A', 'led21_A02', [0, 0, 0, 1, 10, 91.5], 'red');
    led.addEndPoint(4.5, 'led21', 'led21_A', 'led21_A03', [0, 0, 0, 1, 10, 104], 'red');
    led.addEndPoint(4.5, 'led21', 'led21_A', 'led21_A04', [0, 0, 0, 1, 10, 118.5], 'red');
    led.addEndPoint(4.5, 'led21', 'led21_A', 'led21_A05', [0, 0, 0, 1, 10, 132], 'red');

    led.addEndPoint(4.5, 'led21', 'led21_C', 'led21_C01', [0, 0, 1, 0, 23.5, 78], 'red');
    led.addEndPoint(4.5, 'led21', 'led21_C', 'led21_C02', [0, 0, 1, 0, 23.5, 91.5], 'red');
    led.addEndPoint(4.5, 'led21', 'led21_C', 'led21_C03', [0, 0, 1, 0, 23.5, 104], 'red');
    led.addEndPoint(4.5, 'led21', 'led21_C', 'led21_C04', [0, 0, 1, 0, 23.5, 118.5], 'red');
    led.addEndPoint(4.5, 'led21', 'led21_C', 'led21_C05', [0, 0, 1, 0, 23.5, 132], 'red');

    disabledButton();
    
}

function led22() {
    var x = document.getElementById("led22");
    x.style.visibility = "visible";

    led_but.disabled=true;
    led_but.style.cursor="not-allowed";

    var elms = document.querySelectorAll("[id='l2']");
    for(var i = 0; i < elms.length; i++) 
      elms[i].style.visibility='visible';

    var led = new BoardController();
    led.setJsPlumbInstance(jsPlumb);
    led.setCircuitContainer('mid2');

    led.addEndPoint(4.5, 'led22', 'led22_A', 'led22_A01', [0, 0, 0, 1, 10, 78], 'red');
    led.addEndPoint(4.5, 'led22', 'led22_A', 'led22_A02', [0, 0, 0, 1, 10, 91.5], 'red');
    led.addEndPoint(4.5, 'led22', 'led22_A', 'led22_A03', [0, 0, 0, 1, 10, 104], 'red');
    led.addEndPoint(4.5, 'led22', 'led22_A', 'led22_A04', [0, 0, 0, 1, 10, 118.5], 'red');
    led.addEndPoint(4.5, 'led22', 'led22_A', 'led22_A05', [0, 0, 0, 1, 10, 132], 'red');

    led.addEndPoint(4.5, 'led22', 'led22_C', 'led22_C01', [0, 0, 1, 0, 23.5, 78], 'red');
    led.addEndPoint(4.5, 'led22', 'led22_C', 'led22_C02', [0, 0, 1, 0, 23.5, 91.5], 'red');
    led.addEndPoint(4.5, 'led22', 'led22_C', 'led22_C03', [0, 0, 1, 0, 23.5, 104], 'red');
    led.addEndPoint(4.5, 'led22', 'led22_C', 'led22_C04', [0, 0, 1, 0, 23.5, 118.5], 'red');
    led.addEndPoint(4.5, 'led22', 'led22_C', 'led22_C05', [0, 0, 1, 0, 23.5, 132], 'red');

    disabledButton();
}

function led23() {
    var x = document.getElementById("led23");
    x.style.visibility = "visible";

    led_but.disabled=true;
    led_but.style.cursor="not-allowed";

    var elms = document.querySelectorAll("[id='l3']");
    for(var i = 0; i < elms.length; i++) 
      elms[i].style.visibility='visible';

    var led = new BoardController();
    led.setJsPlumbInstance(jsPlumb);
    led.setCircuitContainer('mid2');

    led.addEndPoint(4.5, 'led23', 'led23_A', 'led23_A01', [0, 0, 0, 1, 10, 78], 'red');
    led.addEndPoint(4.5, 'led23', 'led23_A', 'led23_A02', [0, 0, 0, 1, 10, 91.5], 'red');
    led.addEndPoint(4.5, 'led23', 'led23_A', 'led23_A03', [0, 0, 0, 1, 10, 104], 'red');
    led.addEndPoint(4.5, 'led23', 'led23_A', 'led23_A04', [0, 0, 0, 1, 10, 118.5], 'red');
    led.addEndPoint(4.5, 'led23', 'led23_A', 'led23_A05', [0, 0, 0, 1, 10, 132], 'red');

    led.addEndPoint(4.5, 'led23', 'led23_C', 'led23_C01', [0, 0, 1, 0, 23.5, 78], 'red');
    led.addEndPoint(4.5, 'led23', 'led23_C', 'led23_C02', [0, 0, 1, 0, 23.5, 91.5], 'red');
    led.addEndPoint(4.5, 'led23', 'led23_C', 'led23_C03', [0, 0, 1, 0, 23.5, 104], 'red');
    led.addEndPoint(4.5, 'led23', 'led23_C', 'led23_C04', [0, 0, 1, 0, 23.5, 118.5], 'red');
    led.addEndPoint(4.5, 'led23', 'led23_C', 'led23_C05', [0, 0, 1, 0, 23.5, 132], 'red');

    disabledButton();
}

function disabledButton()
{

  if(window.getComputedStyle(document.getElementById('board2')).visibility === "visible" && window.getComputedStyle(document.getElementById('led21')).visibility === "visible" && 
  window.getComputedStyle(document.getElementById('R21')).visibility === "visible" && window.getComputedStyle(document.getElementById('supply2')).visibility === "visible")
  {
  check_button.disabled=false;

  }
}



var groups = ['input_A', 'input_B', 'row1', 'row2', 'row3', 'row4', 'row5', 'row6', 'row7', 'row8', 'VCC', 'GND', 'led21_A', 'led21_C', 'led22_A', 'led22_C', 'led23_A', 'led23_C', 'R21_A', 'R21_B', 'led31_A', 'led31_C', 'led32_A', 'led32_C', 'led33_A', 'led33_C', 'R31_A', 'R31_B', 'R32_A', 'R32_B', 'R33_A', 'R33_B', 'R41_A', 'R41_B', 'led41_A', 'led41_C', 'ic7432_VCC', 'ic7432_4A', 'ic7432_4B', 'ic7432_4Y', 'ic7432_3A', 'ic7432_3B', 'ic7432_3Y', 'ic7432_1A', 'ic7432_1B', 'ic7432_1Y', 'ic7432_2A', 'ic7432_2B', 'ic7432_2Y', 'ic7432_GND']
var con2=false;
var con3=false;


function checkCircuit() {


    var g = new Graph(21);


    var radio = document.getElementsByName('radio');
    var run;
    for (i = 0; i < radio.length; i++) {
        if (radio[i].checked)
            run = radio[i].value;
    }
    console.log(run);

    if (run == "Series") {
        con2 = false;
        console.log(groups.length)

        for (var i = 0; i < groups.length; i++) { //inserting groups vertexes
            g.addVertex(groups[i]);
        }

        for (key in connections) { // adding edges
            g.addEdge(connections[key].endpoints[0].getParameter('groupName'), connections[key].endpoints[1].getParameter('groupName'));
        }

        var edges= (g.numberofedges);
   console.log('edges:'+edges)
   if(edges == 0)
   {
       alert("No connections present.");   
       return;
   }


        if (
            (g.isConnected("VCC", "R21_A") && g.isConnected("R21_B", "led21_A") && g.isConnected("led21_C", "led22_A") && g.isConnected("led22_C", "led23_A") && g.isConnected("led23_C", "GND")) ||
            (g.isConnected("VCC", "R21_A") && g.isConnected("R21_B", "led21_A") && g.isConnected("led21_C", "led23_A") && g.isConnected("led23_C", "led22_A") && g.isConnected("led22_C", "GND")) ||
            (g.isConnected("VCC", "R21_A") && g.isConnected("R21_B", "led22_A") && g.isConnected("led22_C", "led21_A") && g.isConnected("led21_C", "led23_A") && g.isConnected("led23_C", "GND")) ||
            (g.isConnected("VCC", "R21_A") && g.isConnected("R21_B", "led22_A") && g.isConnected("led22_C", "led23_A") && g.isConnected("led23_C", "led21_A") && g.isConnected("led21_C", "GND")) ||
            (g.isConnected("VCC", "R21_A") && g.isConnected("R21_B", "led23_A") && g.isConnected("led23_C", "led21_A") && g.isConnected("led21_C", "led22_A") && g.isConnected("led22_C", "GND")) ||
            (g.isConnected("VCC", "R21_A") && g.isConnected("R21_B", "led23_A") && g.isConnected("led23_C", "led22_A") && g.isConnected("led22_C", "led21_A") && g.isConnected("led21_C", "GND")) ||

            (g.isConnected("VCC", "R21_B") && g.isConnected("R21_A", "led21_A") && g.isConnected("led21_C", "led22_A") && g.isConnected("led22_C", "led23_A") && g.isConnected("led23_C", "GND")) ||
            (g.isConnected("VCC", "R21_B") && g.isConnected("R21_A", "led21_A") && g.isConnected("led21_C", "led23_A") && g.isConnected("led23_C", "led22_A") && g.isConnected("led22_C", "GND")) ||
            (g.isConnected("VCC", "R21_B") && g.isConnected("R21_A", "led22_A") && g.isConnected("led22_C", "led21_A") && g.isConnected("led21_C", "led23_A") && g.isConnected("led23_C", "GND")) ||
            (g.isConnected("VCC", "R21_B") && g.isConnected("R21_A", "led22_A") && g.isConnected("led22_C", "led23_A") && g.isConnected("led23_C", "led21_A") && g.isConnected("led21_C", "GND")) ||
            (g.isConnected("VCC", "R21_B") && g.isConnected("R21_A", "led23_A") && g.isConnected("led23_C", "led21_A") && g.isConnected("led21_C", "led22_A") && g.isConnected("led22_C", "GND")) ||
            (g.isConnected("VCC", "R21_B") && g.isConnected("R21_A", "led23_A") && g.isConnected("led23_C", "led22_A") && g.isConnected("led22_C", "led21_A") && g.isConnected("led21_C", "GND"))
        ) {
            con2 = true;
            alert("Right Connections");
          // p1.setEnabled(false);
        
            document.getElementById("led21").style.backgroundImage = "url('images/led1.png')";
            document.getElementById("led22").style.backgroundImage = "url('images/led1.png')";
            document.getElementById("led23").style.backgroundImage = "url('images/led1.png')";

        } else {
            alert("Wrong Connections")
        }

    } else if (run == "Parallel") {
        con3 = false;

        console.log(groups.length)

        for (var i = 0; i < groups.length; i++) { //inserting groups vertexes
            g.addVertex(groups[i]);
        }

        for (key in connections) { // adding edges
            g.addEdge(connections[key].endpoints[0].getParameter('groupName'), connections[key].endpoints[1].getParameter('groupName'));
        }

        var edges= (g.numberofedges);
        console.log('edges:'+edges)
        if(edges == 0)
        {
            alert("No connections present.");   
            return;
        }

        if (
            (g.isConnected("VCC", "R31_A") && g.isConnected("R31_B", "led31_A") && g.isConnected("led31_C", "GND") &&
                g.isConnected("VCC", "R32_A") && g.isConnected("R32_B", "led32_A") && g.isConnected("led32_C", "GND") &&
                g.isConnected("VCC", "R33_A") && g.isConnected("R33_B", "led33_A") && g.isConnected("led33_C", "GND")) ||
            (g.isConnected("VCC", "R31_A") && g.isConnected("R31_B", "led31_A") && g.isConnected("led31_C", "GND") &&
                g.isConnected("VCC", "R32_A") && g.isConnected("R32_B", "led33_A") && g.isConnected("led33_C", "GND") &&
                g.isConnected("VCC", "R33_A") && g.isConnected("R33_B", "led32_A") && g.isConnected("led32_C", "GND")) ||
            (g.isConnected("VCC", "R31_A") && g.isConnected("R31_B", "led32_A") && g.isConnected("led32_C", "GND") &&
                g.isConnected("VCC", "R32_A") && g.isConnected("R32_B", "led31_A") && g.isConnected("led31_C", "GND") &&
                g.isConnected("VCC", "R33_A") && g.isConnected("R33_B", "led33_A") && g.isConnected("led33_C", "GND")) ||
            (g.isConnected("VCC", "R31_A") && g.isConnected("R31_B", "led33_A") && g.isConnected("led33_C", "GND") &&
                g.isConnected("VCC", "R32_A") && g.isConnected("R32_B", "led31_A") && g.isConnected("led31_C", "GND") &&
                g.isConnected("VCC", "R33_A") && g.isConnected("R33_B", "led32_A") && g.isConnected("led32_C", "GND")) ||
            (g.isConnected("VCC", "R31_A") && g.isConnected("R31_B", "led32_A") && g.isConnected("led32_C", "GND") &&
                g.isConnected("VCC", "R32_A") && g.isConnected("R32_B", "led33_A") && g.isConnected("led33_C", "GND") &&
                g.isConnected("VCC", "R33_A") && g.isConnected("R33_B", "led31_A") && g.isConnected("led31_C", "GND")) ||
            (g.isConnected("VCC", "R31_A") && g.isConnected("R31_B", "led33_A") && g.isConnected("led33_C", "GND") &&
                g.isConnected("VCC", "R32_A") && g.isConnected("R32_B", "led32_A") && g.isConnected("led32_C", "GND") &&
                g.isConnected("VCC", "R33_A") && g.isConnected("R33_B", "led31_A") && g.isConnected("led31_C", "GND")) ||



            (g.isConnected("VCC", "R31_B") && g.isConnected("R31_A", "led31_A") && g.isConnected("led31_C", "GND") &&
                g.isConnected("VCC", "R32_B") && g.isConnected("R32_A", "led32_A") && g.isConnected("led32_C", "GND") &&
                g.isConnected("VCC", "R33_B") && g.isConnected("R33_A", "led33_A") && g.isConnected("led33_C", "GND")) ||
            (g.isConnected("VCC", "R31_B") && g.isConnected("R31_A", "led31_A") && g.isConnected("led31_C", "GND") &&
                g.isConnected("VCC", "R32_B") && g.isConnected("R32_A", "led33_A") && g.isConnected("led33_C", "GND") &&
                g.isConnected("VCC", "R33_B") && g.isConnected("R33_A", "led32_A") && g.isConnected("led32_C", "GND")) ||
            (g.isConnected("VCC", "R31_B") && g.isConnected("R31_A", "led32_A") && g.isConnected("led32_C", "GND") &&
                g.isConnected("VCC", "R32_B") && g.isConnected("R32_A", "led31_A") && g.isConnected("led31_C", "GND") &&
                g.isConnected("VCC", "R33_B") && g.isConnected("R33_A", "led33_A") && g.isConnected("led33_C", "GND")) ||
            (g.isConnected("VCC", "R31_B") && g.isConnected("R31_A", "led33_A") && g.isConnected("led33_C", "GND") &&
                g.isConnected("VCC", "R32_B") && g.isConnected("R32_A", "led31_A") && g.isConnected("led31_C", "GND") &&
                g.isConnected("VCC", "R33_B") && g.isConnected("R33_A", "led32_A") && g.isConnected("led32_C", "GND")) ||
            (g.isConnected("VCC", "R31_B") && g.isConnected("R31_A", "led32_A") && g.isConnected("led32_C", "GND") &&
                g.isConnected("VCC", "R32_B") && g.isConnected("R32_A", "led33_A") && g.isConnected("led33_C", "GND") &&
                g.isConnected("VCC", "R33_B") && g.isConnected("R33_A", "led31_A") && g.isConnected("led31_C", "GND")) ||
            (g.isConnected("VCC", "R31_B") && g.isConnected("R31_A", "led33_A") && g.isConnected("led33_C", "GND") &&
                g.isConnected("VCC", "R32_B") && g.isConnected("R32_A", "led32_A") && g.isConnected("led32_C", "GND") &&
                g.isConnected("VCC", "R33_B") && g.isConnected("R33_A", "led31_A") && g.isConnected("led31_C", "GND"))
        ) {
            con3 = true;
            alert("Right Connections")
            document.getElementById("led31").style.backgroundImage = "url('images/led1.png')";
            document.getElementById("led32").style.backgroundImage = "url('images/led1.png')";
            document.getElementById("led33").style.backgroundImage = "url('images/led1.png')";
        } else {
            alert("Wrong Connections")
        }
    }




    console.log("executed")
}



//Simulation 3 codes
//Instructions
const First3 = document.getElementById('First3');
const close_btn3 = document.getElementById('close-btn3');
const First_data3 = document.getElementById('First_Data3');

First3.addEventListener('click', () => {
    First_data3.classList.toggle('visible')
});

close_btn3.addEventListener('click', () => {
    First_data3.classList.remove('visible')
});

//Components

const bread3_but=document.getElementById("breadbutton3");
const supply3_but=document.getElementById("supplybutton3");
const r3_but=document.getElementById("resistancebutton3");
const led3_but=document.getElementById("ledbutton3");



function breadboard3() {
    var x = document.getElementById("board3");
    x.style.visibility = "visible";

    bread3_but.disabled=true;
    bread3_but.style.cursor="not-allowed";

    var instance = new BoardController();

    instance.setJsPlumbInstance(jsPlumb);
    instance.initDefault();
    instance.setCircuitContainer('mid3');

    //breadboard definition 
    {
        instance.addEndPoint(4.5, 'board3', 'row1', 'r1', [0, 0, 0, -1, 59, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r2', [0, 0, 0, -1, 72.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r4', [0, 0, 0, -1, 99.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r5', [0, 0, 0, -1, 113, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r3', [0, 0, 0, -1, 86, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r9', [0, 0, 0, -1, 180.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r11', [0, 0, 0, -1, 221, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r8', [0, 0, 0, -1, 167, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r6', [0, 0, 0, -1, 140, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r10', [0, 0, 0, -1, 194, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r14', [0, 0, 0, -1, 261.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r15', [0, 0, 0, -1, 275, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r7', [0, 0, 0, -1, 153.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r16', [0, 0, 0, -1, 302, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r12', [0, 0, 0, -1, 234.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r19', [0, 0, 0, -1, 342.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r20', [0, 0, 0, -1, 356, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r18', [0, 0, 0, -1, 329, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r21', [0, 0, 0, -1, 383, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r17', [0, 0, 0, -1, 315.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r13', [0, 0, 0, -1, 248, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r22', [0, 0, 0, -1, 396.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r23', [0, 0, 0, -1, 410, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r24', [0, 0, 0, -1, 423.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row1', 'r25', [0, 0, 0, 0, 437, 26], 'blue');



        instance.addEndPoint(4.5, 'board3', 'row2', 'r27', [0, 0, 0, 1, 72.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r26', [0, 0, 0, 1, 59, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r30', [0, 0, 0, 1, 113, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r28', [0, 0, 0, 1, 86, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r32', [0, 0, 0, 1, 153.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r31', [0, 0, 0, 1, 140, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r29', [0, 0, 0, 1, 99.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r35', [0, 0, 0, 1, 194, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r34', [0, 0, 0, 1, 180.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r36', [0, 0, 0, 1, 221, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r33', [0, 0, 0, 1, 167, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r37', [0, 0, 0, 1, 234.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r38', [0, 0, 0, 1, 248, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r39', [0, 0, 0, 1, 261.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r41', [0, 0, 0, 1, 302, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r40', [0, 0, 0, 1, 275, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r42', [0, 0, 0, 1, 315.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r43', [0, 0, 0, 1, 329, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r45', [0, 0, 0, 1, 356, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r44', [0, 0, 0, 1, 342.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r46', [0, 0, 0, 1, 383, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r47', [0, 0, 0, 1, 396.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r49', [0, 0, 0, 1, 423.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r50', [0, 0, 0, 0, 437, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row2', 'r48', [0, 0, 0, 1, 410, 39.5], 'blue');



        instance.addEndPoint(4.5, 'board3', 'row3', 'r51', [0, 0, 0, 0, 478, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r52', [0, 0, 0, -1, 491.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r55', [0, 0, 0, -1, 532, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r54', [0, 0, 0, -1, 518.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r53', [0, 0, 0, -1, 505, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r56', [0, 0, 0, -1, 559, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r57', [0, 0, 0, -1, 572.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r58', [0, 0, 0, -1, 586, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r59', [0, 0, 0, -1, 599.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r61', [0, 0, 0, -1, 640, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r62', [0, 0, 0, -1, 653.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r60', [0, 0, 0, -1, 613, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r63', [0, 0, 0, -1, 667, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r64', [0, 0, 0, -1, 680.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r66', [0, 0, 0, -1, 721, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r67', [0, 0, 0, -1, 734.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r65', [0, 0, 0, -1, 694, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r68', [0, 0, 0, -1, 748, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r69', [0, 0, 0, -1, 761.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r72', [0, 0, 0, -1, 815.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r71', [0, 0, 0, -1, 802, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r70', [0, 0, 0, -1, 775, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r73', [0, 0, 0, -1, 829, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r75', [0, 0, 0, -1, 856, 26], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row3', 'r74', [0, 0, 0, -1, 842.5, 26], 'blue');



        instance.addEndPoint(4.5, 'board3', 'row4', 'r77', [0, 0, 0, 1, 491.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r78', [0, 0, 0, 1, 505, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r81', [0, 0, 0, 1, 559, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r76', [0, 0, 0, 0, 478, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r82', [0, 0, 0, 1, 572.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r79', [0, 0, 0, 1, 518.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r80', [0, 0, 0, 1, 532, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r84', [0, 0, 0, 1, 599.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r86', [0, 0, 0, 1, 640, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r85', [0, 0, 0, 1, 613, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r87', [0, 0, 0, 1, 653.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r89', [0, 0, 0, 1, 680.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r88', [0, 0, 0, 1, 667, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r91', [0, 0, 0, 1, 721, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r83', [0, 0, 0, 1, 586, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r90', [0, 0, 0, 1, 694, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r92', [0, 0, 0, 1, 734.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r96', [0, 0, 0, 1, 802, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r95', [0, 0, 0, 1, 775, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r94', [0, 0, 0, 1, 761.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r93', [0, 0, 0, 1, 748, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r97', [0, 0, 0, 1, 815.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r99', [0, 0, 0, 1, 842.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r98', [0, 0, 0, 1, 829, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row4', 'r100', [0, 0, 0, 1, 856, 39.5], 'blue');


        instance.addEndPoint(4.5, 'board3', 'row5', 'r101', [0, 0, 0, -1, 59.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r102', [0, 0, 0, -1, 73, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r103', [0, 0, 0, -1, 86.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r104', [0, 0, 0, -1, 100, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r105', [0, 0, 0, -1, 113.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r106', [0, 0, 0, -1, 140.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r108', [0, 0, 0, -1, 167.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r110', [0, 0, 0, -1, 194.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r107', [0, 0, 0, -1, 154, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r109', [0, 0, 0, -1, 181, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r111', [0, 0, 0, -1, 221.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r112', [0, 0, 0, -1, 235, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r113', [0, 0, 0, -1, 248.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r115', [0, 0, 0, -1, 275.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r114', [0, 0, 0, -1, 262, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r117', [0, 0, 0, -1, 316, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r118', [0, 0, 0, -1, 329.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r116', [0, 0, 0, -1, 302.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r119', [0, 0, 0, -1, 343, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r120', [0, 0, 0, -1, 356.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r121', [0, 0, 0, -1, 383.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r122', [0, 0, 0, -1, 397, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r124', [0, 0, 0, -1, 424, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r123', [0, 0, 0, -1, 410.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row5', 'r125', [0, 0, 0, 0, 434.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r127', [0, 0, 0, 1, 73, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r126', [0, 0, 0, 1, 59.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r129', [0, 0, 0, 1, 100, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r128', [0, 0, 0, 1, 86.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r130', [0, 0, 0, 1, 113.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r131', [0, 0, 0, 1, 140.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r132', [0, 0, 0, 1, 154, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r133', [0, 0, 0, 1, 167.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r134', [0, 0, 0, 1, 181, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r136', [0, 0, 0, 1, 221.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r135', [0, 0, 0, 1, 194.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r137', [0, 0, 0, 1, 235, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r138', [0, 0, 0, 1, 248.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r140', [0, 0, 0, 1, 275.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r142', [0, 0, 0, 1, 316, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r139', [0, 0, 0, 1, 262, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r141', [0, 0, 0, 1, 302.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r143', [0, 0, 0, 1, 329.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r145', [0, 0, 0, 1, 356.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r144', [0, 0, 0, 1, 343, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r147', [0, 0, 0, 1, 397, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r146', [0, 0, 0, 1, 383.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r148', [0, 0, 0, 1, 410.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r149', [0, 0, 0, 1, 424, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row6', 'r150', [0, 0, 0, 1, 437.5, 282.5], 'blue');



        instance.addEndPoint(4.5, 'board3', 'row7', 'r151', [0, 0, 0, 0, 478, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r152', [0, 0, 0, -1, 491.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r155', [0, 0, 0, -1, 532, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r153', [0, 0, 0, -1, 505, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r157', [0, 0, 0, -1, 572.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r156', [0, 0, 0, -1, 559, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r154', [0, 0, 0, -1, 518.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r160', [0, 0, 0, -1, 613, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r162', [0, 0, 0, -1, 653.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r161', [0, 0, 0, -1, 640, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r159', [0, 0, 0, -1, 599.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r158', [0, 0, 0, -1, 586, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r163', [0, 0, 0, -1, 667, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r164', [0, 0, 0, -1, 680.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r165', [0, 0, 0, -1, 694, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r166', [0, 0, 0, -1, 721, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r168', [0, 0, 0, -1, 748, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r167', [0, 0, 0, -1, 734.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r169', [0, 0, 0, -1, 761.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r170', [0, 0, 0, -1, 775, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r171', [0, 0, 0, -1, 802, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r172', [0, 0, 0, -1, 814.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r174', [0, 0, 0, -1, 842.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r173', [0, 0, 0, -1, 829, 269], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row7', 'r175', [0, 0, 0, -1, 856, 269], 'blue');


        instance.addEndPoint(4.5, 'board3', 'row8', 'r176', [0, 0, 0, 1, 478, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r177', [0, 0, 0, 1, 491.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r180', [0, 0, 0, 1, 532, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r178', [0, 0, 0, 1, 505, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r182', [0, 0, 0, 1, 572.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r181', [0, 0, 0, 1, 559, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r179', [0, 0, 0, 1, 518.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r187', [0, 0, 0, 1, 653.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r183', [0, 0, 0, 1, 586, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r186', [0, 0, 0, 1, 640, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r185', [0, 0, 0, 1, 613, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r184', [0, 0, 0, 1, 599.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r188', [0, 0, 0, 1, 667, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r189', [0, 0, 0, 1, 680.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r191', [0, 0, 0, 1, 721, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r190', [0, 0, 0, 1, 694, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r192', [0, 0, 0, 1, 734.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r193', [0, 0, 0, 1, 748, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r194', [0, 0, 0, 1, 761.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r196', [0, 0, 0, 1, 802, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r195', [0, 0, 0, 1, 775, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r197', [0, 0, 0, 1, 815.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r198', [0, 0, 0, 1, 829, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r199', [0, 0, 0, 1, 842.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board3', 'row8', 'r200', [0, 0, 0, 1, 856, 282.5], 'blue');
    }

    disabledButton3();
}

function supply3() {
    var x = document.getElementById("supply3");
    x.style.visibility = "visible";


    supply3_but.disabled=true;
    supply3_but.style.cursor="not-allowed";

    var supply = new BoardController();
    supply.setJsPlumbInstance(jsPlumb);
    supply.setCircuitContainer('mid3');

    supply.addEndPoint(8, 'supply3', 'VCC', 'VCC', [0, 0, -1, 0, 40, 45], 'blue', 'red');
    supply.addEndPoint(8, 'supply3', 'GND', 'GND', [0, 0, 1, 0, 80, 45], 'red', 'black');

    disabledButton3();
}

function R31() {
    var x = document.getElementById("R31");
    x.style.visibility = "visible";
    
    r3_but.disabled=true;
    r3_but.style.cursor="not-allowed";

    var elms = document.querySelectorAll("[id='r31']");
 
for(var i = 0; i < elms.length; i++) 
  elms[i].style.visibility='visible';

    var R21 = new BoardController();
    R21.setJsPlumbInstance(jsPlumb);
    R21.setCircuitContainer('mid3');

    R21.addEndPoint(4.2, 'R31', 'R31_A', 'R31_A01', [0, 0, -1, 0, 8, 4], 'red');
    R21.addEndPoint(4.2, 'R31', 'R31_A', 'R31_A02', [0, 0, -1, 0, 8, 17.5], 'red');
    R21.addEndPoint(4.2, 'R31', 'R31_A', 'R31_A03', [0, 0, -1, 0, 8, 31], 'red');
    R21.addEndPoint(4.2, 'R31', 'R31_A', 'R31_A04', [0, 0, -1, 0, 8, 44.5], 'red');
    R21.addEndPoint(4.2, 'R31', 'R31_B', 'R31_B01', [0, 0, 0, 1, 8, 111.5], 'red');
    R21.addEndPoint(4.2, 'R31', 'R31_B', 'R31_B02', [0, 0, 0, 1, 8, 125], 'red');
    R21.addEndPoint(4.2, 'R31', 'R31_B', 'R31_B03', [0, 0, 0, 1, 8, 138.5], 'red');
    R21.addEndPoint(4.2, 'R31', 'R31_B', 'R31_B04', [0, 0, 0, 1, 8, 152], 'red');

    disabledButton3();
}

function R32() {
    var x = document.getElementById("R32");
    x.style.visibility = "visible";
    
    r3_but.disabled=true;
    r3_but.style.cursor="not-allowed";

    var elms = document.querySelectorAll("[id='r32']");
 
      for(var i = 0; i < elms.length; i++) 
         elms[i].style.visibility='visible';

    var R21 = new BoardController();
    R21.setJsPlumbInstance(jsPlumb);
    R21.setCircuitContainer('mid3');

    R21.addEndPoint(4.2, 'R32', 'R32_A', 'R32_A01', [0, 0, -1, 0, 8, 4], 'red');
    R21.addEndPoint(4.2, 'R32', 'R32_A', 'R32_A02', [0, 0, -1, 0, 8, 17.5], 'red');
    R21.addEndPoint(4.2, 'R32', 'R32_A', 'R32_A03', [0, 0, -1, 0, 8, 31], 'red');
    R21.addEndPoint(4.2, 'R32', 'R32_A', 'R32_A04', [0, 0, -1, 0, 8, 44.5], 'red');
    R21.addEndPoint(4.2, 'R32', 'R32_B', 'R32_B01', [0, 0, 0, 1, 8, 111.5], 'red');
    R21.addEndPoint(4.2, 'R32', 'R32_B', 'R32_B02', [0, 0, 0, 1, 8, 125], 'red');
    R21.addEndPoint(4.2, 'R32', 'R32_B', 'R32_B03', [0, 0, 0, 1, 8, 138.5], 'red');
    R21.addEndPoint(4.2, 'R32', 'R32_B', 'R32_B04', [0, 0, 0, 1, 8, 152], 'red');

    disabledButton3();
}

function R33() {
    var x = document.getElementById("R33");
    x.style.visibility = "visible";

    r3_but.disabled=true;
    r3_but.style.cursor="not-allowed";

    var elms = document.querySelectorAll("[id='r33']");
 
      for(var i = 0; i < elms.length; i++) 
         elms[i].style.visibility='visible';
    var R21 = new BoardController();
    R21.setJsPlumbInstance(jsPlumb);
    R21.setCircuitContainer('mid3');

    R21.addEndPoint(4.2, 'R33', 'R33_A', 'R33_A01', [0, 0, -1, 0, 8, 4], 'red');
    R21.addEndPoint(4.2, 'R33', 'R33_A', 'R33_A02', [0, 0, -1, 0, 8, 17.5], 'red');
    R21.addEndPoint(4.2, 'R33', 'R33_A', 'R33_A03', [0, 0, -1, 0, 8, 31], 'red');
    R21.addEndPoint(4.2, 'R33', 'R33_A', 'R33_A04', [0, 0, -1, 0, 8, 44.5], 'red');
    R21.addEndPoint(4.2, 'R33', 'R33_B', 'R33_B01', [0, 0, 0, 1, 8, 111.5], 'red');
    R21.addEndPoint(4.2, 'R33', 'R33_B', 'R33_B02', [0, 0, 0, 1, 8, 125], 'red');
    R21.addEndPoint(4.2, 'R33', 'R33_B', 'R33_B03', [0, 0, 0, 1, 8, 138.5], 'red');
    R21.addEndPoint(4.2, 'R33', 'R33_B', 'R33_B04', [0, 0, 0, 1, 8, 152], 'red');

    disabledButton3();
}

function led31() {
    var x = document.getElementById("led31");
    x.style.visibility = "visible";

    led3_but.disabled=true;
    led3_but.style.cursor="not-allowed";

    var elms = document.querySelectorAll("[id='l31']");
 
      for(var i = 0; i < elms.length; i++) 
         elms[i].style.visibility='visible';

    var led = new BoardController();
    led.setJsPlumbInstance(jsPlumb);
    led.setCircuitContainer('mid3');

    led.addEndPoint(4.5, 'led31', 'led31_A', 'led31_A01', [0, 0, 0, 1, 10, 78], 'red');
    led.addEndPoint(4.5, 'led31', 'led31_A', 'led31_A02', [0, 0, 0, 1, 10, 91.5], 'red');
    led.addEndPoint(4.5, 'led31', 'led31_A', 'led31_A03', [0, 0, 0, 1, 10, 104], 'red');
    led.addEndPoint(4.5, 'led31', 'led31_A', 'led31_A04', [0, 0, 0, 1, 10, 118.5], 'red');
    led.addEndPoint(4.5, 'led31', 'led31_A', 'led31_A05', [0, 0, 0, 1, 10, 132], 'red');

    led.addEndPoint(4.5, 'led31', 'led31_C', 'led31_C01', [0, 0, 1, 0, 23.5, 78], 'red');
    led.addEndPoint(4.5, 'led31', 'led31_C', 'led31_C02', [0, 0, 1, 0, 23.5, 91.5], 'red');
    led.addEndPoint(4.5, 'led31', 'led31_C', 'led31_C03', [0, 0, 1, 0, 23.5, 104], 'red');
    led.addEndPoint(4.5, 'led31', 'led31_C', 'led31_C04', [0, 0, 1, 0, 23.5, 118.5], 'red');
    led.addEndPoint(4.5, 'led31', 'led31_C', 'led31_C05', [0, 0, 1, 0, 23.5, 132], 'red');

    disabledButton3();
}

function led32() {
    var x = document.getElementById("led32");
    x.style.visibility = "visible";

    led3_but.disabled=true;
    led3_but.style.cursor="not-allowed";

    var elms = document.querySelectorAll("[id='l32']");
 
      for(var i = 0; i < elms.length; i++) 
         elms[i].style.visibility='visible';
    var led = new BoardController();
    led.setJsPlumbInstance(jsPlumb);
    led.setCircuitContainer('mid3');

    led.addEndPoint(4.5, 'led32', 'led32_A', 'led32_A01', [0, 0, 0, 1, 10, 78], 'red');
    led.addEndPoint(4.5, 'led32', 'led32_A', 'led32_A02', [0, 0, 0, 1, 10, 91.5], 'red');
    led.addEndPoint(4.5, 'led32', 'led32_A', 'led32_A03', [0, 0, 0, 1, 10, 104], 'red');
    led.addEndPoint(4.5, 'led32', 'led32_A', 'led32_A04', [0, 0, 0, 1, 10, 118.5], 'red');
    led.addEndPoint(4.5, 'led32', 'led32_A', 'led32_A05', [0, 0, 0, 1, 10, 132], 'red');

    led.addEndPoint(4.5, 'led32', 'led32_C', 'led32_C01', [0, 0, 1, 0, 23.5, 78], 'red');
    led.addEndPoint(4.5, 'led32', 'led32_C', 'led32_C02', [0, 0, 1, 0, 23.5, 91.5], 'red');
    led.addEndPoint(4.5, 'led32', 'led32_C', 'led32_C03', [0, 0, 1, 0, 23.5, 104], 'red');
    led.addEndPoint(4.5, 'led32', 'led32_C', 'led32_C04', [0, 0, 1, 0, 23.5, 118.5], 'red');
    led.addEndPoint(4.5, 'led32', 'led32_C', 'led32_C05', [0, 0, 1, 0, 23.5, 132], 'red');

    disabledButton3();
}

function led33() {
    var x = document.getElementById("led33");
    x.style.visibility = "visible";

    led3_but.disabled=true;
    led3_but.style.cursor="not-allowed";

    var elms = document.querySelectorAll("[id='l33']");
 
      for(var i = 0; i < elms.length; i++) 
         elms[i].style.visibility='visible';
    var led = new BoardController();
    led.setJsPlumbInstance(jsPlumb);
    led.setCircuitContainer('mid3');

    led.addEndPoint(4.5, 'led33', 'led33_A', 'led33_A01', [0, 0, 0, 1, 10, 78], 'red');
    led.addEndPoint(4.5, 'led33', 'led33_A', 'led33_A02', [0, 0, 0, 1, 10, 91.5], 'red');
    led.addEndPoint(4.5, 'led33', 'led33_A', 'led33_A03', [0, 0, 0, 1, 10, 104], 'red');
    led.addEndPoint(4.5, 'led33', 'led33_A', 'led33_A04', [0, 0, 0, 1, 10, 118.5], 'red');
    led.addEndPoint(4.5, 'led33', 'led33_A', 'led33_A05', [0, 0, 0, 1, 10, 132], 'red');

    led.addEndPoint(4.5, 'led33', 'led33_C', 'led33_C01', [0, 0, 1, 0, 23.5, 78], 'red');
    led.addEndPoint(4.5, 'led33', 'led33_C', 'led33_C02', [0, 0, 1, 0, 23.5, 91.5], 'red');
    led.addEndPoint(4.5, 'led33', 'led33_C', 'led33_C03', [0, 0, 1, 0, 23.5, 104], 'red');
    led.addEndPoint(4.5, 'led33', 'led33_C', 'led33_C04', [0, 0, 1, 0, 23.5, 118.5], 'red');
    led.addEndPoint(4.5, 'led33', 'led33_C', 'led33_C05', [0, 0, 1, 0, 23.5, 132], 'red');

    disabledButton3();
}

function disabledButton3()
{

  if(window.getComputedStyle(document.getElementById('board3')).visibility === "visible" && window.getComputedStyle(document.getElementById('led31')).visibility === "visible" && 
  window.getComputedStyle(document.getElementById('R31')).visibility === "visible" && window.getComputedStyle(document.getElementById('supply3')).visibility === "visible")
  {
  check_button.disabled=false;

  }
}

const First4 = document.getElementById('First4');
const close_btn4 = document.getElementById('close-btn4');
const First_data4 = document.getElementById('First_Data4');

First4.addEventListener('click', () => {
    First_data4.classList.toggle('visible')
});

close_btn4.addEventListener('click', () => {
    First_data4.classList.remove('visible')
});

const bread4_but=document.getElementById("breadbutton4");
const supply4_but=document.getElementById("supplybutton4");
const r4_but=document.getElementById("resistancebutton4");
const led4_but=document.getElementById("ledbutton4");
const ic4_but=document.getElementById("icbutton4");
const inputs4_but=document.getElementById("inputsbutton4");

function breadboard4() {
    var x = document.getElementById("board4");
    x.style.visibility = "visible";

    bread4_but.disabled=true;
    bread4_but.style.cursor="not-allowed";

    var instance = new BoardController();

    instance.setJsPlumbInstance(jsPlumb);
    instance.initDefault();
    instance.setCircuitContainer('mid4');

    //breadboard definition 
    {
        instance.addEndPoint(4.5, 'board4', 'row1', 'r1', [0, 0, 0, -1, 59, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r2', [0, 0, 0, -1, 72.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r4', [0, 0, 0, -1, 99.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r5', [0, 0, 0, -1, 113, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r3', [0, 0, 0, -1, 86, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r9', [0, 0, 0, -1, 180.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r11', [0, 0, 0, -1, 221, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r8', [0, 0, 0, -1, 167, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r6', [0, 0, 0, -1, 140, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r10', [0, 0, 0, -1, 194, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r14', [0, 0, 0, -1, 261.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r15', [0, 0, 0, -1, 275, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r7', [0, 0, 0, -1, 153.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r16', [0, 0, 0, -1, 302, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r12', [0, 0, 0, -1, 234.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r19', [0, 0, 0, -1, 342.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r20', [0, 0, 0, -1, 356, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r18', [0, 0, 0, -1, 329, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r21', [0, 0, 0, -1, 383, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r17', [0, 0, 0, -1, 315.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r13', [0, 0, 0, -1, 248, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r22', [0, 0, 0, -1, 396.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r23', [0, 0, 0, -1, 410, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r24', [0, 0, 0, -1, 423.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row1', 'r25', [0, 0, 0, 0, 437, 26], 'blue');



        instance.addEndPoint(4.5, 'board4', 'row2', 'r27', [0, 0, 0, 1, 72.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r26', [0, 0, 0, 1, 59, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r30', [0, 0, 0, 1, 113, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r28', [0, 0, 0, 1, 86, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r32', [0, 0, 0, 1, 153.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r31', [0, 0, 0, 1, 140, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r29', [0, 0, 0, 1, 99.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r35', [0, 0, 0, 1, 194, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r34', [0, 0, 0, 1, 180.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r36', [0, 0, 0, 1, 221, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r33', [0, 0, 0, 1, 167, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r37', [0, 0, 0, 1, 234.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r38', [0, 0, 0, 1, 248, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r39', [0, 0, 0, 1, 261.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r41', [0, 0, 0, 1, 302, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r40', [0, 0, 0, 1, 275, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r42', [0, 0, 0, 1, 315.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r43', [0, 0, 0, 1, 329, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r45', [0, 0, 0, 1, 356, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r44', [0, 0, 0, 1, 342.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r46', [0, 0, 0, 1, 383, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r47', [0, 0, 0, 1, 396.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r49', [0, 0, 0, 1, 423.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r50', [0, 0, 0, 0, 437, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row2', 'r48', [0, 0, 0, 1, 410, 39.5], 'blue');



        instance.addEndPoint(4.5, 'board4', 'row3', 'r51', [0, 0, 0, 0, 478, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r52', [0, 0, 0, -1, 491.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r55', [0, 0, 0, -1, 532, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r54', [0, 0, 0, -1, 518.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r53', [0, 0, 0, -1, 505, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r56', [0, 0, 0, -1, 559, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r57', [0, 0, 0, -1, 572.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r58', [0, 0, 0, -1, 586, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r59', [0, 0, 0, -1, 599.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r61', [0, 0, 0, -1, 640, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r62', [0, 0, 0, -1, 653.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r60', [0, 0, 0, -1, 613, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r63', [0, 0, 0, -1, 667, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r64', [0, 0, 0, -1, 680.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r66', [0, 0, 0, -1, 721, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r67', [0, 0, 0, -1, 734.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r65', [0, 0, 0, -1, 694, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r68', [0, 0, 0, -1, 748, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r69', [0, 0, 0, -1, 761.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r72', [0, 0, 0, -1, 815.5, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r71', [0, 0, 0, -1, 802, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r70', [0, 0, 0, -1, 775, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r73', [0, 0, 0, -1, 829, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r75', [0, 0, 0, -1, 856, 26], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row3', 'r74', [0, 0, 0, -1, 842.5, 26], 'blue');



        instance.addEndPoint(4.5, 'board4', 'row4', 'r77', [0, 0, 0, 1, 491.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r78', [0, 0, 0, 1, 505, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r81', [0, 0, 0, 1, 559, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r76', [0, 0, 0, 0, 478, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r82', [0, 0, 0, 1, 572.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r79', [0, 0, 0, 1, 518.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r80', [0, 0, 0, 1, 532, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r84', [0, 0, 0, 1, 599.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r86', [0, 0, 0, 1, 640, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r85', [0, 0, 0, 1, 613, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r87', [0, 0, 0, 1, 653.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r89', [0, 0, 0, 1, 680.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r88', [0, 0, 0, 1, 667, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r91', [0, 0, 0, 1, 721, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r83', [0, 0, 0, 1, 586, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r90', [0, 0, 0, 1, 694, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r92', [0, 0, 0, 1, 734.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r96', [0, 0, 0, 1, 802, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r95', [0, 0, 0, 1, 775, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r94', [0, 0, 0, 1, 761.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r93', [0, 0, 0, 1, 748, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r97', [0, 0, 0, 1, 815.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r99', [0, 0, 0, 1, 842.5, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r98', [0, 0, 0, 1, 829, 39.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row4', 'r100', [0, 0, 0, 1, 856, 39.5], 'blue');


        instance.addEndPoint(4.5, 'board4', 'row5', 'r101', [0, 0, 0, -1, 59.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r102', [0, 0, 0, -1, 73, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r103', [0, 0, 0, -1, 86.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r104', [0, 0, 0, -1, 100, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r105', [0, 0, 0, -1, 113.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r106', [0, 0, 0, -1, 140.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r108', [0, 0, 0, -1, 167.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r110', [0, 0, 0, -1, 194.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r107', [0, 0, 0, -1, 154, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r109', [0, 0, 0, -1, 181, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r111', [0, 0, 0, -1, 221.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r112', [0, 0, 0, -1, 235, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r113', [0, 0, 0, -1, 248.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r115', [0, 0, 0, -1, 275.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r114', [0, 0, 0, -1, 262, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r117', [0, 0, 0, -1, 316, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r118', [0, 0, 0, -1, 329.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r116', [0, 0, 0, -1, 302.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r119', [0, 0, 0, -1, 343, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r120', [0, 0, 0, -1, 356.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r121', [0, 0, 0, -1, 383.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r122', [0, 0, 0, -1, 397, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r124', [0, 0, 0, -1, 424, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r123', [0, 0, 0, -1, 410.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row5', 'r125', [0, 0, 0, 0, 434.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r127', [0, 0, 0, 1, 73, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r126', [0, 0, 0, 1, 59.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r129', [0, 0, 0, 1, 100, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r128', [0, 0, 0, 1, 86.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r130', [0, 0, 0, 1, 113.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r131', [0, 0, 0, 1, 140.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r132', [0, 0, 0, 1, 154, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r133', [0, 0, 0, 1, 167.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r134', [0, 0, 0, 1, 181, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r136', [0, 0, 0, 1, 221.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r135', [0, 0, 0, 1, 194.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r137', [0, 0, 0, 1, 235, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r138', [0, 0, 0, 1, 248.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r140', [0, 0, 0, 1, 275.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r142', [0, 0, 0, 1, 316, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r139', [0, 0, 0, 1, 262, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r141', [0, 0, 0, 1, 302.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r143', [0, 0, 0, 1, 329.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r145', [0, 0, 0, 1, 356.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r144', [0, 0, 0, 1, 343, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r147', [0, 0, 0, 1, 397, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r146', [0, 0, 0, 1, 383.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r148', [0, 0, 0, 1, 410.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r149', [0, 0, 0, 1, 424, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row6', 'r150', [0, 0, 0, 1, 437.5, 282.5], 'blue');



        instance.addEndPoint(4.5, 'board4', 'row7', 'r151', [0, 0, 0, 0, 478, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r152', [0, 0, 0, -1, 491.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r155', [0, 0, 0, -1, 532, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r153', [0, 0, 0, -1, 505, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r157', [0, 0, 0, -1, 572.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r156', [0, 0, 0, -1, 559, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r154', [0, 0, 0, -1, 518.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r160', [0, 0, 0, -1, 613, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r162', [0, 0, 0, -1, 653.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r161', [0, 0, 0, -1, 640, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r159', [0, 0, 0, -1, 599.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r158', [0, 0, 0, -1, 586, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r163', [0, 0, 0, -1, 667, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r164', [0, 0, 0, -1, 680.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r165', [0, 0, 0, -1, 694, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r166', [0, 0, 0, -1, 721, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r168', [0, 0, 0, -1, 748, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r167', [0, 0, 0, -1, 734.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r169', [0, 0, 0, -1, 761.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r170', [0, 0, 0, -1, 775, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r171', [0, 0, 0, -1, 802, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r172', [0, 0, 0, -1, 814.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r174', [0, 0, 0, -1, 842.5, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r173', [0, 0, 0, -1, 829, 269], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row7', 'r175', [0, 0, 0, -1, 856, 269], 'blue');


        instance.addEndPoint(4.5, 'board4', 'row8', 'r176', [0, 0, 0, 1, 478, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r177', [0, 0, 0, 1, 491.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r180', [0, 0, 0, 1, 532, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r178', [0, 0, 0, 1, 505, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r182', [0, 0, 0, 1, 572.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r181', [0, 0, 0, 1, 559, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r179', [0, 0, 0, 1, 518.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r187', [0, 0, 0, 1, 653.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r183', [0, 0, 0, 1, 586, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r186', [0, 0, 0, 1, 640, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r185', [0, 0, 0, 1, 613, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r184', [0, 0, 0, 1, 599.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r188', [0, 0, 0, 1, 667, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r189', [0, 0, 0, 1, 680.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r191', [0, 0, 0, 1, 721, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r190', [0, 0, 0, 1, 694, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r192', [0, 0, 0, 1, 734.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r193', [0, 0, 0, 1, 748, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r194', [0, 0, 0, 1, 761.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r196', [0, 0, 0, 1, 802, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r195', [0, 0, 0, 1, 775, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r197', [0, 0, 0, 1, 815.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r198', [0, 0, 0, 1, 829, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r199', [0, 0, 0, 1, 842.5, 282.5], 'blue');
        instance.addEndPoint(4.5, 'board4', 'row8', 'r200', [0, 0, 0, 1, 856, 282.5], 'blue');
    }

    disabledButton4();
}

function supply4() {
    var x = document.getElementById("supply4");
    x.style.visibility = "visible";

    supply4_but.disabled=true;
    supply4_but.style.cursor="not-allowed";

    var supply = new BoardController();
    supply.setJsPlumbInstance(jsPlumb);
    supply.setCircuitContainer('mid4');

    supply.addEndPoint(8, 'supply4', 'VCC', 'VCC', [0, 0, -1, 0, 40, 45], 'blue', 'red');
    supply.addEndPoint(8, 'supply4', 'GND', 'GND', [0, 0, 1, 0, 80, 45], 'red', 'black');

    disabledButton4();
}

function R41() {
    var x = document.getElementById("R41");
    x.style.visibility = "visible";

    r4_but.disabled=true;
    r4_but.style.cursor="not-allowed";

    var elms = document.querySelectorAll("[id='r41']");
 
for(var i = 0; i < elms.length; i++) 
  elms[i].style.visibility='visible';
    var R21 = new BoardController();
    R21.setJsPlumbInstance(jsPlumb);
    R21.setCircuitContainer('mid4');

    R21.addEndPoint(4.2, 'R41', 'R41_A', 'R41_A01', [0, 0, -1, 0, 8, 4], 'red');
    R21.addEndPoint(4.2, 'R41', 'R41_A', 'R41_A02', [0, 0, -1, 0, 8, 17.5], 'red');
    R21.addEndPoint(4.2, 'R41', 'R41_A', 'R41_A03', [0, 0, -1, 0, 8, 31], 'red');
    R21.addEndPoint(4.2, 'R41', 'R41_A', 'R41_A04', [0, 0, -1, 0, 8, 44.5], 'red');
    R21.addEndPoint(4.2, 'R41', 'R41_B', 'R41_B01', [0, 0, 0, 1, 8, 111.5], 'red');
    R21.addEndPoint(4.2, 'R41', 'R41_B', 'R41_B02', [0, 0, 0, 1, 8, 125], 'red');
    R21.addEndPoint(4.2, 'R41', 'R41_B', 'R41_B03', [0, 0, 0, 1, 8, 138.5], 'red');
    R21.addEndPoint(4.2, 'R41', 'R41_B', 'R41_B04', [0, 0, 0, 1, 8, 152], 'red');

    disabledButton4();
}

function led41() {
    var x = document.getElementById("led41");
    x.style.visibility = "visible";
    
    led4_but.disabled=true;
    led4_but.style.cursor="not-allowed";

    var elms = document.querySelectorAll("[id='l41']");
 
   for(var i = 0; i < elms.length; i++) 
   elms[i].style.visibility='visible';

    var led = new BoardController();
    led.setJsPlumbInstance(jsPlumb);
    led.setCircuitContainer('mid4');

    led.addEndPoint(4.5, 'led41', 'led41_A', 'led41_A01', [0, 0, 0, 1, 10, 78], 'red');
    led.addEndPoint(4.5, 'led41', 'led41_A', 'led41_A02', [0, 0, 0, 1, 10, 91.5], 'red');
    led.addEndPoint(4.5, 'led41', 'led41_A', 'led41_A03', [0, 0, 0, 1, 10, 104], 'red');
    led.addEndPoint(4.5, 'led41', 'led41_A', 'led41_A04', [0, 0, 0, 1, 10, 118.5], 'red');
    led.addEndPoint(4.5, 'led41', 'led41_A', 'led41_A05', [0, 0, 0, 1, 10, 132], 'red');

    led.addEndPoint(4.5, 'led41', 'led41_C', 'led41_C01', [0, 0, 1, 0, 23.5, 78], 'red');
    led.addEndPoint(4.5, 'led41', 'led41_C', 'led41_C02', [0, 0, 1, 0, 23.5, 91.5], 'red');
    led.addEndPoint(4.5, 'led41', 'led41_C', 'led41_C03', [0, 0, 1, 0, 23.5, 104], 'red');
    led.addEndPoint(4.5, 'led41', 'led41_C', 'led41_C04', [0, 0, 1, 0, 23.5, 118.5], 'red');
    led.addEndPoint(4.5, 'led41', 'led41_C', 'led41_C05', [0, 0, 1, 0, 23.5, 132], 'red');

    disabledButton4();
}

function ic7432() {
    var x = document.getElementById("ic7432");
    x.style.visibility = "visible";

    ic4_but.disabled=true;
    ic4_but.style.cursor="not-allowed";

    var ic7432 = new BoardController();
    ic7432.setJsPlumbInstance(jsPlumb);
    ic7432.setCircuitContainer('mid4');

    {
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_VCC', 'ic7432_VCC01', [0, 0, 1, -1, 9, 4], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_VCC', 'ic7432_VCC02', [0, 0, 1, -1, 9, 17.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_VCC', 'ic7432_VCC03', [0, 0, 1, -1, 9, 31], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_VCC', 'ic7432_VCC04', [0, 0, 1, -1, 9, 44.5], 'red');


        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_4A', 'ic7432_4A01', [0, 0, 1, -1, 22.5, 4], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_4A', 'ic7432_4A02', [0, 0, 1, -1, 22.5, 17.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_4A', 'ic7432_4A03', [0, 0, 1, -1, 22.5, 31], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_4A', 'ic7432_4A04', [0, 0, 1, -1, 22.5, 44.5], 'red');


        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_4B', 'ic7432_4B01', [0, 0, 1, -1, 36, 4], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_4B', 'ic7432_4B02', [0, 0, 1, -1, 36, 17.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_4B', 'ic7432_4B03', [0, 0, 1, -1, 36, 31], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_4B', 'ic7432_4B04', [0, 0, 1, -1, 36, 44.5], 'red');


        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_4Y', 'ic7432_4Y01', [0, 0, 1, -1, 49.5, 4], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_4Y', 'ic7432_4Y02', [0, 0, 1, -1, 49.5, 17.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_4Y', 'ic7432_4Y03', [0, 0, 1, -1, 49.5, 31], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_4Y', 'ic7432_4Y04', [0, 0, 1, -1, 49.5, 44.5], 'red');


        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_3A', 'ic7432_3A01', [0, 0, 1, -1, 63, 4], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_3A', 'ic7432_3A02', [0, 0, 1, -1, 63, 17.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_3A', 'ic7432_3A03', [0, 0, 1, -1, 63, 31], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_3A', 'ic7432_3A04', [0, 0, 1, -1, 63, 44.5], 'red');


        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_3B', 'ic7432_3B01', [0, 0, 1, -1, 76.5, 4], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_3B', 'ic7432_3B02', [0, 0, 1, -1, 76.5, 17.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_3B', 'ic7432_3B03', [0, 0, 1, -1, 76.5, 31], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_3B', 'ic7432_3B04', [0, 0, 1, -1, 76.5, 44.5], 'red');


        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_3Y', 'ic7432_3Y01', [0, 0, 1, -1, 90, 4], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_3Y', 'ic7432_3Y02', [0, 0, 1, -1, 90, 17.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_3Y', 'ic7432_3Y03', [0, 0, 1, -1, 90, 31], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_3Y', 'ic7432_3Y04', [0, 0, 1, -1, 90, 44.5], 'red');



        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_1A', 'ic7432_1A02', [0, 0, 1, -1, 9, 111.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_1A', 'ic7432_1A03', [0, 0, 1, -1, 9, 125], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_1A', 'ic7432_1A04', [0, 0, 1, -1, 9, 138.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_1A', 'ic7432_1A05', [0, 0, 1, -1, 9, 152], 'red');


        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_1B', 'ic7432_1B02', [0, 0, 1, -1, 22.5, 111.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_1B', 'ic7432_1B03', [0, 0, 1, -1, 22.5, 125], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_1B', 'ic7432_1B04', [0, 0, 1, -1, 22.5, 138.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_1B', 'ic7432_1B05', [0, 0, 1, -1, 22.5, 152], 'red');


        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_1Y', 'ic7432_1Y02', [0, 0, 1, -1, 36, 111.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_1Y', 'ic7432_1Y03', [0, 0, 1, -1, 36, 125], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_1Y', 'ic7432_1Y04', [0, 0, 1, -1, 36, 138.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_1Y', 'ic7432_1Y05', [0, 0, 1, -1, 36, 152], 'red');


        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_2A', 'ic7432_2A02', [0, 0, 1, -1, 49.5, 111.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_2A', 'ic7432_2A03', [0, 0, 1, -1, 49.5, 125], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_2A', 'ic7432_2A04', [0, 0, 1, -1, 49.5, 138.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_2A', 'ic7432_2A05', [0, 0, 1, -1, 49.5, 152], 'red');


        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_2B', 'ic7432_2B02', [0, 0, 1, -1, 63, 111.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_2B', 'ic7432_2B03', [0, 0, 1, -1, 63, 125], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_2B', 'ic7432_2B04', [0, 0, 1, -1, 63, 138.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_2B', 'ic7432_2B05', [0, 0, 1, -1, 63, 152], 'red');


        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_2Y', 'ic7432_2Y02', [0, 0, 1, -1, 76.5, 111.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_2Y', 'ic7432_2Y03', [0, 0, 1, -1, 76.5, 125], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_2Y', 'ic7432_2Y04', [0, 0, 1, -1, 76.5, 138.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_2Y', 'ic7432_2Y05', [0, 0, 1, -1, 76.5, 152], 'red');


        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_GND', 'ic7432_GND02', [0, 0, 1, -1, 90, 111.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_GND', 'ic7432_GND03', [0, 0, 1, -1, 90, 125], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_GND', 'ic7432_GND04', [0, 0, 1, -1, 90, 138.5], 'red');
        ic7432.addEndPoint(4.5, 'ic7432', 'ic7432_GND', 'ic7432_GND05', [0, 0, 1, -1, 90, 152], 'red');
    }

    disabledButton4();
}

function inputs() {
    var x = document.getElementById("inputs");
    x.style.visibility = "visible";

    inputs4_but.disabled=true;
    inputs4_but.style.cursor="not-allowed";

    var inputs = new BoardController();
    inputs.setJsPlumbInstance(jsPlumb);
    inputs.setCircuitContainer('mid4');

    inputs.addEndPoint(4.5, 'inputs', 'input_A', 'input_A', [0, 0, 0, 0, 40, 90], 'red');
    inputs.addEndPoint(4.5, 'inputs', 'input_B', 'input_B', [0, 0, 0, 0, 108, 90], 'red');

    disabledButton4();
}


function disabledButton4()
{

  if(window.getComputedStyle(document.getElementById('board4')).visibility === "visible" && window.getComputedStyle(document.getElementById('led41')).visibility === "visible" && 
  window.getComputedStyle(document.getElementById('R41')).visibility === "visible" && window.getComputedStyle(document.getElementById('supply4')).visibility === "visible" && 
  window.getComputedStyle(document.getElementById('ic7432')).visibility === "visible" && (window.getComputedStyle(document.getElementById('input_a')).visibility === "visible" || window.getComputedStyle(document.getElementById('input_b')).visibility === "visible"))
  {
  check1_button.disabled=false;

  }
}

var con4;

function checkCircuit4() {
    con4 = false;
    var g = new Graph(21);

    console.log(groups.length)

    for (var i = 0; i < groups.length; i++) { //inserting groups vertexes
        g.addVertex(groups[i]);
    }

    for (key in connections) { // adding edges
        g.addEdge(connections[key].endpoints[0].getParameter('groupName'), connections[key].endpoints[1].getParameter('groupName'));
    }

    var edges= (g.numberofedges);
    console.log('edges:'+edges)
    if(edges == 0)
    {
        alert("No connections present.");   
        return;
    }
    if (
        g.isConnected("VCC", "ic7432_VCC") && g.isConnected("GND", "ic7432_GND") && g.isConnected("led41_C", "GND") &&


        (g.isConnected("ic7432_1A", "input_A") && g.isConnected("ic7432_1B", "input_B") && g.isConnected("ic7432_1Y", "R41_A") && g.isConnected("R41_B", "led41_A") ||
            g.isConnected("ic7432_1A", "input_B") && g.isConnected("ic7432_1B", "input_A") && g.isConnected("ic7432_1Y", "R41_A") && g.isConnected("R41_B", "led41_A") ||

            g.isConnected("ic7432_2A", "input_A") && g.isConnected("ic7432_2B", "input_B") && g.isConnected("ic7432_2Y", "R41_A") && g.isConnected("R41_B", "led41_A") ||
            g.isConnected("ic7432_2A", "input_B") && g.isConnected("ic7432_2B", "input_A") && g.isConnected("ic7432_2Y", "R41_A") && g.isConnected("R41_B", "led41_A") ||

            g.isConnected("ic7432_3A", "input_A") && g.isConnected("ic7432_3B", "input_B") && g.isConnected("ic7432_3Y", "R41_A") && g.isConnected("R41_B", "led41_A") ||
            g.isConnected("ic7432_3A", "input_B") && g.isConnected("ic7432_3B", "input_A") && g.isConnected("ic7432_3Y", "R41_A") && g.isConnected("R41_B", "led41_A") ||

            g.isConnected("ic7432_4A", "input_A") && g.isConnected("ic7432_4B", "input_B") && g.isConnected("ic7432_4Y", "R41_A") && g.isConnected("R41_B", "led41_A") ||
            g.isConnected("ic7432_4A", "input_B") && g.isConnected("ic7432_4B", "input_A") && g.isConnected("ic7432_4Y", "R41_A") && g.isConnected("R41_B", "led41_A") ||




            g.isConnected("ic7432_1A", "input_A") && g.isConnected("ic7432_1B", "input_B") && g.isConnected("ic7432_1Y", "R41_B") && g.isConnected("R41_A", "led41_A") ||
            g.isConnected("ic7432_1A", "input_B") && g.isConnected("ic7432_1B", "input_A") && g.isConnected("ic7432_1Y", "R41_B") && g.isConnected("R41_A", "led41_A") ||

            g.isConnected("ic7432_2A", "input_A") && g.isConnected("ic7432_2B", "input_B") && g.isConnected("ic7432_2Y", "R41_B") && g.isConnected("R41_A", "led41_A") ||
            g.isConnected("ic7432_2A", "input_B") && g.isConnected("ic7432_2B", "input_A") && g.isConnected("ic7432_2Y", "R41_B") && g.isConnected("R41_A", "led41_A") ||

            g.isConnected("ic7432_3A", "input_A") && g.isConnected("ic7432_3B", "input_B") && g.isConnected("ic7432_3Y", "R41_B") && g.isConnected("R41_A", "led41_A") ||
            g.isConnected("ic7432_3A", "input_B") && g.isConnected("ic7432_3B", "input_A") && g.isConnected("ic7432_3Y", "R41_B") && g.isConnected("R41_A", "led41_A") ||

            g.isConnected("ic7432_4A", "input_A") && g.isConnected("ic7432_4B", "input_B") && g.isConnected("ic7432_4Y", "R41_B") && g.isConnected("R41_A", "led41_A") ||
            g.isConnected("ic7432_4A", "input_B") && g.isConnected("ic7432_4B", "input_A") && g.isConnected("ic7432_4Y", "R41_B") && g.isConnected("R41_A", "led41_A")
        )
    ) {
        con4 = true;
        alert("Right Connections")

        showOutput();
        var a1 = document.getElementById("a1");
        var a2 = document.getElementById("a2");
        var a3 = document.getElementById("a3");
        var a4 = document.getElementById("a4");
        a1.style.display = "inline";
        a2.style.display = "inline";
        a3.style.display = "inline";
        a4.style.display = "inline";
        document.getElementById("tab_check").disabled = false;

    } else {
        alert("Wrong Connections")
    }
    console.log("executed")
}


function changeA() {
    var imagea = document.getElementById('input_a');
    if (imagea.src.match("images/switch_1.png")) {
        imagea.src = "images/switch_0.png";
    } else {
        imagea.src = "images/switch_1.png";
    }
    showOutput();
}

function changeB() {
    var imageb = document.getElementById('input_b');
    if (imageb.src.match("images/switch_1.png")) {
        imageb.src = "images/switch_0.png";
    } else {
        imageb.src = "images/switch_1.png";
    }
    showOutput();
}


function showOutput() {
    var switch1 = document.getElementById('input_a').src;
    var switch2 = document.getElementById('input_b').src;

    if (con4 == true) {

        if (switch1.match("images/switch_0.png") && switch2.match("images/switch_0.png")) {
            document.getElementById('led41').style.backgroundImage = "url('images/led0.png')";
        } else if (switch1.match("images/switch_0.png") && switch2.match("images/switch_1.png")) {
            document.getElementById('led41').style.backgroundImage = "url('images/led1.png')";
        } else if (switch1.match("images/switch_1.png") && switch2.match("images/switch_0.png")) {
            document.getElementById('led41').style.backgroundImage = "url('images/led1.png')";
        } else if (switch1.match("images/switch_1.png") && switch2.match("images/switch_1.png")) {
            document.getElementById('led41').style.backgroundImage = "url('images/led1.png')";
        }
    } else {
        return;
    }

}



const Second = document.getElementById('second4');
const Second_Data = document.getElementById('Second_Data4')
const btn_close = document.getElementById('close-btn5');;

Second.addEventListener('click', () => {
    Second_Data.classList.toggle('visible')
});

btn_close.addEventListener('click', () => {
    Second_Data.classList.remove('visible')
});




function a() {
    var a1 = document.getElementById("a1").value;
    var a2 = document.getElementById("a2").value;
    var a3 = document.getElementById("a3").value;
    var a4 = document.getElementById("a4").value;
    if (a1 == '') {
        alert("Fill the all Output");
    } else if (a2 == '') {
        alert("Fill the all Output");
    } else if (a3 == '') {
        alert("Fill the all Output");
    } else if (a4 == '') {
        alert("Fill the all Output");
    } else {
        if (a1 === '0') {
            if (a2 === '1') {
                if (a3 === '1') {
                    if (a4 === '1') {
                        alert("Correct output");
                        checked_1a = true;
                        //setTimeout(showModal, 2000)
                    } else {
                        alert("Incorrect output");
                        checked_1a = false;
                    }
                } else {
                    alert("Incorrect output");
                    checked_1a = false;
                }
            } else {
                alert("Incorrect output");
                checked_1a = false;
            }
        } else {
            alert("Incorrect output");
            checked_1a = false;
        }
    }

}

function resetTable() {
    document.getElementById("a1").value = "";
    document.getElementById("a2").value = "";
    document.getElementById("a3").value = "";
    document.getElementById("a4").value = "";
    document.getElementById("b1").value = "";
    document.getElementById("b2").value = "";
    document.getElementById("b3").value = "";
    document.getElementById("b4").value = "";
    checked_1a = false;
    checked_1b = false;
}