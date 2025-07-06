import { getOffset } from "./ui.js";

let scale = 1.0;
const BASE_MAJOR_SPACING = 50;
const BASE_MINOR_SPACING = 10;

export function setScale(newScale) {
  scale = newScale;
}

export function getScale() {
  return scale;
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
  drawLabels(canvas, ctx);
}

function drawGrid(canvas, ctx) {
  const { offsetX, offsetY } = getOffset();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const centerX = width / 2 + offsetX;
  const centerY = height / 2 + offsetY;

  const majorSpacing = BASE_MAJOR_SPACING * scale;
  const minorSpacing = BASE_MINOR_SPACING * scale;

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "#c0c0c0";
  ctx.lineWidth = 1;
  for (let x = centerX; x <= width; x += majorSpacing)
    drawLine(ctx, x, 0, x, height);
  for (let x = centerX; x >= 0; x -= majorSpacing)
    drawLine(ctx, x, 0, x, height);
  for (let y = centerY; y <= height; y += majorSpacing)
    drawLine(ctx, 0, y, width, y);
  for (let y = centerY; y >= 0; y -= majorSpacing)
    drawLine(ctx, 0, y, width, y);

  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 0.5;
  for (let x = centerX; x <= width; x += minorSpacing)
    drawLine(ctx, x, 0, x, height);
  for (let x = centerX; x >= 0; x -= minorSpacing)
    drawLine(ctx, x, 0, x, height);
  for (let y = centerY; y <= height; y += minorSpacing)
    drawLine(ctx, 0, y, width, y);
  for (let y = centerY; y >= 0; y -= minorSpacing)
    drawLine(ctx, 0, y, width, y);
}

function drawAxis(canvas, ctx) {
  const { offsetX, offsetY } = getOffset();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const centerX = width / 2 + offsetX;
  const centerY = height / 2 + offsetY;

  ctx.strokeStyle = "#a0a0a0";
  ctx.lineWidth = 1.5;
  drawLine(ctx, 0, centerY, width, centerY);
  drawLine(ctx, centerX, 0, centerX, height);
}

function drawLabels(canvas, ctx) {
  const { offsetX, offsetY } = getOffset();
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const centerX = width / 2 + offsetX;
  const centerY = height / 2 + offsetY;
  const majorSpacing = BASE_MAJOR_SPACING * scale;

  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const minSpacingForLabels = 40; // Minimum px between labels
  const labelStep = Math.ceil(minSpacingForLabels / majorSpacing);

  // X-axis Labels
  for (let x = centerX, i = 0; x <= width; x += majorSpacing, i++) {
    if (i !== 0 && i % labelStep === 0) {
      ctx.fillText(`${i}`, x, centerY + 4);
    }
  }
  for (let x = centerX - majorSpacing, i = -1; x >= 0; x -= majorSpacing, i--) {
    if (i !== 0 && i % labelStep === 0) {
      ctx.fillText(`${i}`, x, centerY + 4);
    }
  }
  //Y axis Labels
  for (let y = centerY, i = 0; y <= height; y += majorSpacing, i--) {
    if (i !== 0 && i % labelStep === 0) {
      ctx.fillText(`${i}`, centerX - 8, y);
    }
  }
  for (let y = centerY - majorSpacing, i = 1; y >= 0; y -= majorSpacing, i++) {
    if (i !== 0 && i % labelStep === 0) {
      ctx.fillText(`${i}`, centerX - 8, y);
    }
  }
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
