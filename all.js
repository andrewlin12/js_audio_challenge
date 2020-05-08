
var printBuffer = '';
window.print = (s) => {
  printBuffer += s.toString().replace(/\,/g, ', ') + '\n';
}

var drawDebug;
function drawOnCanvas(arr) {
  const ctx = this;

  let w = ctx.canvas.clientWidth;
  let h = ctx.canvas.clientHeight;
  let inc = w / arr.length;
  ctx.beginPath();
  ctx.strokeStyle = '#444444';
  ctx.lineWidth = 3;
  const translated = arr.map(y => h / 2 - y);
  ctx.moveTo(0, translated[0]);
  translated.forEach((y, i) => {
    ctx.lineTo(inc * i, y);
  });
  ctx.stroke();

  if (drawDebug) {
    window.print('Drew ' + arr.length + ' points: ' + arr);
  }
};

function play(arr) {
  var context = new AudioContext();
  var buf = new Float32Array(44100);
  var index = 0;
  while (index < buf.length) {
    buf[index] = arr[index % arr.length] / 300;
    index++;
  }

  var audioBuffer = context.createBuffer(1, buf.length, context.sampleRate);
  audioBuffer.copyToChannel(buf, 0);

  var source = context.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(context.destination);
  source.start(0);
};

window.runCode = (id) => {
  printBuffer = '';
  try {
    eval(document.getElementById('code' + id).value);
  } catch (err) {
    printBuffer = err.stack.toString();
  }

  document.getElementById('output' + id).innerHTML = printBuffer;
};

window.drawCode = (id) => {
  drawDebug = true;
  printBuffer = '';
  const canvas = document.getElementById('canvas' + id);
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  try {
    ctx.fillStyle = '#eeeeee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const draw = drawOnCanvas.bind(ctx);
    eval(document.getElementById('code' + id).value);
  } catch (err) {
    printBuffer = err.stack.toString();
  }

  if (printBuffer) {
    document.getElementById('output' + id).innerHTML = printBuffer;
  }
}

window.playCode = (id) => {
  drawDebug = false;
  printBuffer = '';
  const canvas = document.getElementById('canvas' + id);
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  try {
    ctx.fillStyle = '#eeeeee';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const draw = drawOnCanvas.bind(ctx);
    eval(document.getElementById('code' + id).value);
  } catch (err) {
    printBuffer = err.stack.toString();
  }

  if (printBuffer) {
    document.getElementById('output' + id).innerHTML = printBuffer;
  }
}