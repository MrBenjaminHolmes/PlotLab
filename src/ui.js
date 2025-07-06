// ui.js
import katex from "katex";
import "katex/dist/katex.min.css";
import { min } from "mathjs";
import { resizeCanvas, updateScale, setScale, getScale } from "./drawGraph.js";
import { update } from "./index.js";

const canvas = document.getElementById("GraphArea");
let offsetX = 0;
let offsetY = 0;
let scale = 1.0;

export function setOffset(x, y) {
  offsetX = x;
  offsetY = y;
}

export function getOffset() {
  return { offsetX, offsetY };
}

function renderMath(element, input) {
  katex.render(input, element, { throwOnError: false });
}
export function newExpressionInput(sidebar, update, getAllExpressions) {
  const div = document.createElement("div");
  const expressionCount =
    sidebar.querySelectorAll(".expressionInput").length + 1;

  div.className = "expressionInput";
  div.innerHTML = `
  <div id="removeButton${expressionCount}" class="remove">x</div>

  <div class="input-wrapper" >
    <input class="inputExpression" type="search" name="expression${expressionCount}"/>
    <div class="math-overlay"></div>
  </div>
  <input id="thicknessSlider${expressionCount}" type="range" min="1" max="4" value="2" class="thickness-slider" title="Line Thickness" />
  <input id="colourSelect${expressionCount}" class="colourSelect" type="color" name="head" value="${
    "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0")
  }" />
`;
  const newExpressionDiv = sidebar.querySelector("#newExpression");
  sidebar.insertBefore(div, newExpressionDiv);

  // Remove button
  const removeButton = div.querySelector(".remove");
  removeButton.addEventListener("click", () => {
    div.remove();
    update();
  });

  // Input listener
  const inputWrapper = div.querySelector(".input-wrapper");
  const inputField = inputWrapper.querySelector("input[type='search']");
  const mathOverlay = inputWrapper.querySelector(".math-overlay");

  inputField.addEventListener("input", () => {
    const latex = inputField.value.replace(/\^(\w+)/g, "^{$1}");
    renderMath(mathOverlay, latex);
    update();
  });
  const colourInput = div.querySelector("input[type='color']");
  colourInput.addEventListener("input", () => {
    update();
  });
  const sliderInput = div.querySelector("input[type='range']");
  sliderInput.addEventListener("input", () => {
    update();
  });
}
canvas.addEventListener("wheel", (event) => {
  event.preventDefault();

  const zoomFactor = 1.1;
  if (event.deltaY < 0) {
    scale *= zoomFactor;
  } else {
    scale /= zoomFactor;
  }

  // Clamp scale so it never goes too small or too large
  scale = Math.min(Math.max(scale, 0.01), 50);

  setScale(scale);
  updateScale(scale);
  update();
});

canvas.addEventListener("auxclick", (event) => {
  if (event.button === 1) {
    scale = 1.0;
    setOffset(0, 0);
    setScale(scale);
    updateScale(scale);
    update();
  }
});
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

canvas.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    // left mouse
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;

  const { offsetX, offsetY } = getOffset();
  setOffset(offsetX + dx, offsetY + dy);
  update();
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});
canvas.addEventListener("mouseleave", () => {
  isDragging = false;
});
