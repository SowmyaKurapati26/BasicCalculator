const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

let currentInput = "";
let resetNext = false;

function formatResult(result) {
  if (isNaN(result) || !isFinite(result)) {
    return "Error";
  }
  // Limit long decimals
  if (result.toString().includes(".")) {
    return parseFloat(result).toFixed(4).replace(/\.?0+$/, "");
  }
  // Limit very long integers
  if (result.toString().length > 10) {
    return result.toExponential(4);
  }
  return result.toString();
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const value = btn.textContent;

    if (btn.classList.contains("clear")) {
      currentInput = "";
      display.textContent = "0";
      resetNext = false;
    } 
    else if (btn.classList.contains("equal")) {
      if (!currentInput) return;

      try {
        let expression = currentInput
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/−/g, "-");

        // Prevent ending with operator
        if (/[+\-*/.]$/.test(expression)) {
          display.textContent = "Error";
          currentInput = "";
          return;
        }

        let result = eval(expression);

        display.textContent = formatResult(result);
        currentInput = display.textContent;
        resetNext = true;
      } catch {
        display.textContent = "Error";
        currentInput = "";
      }
    } 
    else {
      if (resetNext && !btn.classList.contains("operator")) {
        currentInput = "";
        resetNext = false;
      }

      // Prevent multiple operators in a row
      if (
        btn.classList.contains("operator") &&
        /[+\-×÷]$/.test(currentInput)
      ) {
        return;
      }

      // Prevent multiple decimals in the same number
      if (value === ".") {
        let parts = currentInput.split(/[-+×÷]/);
        if (parts[parts.length - 1].includes(".")) return;
      }

      currentInput += value;
      display.textContent = currentInput;
    }
  });
});
