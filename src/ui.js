// ui.js
import katex from "katex";
import "katex/dist/katex.min.css";

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

  <input id="colourSelect${expressionCount}" class="colourSelect" type="color" name="head" value="${
    "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0")
  }" />
`;

  const lastChild = sidebar.lastElementChild;
  if (lastChild) {
    sidebar.insertBefore(div, lastChild);
  } else {
    sidebar.appendChild(div);
  }

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
}
