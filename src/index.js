import "./styles.css";

const canvas = document.getElementById("GraphArea");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;

let scale = 1.0; // Change this to zoom in/out
const BASE_MAJOR_SPACING = 50;
const BASE_MINOR_SPACING = 10;
function drawGrid() {
  const majorSpacing = BASE_MAJOR_SPACING * scale;
  const minorSpacing = BASE_MINOR_SPACING * scale;
  ctx.clearRect(0, 0, width, height);
  //Major Lines
  ctx.strokeStyle = "#c0c0c0";
  ctx.lineWidth = 1;

  for (let x = width / 2; x <= width; x += majorSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let x = width / 2; x >= 0; x -= majorSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = height / 2; y <= width; y += majorSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let y = height / 2; y >= 0; y -= majorSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  //Minor Lines
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 0.5;

  for (let x = width / 2; x <= width; x += minorSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let x = width / 2; x >= 0; x -= minorSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = height / 2; y <= width; y += minorSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  for (let y = height / 2; y >= 0; y -= minorSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}
function drawAxis() {
  ctx.strokeStyle = "#a0a0a0";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();
}
drawGrid();
drawAxis();

canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (event.deltaY < 0) {
    scale += 0.1;
  }
  if (event.deltaY > 0) {
    scale = Math.max(0.1, scale - 0.1);
  }

  drawGrid();
  drawAxis();
});

canvas.addEventListener("auxclick", (event) => {
  if (event.button == 1) {
    scale = 1;
    drawGrid();
    drawAxis();
  }
});
