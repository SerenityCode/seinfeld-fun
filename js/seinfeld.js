function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const centre_x = $(window).width() / 2;
const centre_y = $(window).height() / 2;
const count = 30;
let scale = 140;
let colours = ["#00FF00", "#FFFF00", "#FF7F00", "#FF0000"]

let mouseX = centre_x;
let mouseY = centre_y;
let started = false;

function generate_img(){
    $("#content").empty();
    for(let i = count; i > 0; i--) {
        $("#content").append("<div id='container" + i + "'><img src='images/george.png' id='pic" + i + "' style='z-index: " + i + "'></div>")
    }
}

async function move_img(){
    let zoom_direction = false; // false for out, true for in
    let loop_count = 0;
    while(true) {
        if (started) {
            let width = $("#pic" + count).width();
            let height = $("#pic" + count).height();
            if (width === 0) {
                width = scale;
                height = scale;
            }
            let angle = Math.atan2(mouseY - centre_y, mouseX - centre_x);
            let top = mouseY - height / 2;
            let left = mouseX - width / 2;
            for (let i = count; i > 0; i--) {
                $("#pic" + i).css({
                    "position": "absolute",
                    "left": left,
                    "top": top,
                    "width": width,
                    "height": height
                });
                width += scale;
                height += scale;
                top -= scale / 2 + Math.sin(angle) * 30;
                left -= scale / 2 + Math.cos(angle) * 30;
                if (zoom_direction === false) {
                    scale += 1;
                } else {
                    scale -= 1;
                }
            }
        }
        await sleep(99);
        if(started) {
            loop_count += 1;
            if (loop_count % 10 === 0) {
                zoom_direction = !zoom_direction;
            }
        }
    }
}

$(document).ready(function() {
    $(document).mousemove(function(e) {
        mouseX = e.pageX;
        mouseY = e.pageY;
    }).mouseover();

    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
        let touch = e.touches[0];
        mouseX = touch.pageX;
        mouseY = touch.pageY;
    }, false);

    document.addEventListener('touchstart', function(e) {
        e.preventDefault();
    }, false);

    document.addEventListener('touchend', function(e) {
        e.preventDefault();
    }, false);

    document.addEventListener('touchcancel', function(e) {
        e.preventDefault();
    }, false);

    $(document).click(function(e) {
        if(started !== true) {
            let track = new Audio("audio/theme.mp3");
            track.loop = true;
            track.play();
            started = true;
            generate_img();
        }
    })
    move_img();
});