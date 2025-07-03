import "./styles.css";
import { resizeCanvas, setScale } from "./drawGraph.js";
import * as math from "mathjs";

const canvas = document.getElementById("GraphArea");
const ctx = canvas.getContext("2d");
const newExpress = document.querySelector("#newExpressionButton");
const sidebar = document.getElementById("sidebar");
const BASE_MAJOR_SPACING = 50;
const BASE_MINOR_SPACING = 10;
let scale = 1.0;

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  resizeCanvas(canvas, ctx);
  getAllExpressions().forEach((element) => {
    evaluateExpression(element);
  });
}

function evaluateExpression(expr) {
  try {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.beginPath();
    ctx.strokeStyle = "blue";

    let first = true;

    for (let screenX = 0; screenX <= width; screenX += 1) {
      // Convert screen X to math X
      const x = (screenX - centerX) / (scale * BASE_MAJOR_SPACING); // real x

      const y = math.evaluate(expr, { x });

      // Convert math Y to screen Y
      const screenY = centerY - y * scale * BASE_MAJOR_SPACING;

      if (first) {
        ctx.moveTo(screenX, screenY);
        first = false;
      } else {
        ctx.lineTo(screenX, screenY);
      }
    }

    ctx.stroke();
  } catch (e) {
    console.log("Invalid Expression: " + expr + e);
  }
}

function getAllExpressions() {
  const inputs = sidebar.querySelectorAll(".expressionInput input");
  const values = Array.from(inputs).map((input) => input.value.trim());
  return values.filter((val) => val !== "");
}

function newExpressionInput() {
  const div = document.createElement("div");
  const expressionCount =
    sidebar.querySelectorAll(".expressionInput").length + 1;

  div.className = "expressionInput";
  div.innerHTML = `
    <div id="removeButton${expressionCount}" class="remove">x</div>
    <input type="search" name="expression${expressionCount}" />
    <div id="colourSelect${expressionCount}" class="colourSelect"></div>
  `;

  const lastChild = sidebar.lastElementChild;

  if (lastChild) {
    sidebar.insertBefore(div, lastChild);
  }

  const removeButton = div.querySelector(".remove");
  removeButton.addEventListener("click", () => {
    div.remove();
  });

  div.firstElementChild.nextElementSibling.addEventListener(
    "input",
    (event) => {
      update();
      console.log(getAllExpressions());
    }
  );
}

function updateScale(newScale) {
  scale = newScale;
  setScale(scale);
}

newExpressionInput();

canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (event.deltaY < 0) updateScale(scale + 0.1);
  if (event.deltaY > 0) updateScale(Math.max(0.1, scale - 0.1));
  update();
});

canvas.addEventListener("auxclick", (event) => {
  if (event.button === 1) {
    updateScale(1.0);
    update();
  }
});

window.addEventListener("resize", () => resizeCanvas(canvas, ctx));
window.addEventListener("load", () => resizeCanvas(canvas, ctx));

newExpress.addEventListener("click", () => {
  newExpressionInput();
});

if (module.hot) {
  module.hot.accept();
}
