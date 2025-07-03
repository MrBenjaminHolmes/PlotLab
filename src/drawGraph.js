let scale = 1.0;
const BASE_MAJOR_SPACING = 50;
const BASE_MINOR_SPACING = 10;

export function setScale(newScale) {
  scale = newScale;
}

export function resizeCanvas(canvas, ctx) {
  const dpr = window.devicePixelRatio || 1;

  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  canvas.width = displayWidth * dpr;
  canvas.height = displayHeight * dpr;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);

  drawGrid(canvas, ctx);
  drawAxis(canvas, ctx);
}

function drawGrid(canvas, ctx) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const majorSpacing = BASE_MAJOR_SPACING * scale;
  const minorSpacing = BASE_MINOR_SPACING * scale;

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "#c0c0c0";
  ctx.lineWidth = 1;
  for (let x = width / 2; x <= width; x += majorSpacing)
    drawLine(ctx, x, 0, x, height);
  for (let x = width / 2; x >= 0; x -= majorSpacing)
    drawLine(ctx, x, 0, x, height);
  for (let y = height / 2; y <= height; y += majorSpacing)
    drawLine(ctx, 0, y, width, y);
  for (let y = height / 2; y >= 0; y -= majorSpacing)
    drawLine(ctx, 0, y, width, y);

  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 0.5;
  for (let x = width / 2; x <= width; x += minorSpacing)
    drawLine(ctx, x, 0, x, height);
  for (let x = width / 2; x >= 0; x -= minorSpacing)
    drawLine(ctx, x, 0, x, height);
  for (let y = height / 2; y <= height; y += minorSpacing)
    drawLine(ctx, 0, y, width, y);
  for (let y = height / 2; y >= 0; y -= minorSpacing)
    drawLine(ctx, 0, y, width, y);
}

function drawAxis(canvas, ctx) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  ctx.strokeStyle = "#a0a0a0";
  ctx.lineWidth = 1.5;
  drawLine(ctx, 0, height / 2, width, height / 2);
  drawLine(ctx, width / 2, 0, width / 2, height);
}

function drawLine(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function updateScale(newScale) {
  scale = newScale;
  setScale(scale);
}
