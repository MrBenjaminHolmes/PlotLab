// ui.js

export function newExpressionInput(sidebar, update, getAllExpressions) {
  const div = document.createElement("div");
  const expressionCount =
    sidebar.querySelectorAll(".expressionInput").length + 1;

  div.className = "expressionInput";
  div.innerHTML = `
    <div id="removeButton${expressionCount}" class="remove">x</div>
    <input type="search" name="expression${expressionCount}" />
    <input  id="colourSelect${expressionCount}" class="colourSelect" type="color" id="head" name="head" value="${
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
  const inputField = div.querySelector("input");
  inputField.addEventListener("input", () => {
    update();
  });
  const colourInput = div.querySelector("input[type='color']");
  colourInput.addEventListener("input", () => {
    update();
  });
}
