let staticCanvas = document.getElementById('static-canvas'),
  fg1 = document.getElementById('foreground1'),
  fg2 = document.getElementById('foreground2'),
  fg3 = document.getElementById('foreground3'),
  fg4 = document.getElementById('foreground4');

let ctx_static = staticCanvas.getContext('2d'),
  ctx_fg1 = fg1.getContext('2d'),
  ctx_fg2 = fg2.getContext('2d'),
  ctx_fg3 = fg3.getContext('2d'),
  ctx_fg4 = fg4.getContext('2d');

let cSet = [
  staticCanvas,
  fg1,
  fg2,
  fg3,
  fg4
];

let ctxSet = [
  ctx_static,
  ctx_fg1,
  ctx_fg2,
  ctx_fg3,
  ctx_fg4
];

window.addEventListener('load', function () {
  init();
})

window.addEventListener('resize', function () {
  init();
})

colors = {
  sky: '#010001',
  moon: '#fef9bc',
  clouds1: '#6897d5',
  clouds2: '#5074a3',
  clouds3: '#364d6d',
  clouds4: '#1b2637',
};

function init() {
  /* initialize the static (background) canvas */
  sizeCanvas(staticCanvas, window.innerWidth, window.innerHeight);

  for (var i = 1; i < cSet.length; i++) {
    cSet[i].width = window.innerWidth * 2;
    cSet[i].height = window.innerHeight;
  }

  renderScene();
}

function sizeCanvas(c, x, y) {
  c.width = x;
  c.height = y;
}

function renderScene() {
  /* render sky */
  ctx_static.fillStyle = colors.sky;
  ctx_static.fillRect(0, 0, innerWidth, innerHeight);

  /* render point stars */
  for (var i = 0; i < 24; i++) {
    let x = Math.round(Math.random() * innerWidth);
    let y = Math.round(Math.random() * innerHeight * 0.4);
    let d = distToPoint(x, y, staticCanvas.width * 0.65, staticCanvas.height * 0.15);
    let col = d < 150 ? 96 : Math.random() < 0.1 ? 100 : 255;
    ctx_static.fillStyle = 'rgb(' + col + ',' + col + ',' + col + ')';
    ctx_static.fillRect(x, y, 1, 1);
  }

  /* render bright stars */
  let s1x = Math.round(staticCanvas.width * 0.4) - 0.5;
  let s1y = Math.round(staticCanvas.height * 0.1) - 0.5;
  let s1Grad = ctx_static.createRadialGradient(s1x, s1y, 0, s1x, s1y, 8);
  s1Grad.addColorStop(0, 'rgba(255,255,255,1)');
  s1Grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx_static.strokeStyle = s1Grad;
  ctx_static.beginPath();
  ctx_static.moveTo(s1x - 4, s1y);
  ctx_static.lineTo(s1x + 4, s1y);
  ctx_static.stroke();
  ctx_static.beginPath();
  ctx_static.moveTo(s1x, s1y - 4);
  ctx_static.lineTo(s1x, s1y + 4);
  ctx_static.stroke();

  let s2x = Math.round(staticCanvas.width * 0.9) - 0.5;
  let s2y = Math.round(staticCanvas.height * 0.16) - 0.5;
  let s2Grad = ctx_static.createRadialGradient(s2x, s2y, 0, s2x, s2y, 8);
  s2Grad.addColorStop(0, 'rgba(255,255,255,1)');
  s2Grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx_static.strokeStyle = s2Grad;
  ctx_static.beginPath();
  ctx_static.moveTo(s2x - 4, s2y);
  ctx_static.lineTo(s2x + 4, s2y);
  ctx_static.stroke();
  ctx_static.beginPath();
  ctx_static.moveTo(s2x, s2y - 4);
  ctx_static.lineTo(s2x, s2y + 4);
  ctx_static.stroke();

  /* render moon */
  ctx_static.fillStyle = colors.moon;
  ctx_static.beginPath();
  ctx_static.arc(staticCanvas.width * 0.65, staticCanvas.height * 0.15, 30, 0, Math.PI * 2);
  ctx_static.fill();

  /* render clouds */
  renderCloudSet(innerHeight * 0.5, ctx_fg4, colors.clouds4, 10, 20, 100);
  renderCloudSet(innerHeight * 0.65, ctx_fg3, colors.clouds3, 10, 20, 100);
  renderCloudSet(innerHeight * 0.8, ctx_fg2, colors.clouds2, 10, 20, 100);
  renderCloudSet(innerHeight * 0.95, ctx_fg1, colors.clouds1, 10, 20, 100);
}

function distToPoint(x1, y1, x2, y2) {
  let a = (x2 - x1) * (x2 - x1);
  let b = (y2 - y1) * (y2 - y1);
  return Math.sqrt(a + b);
}

function renderCloudSet(cloudSurface, ctx, color, minM, maxM, yVariance) {
  ctx.fillStyle = colors;
  ctx.fillRect(0, cloudSurface, innerWidth, innerHeight - cloudSurface);

  let mX = 0;
  let mY = cloudSurface - Math.round(Math.random() * yVariance);
  let currentM = Math.round(Math.random() * maxM) + minM;
  while (mX < innerWidth) {
    createM(ctx, color, mX, mY, currentM, cloudSurface);
    //mY = cloudSurface - Math.round(Math.random() * yVariance);
    if (mY + currentM > cloudSurface) {
      mY -= currentM;
    } else if (mY - currentM < cloudSurface - yVariance) {
      mY += currentM;
    } else {
      mY = Math.random() < 0.5 ? mY - currentM : mY + currentM;
    }
    currentM = Math.round(Math.random() * maxM) + minM;
    mX += currentM * 0.6;
  }
}

function createM(ctx, color, x, y, r, cloudSurface) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x + innerWidth, y, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillRect(x - r, y, r * 2, window.innerHeight);
  ctx.fillRect((x + innerWidth) - r, y, r * 2, window.innerHeight);
}

/*
function animate() {
  window.requestAnimationFrame(animate);
}
*/
