// index.js
import "./styles.css";
import { isoContours } from "marchingsquares";
import { getOffset, newExpressionInput } from "./ui.js";
import { resizeCanvas, updateScale, setScale, getScale } from "./drawGraph.js";
import * as math from "mathjs";

// DOM references
const canvas = document.getElementById("GraphArea");
const ctx = canvas.getContext("2d");
const newExpressButton = document.getElementById("newExpressionButton");
const sidebar = document.getElementById("sidebar");

function convertLatexToMathjs(expr) {
  return expr
    .replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)")
    .replace(/\\le/g, "<=")
    .replace(/\\ge/g, ">=");
}

export function update() {
  let i = 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  resizeCanvas(canvas, ctx);
  getAllExpressions().forEach((expr) => {
    evaluateExpression(expr, i);
    i++;
  });
}

// Extract expressions
function getAllExpressions() {
  const inputs = sidebar.querySelectorAll(
    ".expressionInput input[type='search']"
  );
  return Array.from(inputs)
    .map((input) => input.value.replace(/\\/g, "").trim())
    .filter((val) => val !== "");
}

// Plot expression
function evaluateExpression(expr, i) {
  try {
    const scale = getScale();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const { offsetX, offsetY } = getOffset();
    const centerX = width / 2 + offsetX;
    const centerY = height / 2 + offsetY;

    const colourSelects = document.querySelectorAll(".colourSelect");
    const colour = colourSelects[i - 1].value;
    const thicknessSelect = document.querySelectorAll(".thickness-slider");
    const thickness = thicknessSelect[i - 1].value;

    ctx.strokeStyle = colour;
    ctx.lineWidth = thickness;

    const parts = expr.split("=");
    if (parts.length !== 2) return;

    const left = parts[0].trim();
    const right = parts[1].trim();
    const equation = `${left} - (${right})`;
    const compiled = math.compile(equation);

    const zoom = scale * 50;
    const resolution = 4;
    const gridWidth = Math.floor(width / resolution);
    const gridHeight = Math.floor(height / resolution);

    const data = [];
    for (let j = 0; j < gridHeight; j++) {
      const row = [];
      for (let i = 0; i < gridWidth; i++) {
        const x = ((i / (gridWidth - 1)) * width - centerX) / zoom;
        const y = (centerY - (j / (gridHeight - 1)) * height) / zoom;

        const val = compiled.evaluate({ x, y });
        row.push(val);
      }
      data.push(row);
    }

    const contours = isoContours(data, 0);

    // Draw contours
    ctx.beginPath();
    contours.forEach((contour) => {
      contour.forEach(([gx, gy], index) => {
        const px = (gx / (gridWidth - 1)) * width;
        const py = (gy / (gridHeight - 1)) * height;
        if (index === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      });
    });
    ctx.stroke();
  } catch (err) {
    console.log(`Invalid Expression: "${expr}" — ${err}`);
  }
}
// Event listeners
window.addEventListener("resize", () => resizeCanvas(canvas, ctx));
window.addEventListener("load", () => resizeCanvas(canvas, ctx));

newExpressButton.addEventListener("click", () => {
  newExpressionInput(sidebar, update, getAllExpressions);
});

// Initial setup
newExpressionInput(sidebar, update, getAllExpressions);

addEventListener("resize", (event) => {
  update();
});
