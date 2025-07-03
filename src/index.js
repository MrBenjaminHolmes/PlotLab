import "./styles.css";
import { resizeCanvas, setScale } from "./drawGraph.js";

const canvas = document.getElementById("GraphArea");
const ctx = canvas.getContext("2d");
const newExpress = document.querySelector("#newExpressionButton");
const sidebar = document.getElementById("sidebar");

let scale = 1.0;

function updateScale(newScale) {
  scale = newScale;
  setScale(scale);
}

canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  if (event.deltaY < 0) updateScale(scale + 0.1);
  if (event.deltaY > 0) updateScale(Math.max(0.1, scale - 0.1));
  resizeCanvas(canvas, ctx);
});

canvas.addEventListener("auxclick", (event) => {
  if (event.button === 1) {
    updateScale(1.0);
    resizeCanvas(canvas, ctx);
  }
});

window.addEventListener("resize", () => resizeCanvas(canvas, ctx));
window.addEventListener("load", () => resizeCanvas(canvas, ctx));

newExpress.addEventListener("click", () => {
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
});

if (module.hot) {
  module.hot.accept();
}
