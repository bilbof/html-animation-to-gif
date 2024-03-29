// Functions
// ---------

function initCanvas() {
    var canvas = document.getElementById('bitmap');
    var context = canvas.getContext('2d', { willReadFrequently: true });
    context.willReadFrequently = true;
    context.fillStyle = 'rgb(255,255,255)';
    context.fillRect(0,0,canvas.width, canvas.height); //GIF can't do transparent so do white
    return [context, canvas];
}

// This is 
function initBitmap(frameRateSeconds) {
    var encoder = new GIFEncoder();
    encoder.setRepeat(0); //0  -> loop forever
                          //1+ -> loop n times then stop
    encoder.setFrameRate(frameRateSeconds); //go to next frame every n seconds
    encoder.start();
    return encoder
}

function drawFrame(context, encoder, frame, canvas) {
    context.fillStyle = 'rgb(255,255,255)';
    context.fillRect(0,0,canvas.width, canvas.height); // GIF can't do transparent so do white
    context.fillStyle = 'rgb(0,0,0)';
    context.font = '20px Arial';
    context.fillText('Frame: ' + frame, 10, 25);
    encoder.addFrame(context);
}

// Takes a PNG image and adds it as a frame to the gif
function drawImageFrame(context, encoder, canvas, dataUrl, callback) {
    // Add new image
    var image = new Image();
    image.src = dataUrl;
    image.onload = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0,0,canvas.width, canvas.height); // GIF can't do transparent so do white
        context.fillStyle = 'rgb(255,255,255)';
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        encoder.addFrame(context);
        callback();
    }
}

function finishGif(encoder) {
    encoder.finish();
    var binary_gif = encoder.stream().getData() //notice this is different from the as3gif package!
    var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
    return data_url;
}

function encode64(input) {
	var output = "", i = 0, l = input.length,
	key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", 
	chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	while (i < l) {
		chr1 = input.charCodeAt(i++);
		chr2 = input.charCodeAt(i++);
		chr3 = input.charCodeAt(i++);
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
		if (isNaN(chr2)) enc3 = enc4 = 64;
		else if (isNaN(chr3)) enc4 = 64;
		output = output + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
	}
	return output;
}

function htmlToPngFrame(node) {
    var scale = 4; // effective quality of image 
    return domtoimage.toPng(node, {
        height: node.offsetHeight * scale,
        width: node.offsetWidth * scale,
        style: {
          transform: "scale(" + scale + ")",
          transformOrigin: "top left",
          width: node.offsetWidth + "px",
          height: node.offsetHeight + "px",
        },
      })
      .catch(function (error) {
          console.error('oops, something went wrong!', error);
      }); 
}

function createImage(url) {
    var img = document.createElement('img');
    img.src = url;
    var el = document.getElementById('frameboy-1');
    el.appendChild(img);
}

// Procedure
// ---------

// file:///Users/William/dev/rate-highly/js-gif/index.html

var FRAME_RATE = 5;
var LEN_ANIMATION_SECS = 0.1;
var N_FRAMES = 40

console.log("Generating GIF with", N_FRAMES, "frames");
console.log("ETA: ", N_FRAMES / FRAME_RATE, "seconds");
var [context, canvas] = initCanvas();
var encoder = initBitmap(FRAME_RATE);

// This was an experiment for just drawing numbers, the gradient is slightly more interesting

// function drawNextFrame(context, encoder, canvas, i) {
//     if (i > 9) {
//         var data_url = finishGif(encoder);
//         createImage(data_url);
//         var loading = document.getElementById('loading');
//         loading.innerHTML = 'Done!';
//         return
//     }
//     node = document.getElementById(`frame-${i}`);
//     console.log("Drawing frame", i, node)
//     htmlToPngFrame(node)
//     .then(function (dataUrl) {
//         drawImageFrame(context, encoder, canvas, dataUrl, function() {
//             drawNextFrame(context, encoder, canvas, i + 1);
//         });
//     })
// }

// drawNextFrame(context, encoder, canvas, 0);

function drawGradient(context, encoder, canvas, i) {
    if (i >= N_FRAMES) {
        var data_url = finishGif(encoder);
        createImage(data_url);
        var loading = document.getElementById('loading');
        loading.innerHTML = 'Done!';
        return
    }
    node = document.getElementById(`gradient-frame`);
    htmlToPngFrame(node)
    .then(function (dataUrl) {
        drawImageFrame(context, encoder, canvas, dataUrl, function() {
            // setTimeout(function() {
                drawGradient(context, encoder, canvas, i + 1);
                console.log(`Drawing frame ${i} of ${N_FRAMES}, ETA: ${N_FRAMES - i} frames`)
            // }, 1000 / FRAME_RATE);
        });
    })
}

drawGradient(context, encoder, canvas, 0);