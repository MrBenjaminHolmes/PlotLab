import "./styles.css";
import { getOffset, newExpressionInput } from "./ui.js";
import { resizeCanvas, updateScale, setScale, getScale } from "./drawGraph.js";
import * as math from "mathjs";

// DOM references
const canvas = document.getElementById("GraphArea");
const ctx = canvas.getContext("2d");
const newExpressButton = document.getElementById("newExpressionButton");
const sidebar = document.getElementById("sidebar");
const mathScope = {};

// Optional: convert LaTeX to Math.js syntax
function convertLatexToMathjs(expr) {
  return expr
    .replace(/\\sqrt\{([^}]+)\}/g, "sqrt($1)")
    .replace(/\\le/g, "<=")
    .replace(/\\ge/g, ">=");
}

// Insert multiplication where omitted (e.g., "2x" → "2 * x", "ax" → "a * x")
function autoInsertMultiplication(expr) {
  return expr.replace(/([0-9a-zA-Z])([a-zA-Z])/g, "$1 * $2");
}

// Extract user input from the sidebar
function getAllExpressions() {
  const inputs = sidebar.querySelectorAll(
    ".expressionInput input[type='search']"
  );
  return Array.from(inputs)
    .map((input) => input.value.replace(/\\/g, "").trim())
    .filter((val) => val !== "");
}

// Main update function
export function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  resizeCanvas(canvas, ctx);

  const expressions = getAllExpressions();

  Object.keys(mathScope).forEach((key) => delete mathScope[key]);

  expressions.forEach((expr) => {
    const cleaned = autoInsertMultiplication(expr);
    if (/^[a-zA-Z_]\w*\s*=\s*[^=]+$/.test(cleaned)) {
      try {
        math.evaluate(cleaned, mathScope);
      } catch (e) {
        console.log(`Invalid assignment "${expr}": ${e.message}`);
      }
    }
  });

  // Second pass: plot expressions
  let i = 1;
  expressions.forEach((expr) => {
    const cleaned = autoInsertMultiplication(expr).replace(/^\s*y\s*=\s*/, "");
    if (!/^[a-zA-Z_]\w*\s*=\s*[^=]+$/.test(cleaned)) {
      evaluateExpression(cleaned, i);
      i++;
    }
  });
}

// Plot a single expression
function evaluateExpression(expr, i) {
  try {
    const scale = getScale();
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const { offsetX, offsetY } = getOffset();
    const centerX = width / 2 + offsetX;
    const centerY = height / 2 + offsetY;
    const colourSelects = document.querySelectorAll(".colourSelect");
    const colour = colourSelects[i - 1]?.value || "#000";
    const thicknessSelect = document.querySelectorAll(".thickness-slider");
    const thickness = thicknessSelect[i - 1]?.value || 1;

    ctx.beginPath();
    ctx.strokeStyle = colour;
    ctx.lineWidth = thickness;

    let first = true;

    for (let screenX = 0; screenX <= width; screenX += 1) {
      const x = (screenX - centerX) / (scale * 50);

      let y;
      try {
        y = math.evaluate(expr, { ...mathScope, x });
      } catch {
        first = true;
        continue;
      }

      if (!isFinite(y)) {
        first = true;
        continue;
      }

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
    console.log(`Invalid Expression: "${expr}" — ${err.message}`);
  }
}

// Event listeners
window.addEventListener("resize", () => {
  resizeCanvas(canvas, ctx);
  update();
});
window.addEventListener("load", () => resizeCanvas(canvas, ctx));

newExpressButton.addEventListener("click", () => {
  newExpressionInput(sidebar, update, getAllExpressions);
});

// Initial setup
newExpressionInput(sidebar, update, getAllExpressions);
