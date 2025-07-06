// index.js
import "./styles.css";
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
    ctx.beginPath();
    ctx.strokeStyle = colour;
    ctx.lineWidth = thickness;
    let first = true;
    for (let screenX = 0; screenX <= width; screenX += 1) {
      const x = (screenX - centerX) / (scale * 50);
      const y = math.evaluate(expr, { x });
      const screenY = centerY - y * scale * 50;

      if (first) {
        ctx.moveTo(screenX, screenY);
        first = false;
      } else {
        ctx.lineTo(screenX, screenY);
      }
    }
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
