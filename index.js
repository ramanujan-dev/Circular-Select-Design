
let inner = [{ name: "Hello", link: [1, 2, 3, 4, 5] }, { name: "Hello", link: [5, 6, 28, 8, 9, 10,24] }, { name: "Hello", link: [11, 12, 13, 14, 15] }, { name: "Hello", link: [16, 17, 18, 19, 20] }, { name: "Hello", link: [19, 20, 21, 22, 23, 30] }, { name: "Hello", link: [24, 25, 26, 27, 29] }];
let outer = ["Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello", "Hello",];

let innerCircles = [];
let outerCircles = [];

let perAngleInner = 360 / inner.length;
let perAngleOuter = 360 / outer.length;

var ctx;
var centerX;
var centerY;

var canvasLeft;
var canvasTop;

let innerRadius = 90;
let outerRadius = 200;
let outerOffset = 25;

let innerDamping = 33;
let outerDamping = 100 - 15;

let activeNode = null;

let colors = {
    white: '#ffffff',
    blue: '#5a7cd0',

    canvas: '#000000',
    innerCircle:'#3d3737',

    node: '#262626',
    nodeActive: '#ffffff',
    arc: '#808080',
    arcActive: '#ffffff'
}



const drawCircle = (Xpos, Ypos, radius, strokeColor, fillColor, lineWidth = 2, fill = true) => {
    const circle = new Path2D();
    circle.arc(Xpos, Ypos, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke(circle);
    if (fill) {
        ctx.fillStyle = fillColor;
        ctx.fill(circle);
    }
    return circle;
}


const canvasClick = (e) => {

    innerCircles.forEach((value, index) => {
        if (ctx.isPointInPath(value, e.clientX - canvasLeft, e.clientY - canvasTop)) {
            if (activeNode != null) {
                let node = inner[activeNode];
                let angleInner = perAngleInner * activeNode;
                let xI = Math.cos(angleInner * Math.PI / 180) * innerRadius + centerX;
                let yI = Math.sin(angleInner * Math.PI / 180) * innerRadius + centerY;
                drawLinkSet(node.link, angleInner, xI, yI, colors.arc);
                drawInnerCircle(node, activeNode, colors.node,false);
                node.link.forEach((value,index)=>{
                    drawOuterCircle(outer[value],value,colors.node,false);
                })

            }
            let node = inner[index];

            activeNode = index;
            let angleInner = perAngleInner * index;
            let xI = Math.cos(angleInner * Math.PI / 180) * innerRadius + centerX;
            let yI = Math.sin(angleInner * Math.PI / 180) * innerRadius + centerY;
            console.log(index);
            drawLinkSet(node.link, angleInner, xI, yI, colors.white);
            drawInnerCircle(node, activeNode, colors.nodeActive,false);
            node.link.forEach((value,index)=>{
                drawOuterCircle(outer[value],value,colors.nodeActive,false);
            })
            drawCircle(centerX, centerX, 70, colors.innerCircle, colors.innerCircle);

        }
    })

}

const drawInnerCircle = (value, index, color,renderText=true) => {
    let angle = index * perAngleInner;
    let x = Math.sin(angle * Math.PI / 180) * innerRadius;
    let y = Math.cos(angle * Math.PI / 180) * innerRadius;


    let circle = drawCircle(centerX + y, centerY + x, 12, colors.white, color, lineWidth = 2)



    ctx.font = "12px Arial";
    ctx.fillStyle = "white";

    if(renderText){
    innerCircles.push(circle);

    ctx.save();
    if (y + centerX < centerX) {
        ctx.textAlign = "end";
        y -= 25;
    }
    else {
        y += 25;
    }
    ctx.translate(centerX + y, centerY + x + 13 / 2);
    ctx.fillText(value.name + " " + index, 0, 0);

    ctx.restore();
}
}


const drawInner = () => {
    inner.map((value, index) => {
        drawInnerCircle(value, index, colors.node);
    })
}

const drawOuterCircle = (value, index, color,renderText=true) => {
    let angle = index * perAngleOuter - outerOffset;
    let x = Math.sin(angle * Math.PI / 180) * outerRadius;
    let y = Math.cos(angle * Math.PI / 180) * outerRadius;


    drawCircle(centerX + y, centerY + x, 13, colors.white, color, lineWidth = 2)


    let xT = Math.sin(angle * Math.PI / 180) * (outerRadius + 30);
    let yT = Math.cos(angle * Math.PI / 180) * (outerRadius + 30);

    ctx.font = "10px Arial";
    ctx.fillStyle = "white";

    if(renderText){
    ctx.save();
    ctx.translate(centerX + yT, centerY + xT);
    if (yT + centerX < centerX) {
        ctx.textAlign = "end";
        ctx.scale(-1, -1)
    }
    ctx.rotate(angle * Math.PI / 180);
    ctx.fillText(value + " " + index, 0, 0);

    ctx.restore();
}
}

const drawOuter = () => {
    outer.map((value, index) => {

        drawOuterCircle(value, index, colors.node);


    })
}

const drawBezier = (start, cp1, cp2, end, color, lineWidth) => {
    ctx.beginPath();
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth;
    ctx.moveTo(start.x, start.y);

    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.stroke();
}

const drawLinkSet = (outerList, angleInner, xI, yI, color) => {
    outerList.forEach((val) => {

        let innerDampRadius = innerRadius + (outerRadius - innerRadius) * 33 / 100;
        let outerDampRadius = innerRadius + (outerRadius - innerRadius) * 33 / 100;

        let angleOuter = perAngleOuter * val - outerOffset;
        let xO = Math.cos(angleOuter * Math.PI / 180) * outerRadius + centerX;
        let yO = Math.sin(angleOuter * Math.PI / 180) * outerRadius + centerY;

        let start = { x: xI, y: yI };
        let end = { x: xO, y: yO };

        let diffAngle = angleOuter - angleInner;
        if (diffAngle > 180) {
            innerDampRadius = innerRadius - (outerRadius - innerRadius) * 33 / 100;

            diffAngle = (180 - diffAngle);
        }

        let innerDampAngle = angleInner + (diffAngle) * innerDamping / 100;
        let xDI = Math.cos(innerDampAngle * Math.PI / 180) * innerDampRadius + centerX
        let yDI = Math.sin(innerDampAngle * Math.PI / 180) * innerDampRadius + centerY;

        let outerDampAngle = angleInner + (diffAngle) * outerDamping / 100;
        let xDO = Math.cos(outerDampAngle * Math.PI / 180) * outerDampRadius + centerX
        let yDO = Math.sin(outerDampAngle * Math.PI / 180) * outerDampRadius + centerY;


        let cp1 = { x: xDI, y: yDI };
        let cp2 = { x: xDO, y: yDO };


        drawBezier(start, cp1, cp2, end, colors.canvas, 1);
        drawBezier(start, cp1, cp2, end, color, 0.5);

    })
}

const drawLines = () => {


    inner.forEach((value, index) => {
        let angleInner = perAngleInner * index;
        let xI = Math.cos(angleInner * Math.PI / 180) * innerRadius + centerX;
        let yI = Math.sin(angleInner * Math.PI / 180) * innerRadius + centerY;

        drawLinkSet(value.link, angleInner, xI, yI, colors.arc);


    })


}

$(document).ready(() => {
    var c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    let size = Math.min(window.innerHeight,window.innerWidth);
    c.width = size * 0.9;
    c.height = size * 0.9;
    c.onclick = canvasClick;


    centerX = c.getBoundingClientRect().width / 2;
    centerY = c.getBoundingClientRect().height / 2;
    canvasLeft = c.getBoundingClientRect().left;
    canvasTop = c.getBoundingClientRect().top;


    drawCircle(centerX, centerX, 70, colors.innerCircle, colors.innerCircle);

    drawLines();

    drawCircle(centerX, centerX, innerRadius, colors.blue, NaN, lineWidth = 1, fill = false);
    drawInner();

    drawCircle(centerX, centerX, outerRadius, colors.white, NaN, lineWidth = 1, fill = false);
    drawOuter();


})
