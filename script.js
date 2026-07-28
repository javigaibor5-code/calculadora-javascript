// ---------------------------------------------
// Calculadora básica - Lógica principal
// Proyecto 1 de portafolio
// ---------------------------------------------

const display = document.getElementById('display');
const historyEl = document.getElementById('history');
const keys = document.querySelectorAll('.key');

let currentValue = '0';
let previousValue = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function updateHistory() {
  if (previousValue !== null && operator) {
    historyEl.textContent = `${previousValue} ${operatorSymbol(operator)}`;
  } else {
    historyEl.textContent = '';
  }
}

function operatorSymbol(op) {
  return { '+': '+', '-': '−', '*': '×', '/': '÷' }[op] || '';
}

function appendNumber(number) {
  if (shouldResetDisplay) {
    currentValue = '';
    shouldResetDisplay = false;
  }
  if (number === '.' && currentValue.includes('.')) return;
  if (currentValue === '0' && number !== '.') {
    currentValue = number;
  } else {
    currentValue += number;
  }
  updateDisplay();
}

function chooseOperator(nextOperator) {
  if (operator !== null && !shouldResetDisplay) {
    calculate();
  }
  previousValue = currentValue;
  operator = nextOperator;
  shouldResetDisplay = true;
  updateHistory();
}

function calculate() {
  if (operator === null || previousValue === null) return;

  const prev = parseFloat(previousValue);
  const curr = parseFloat(currentValue);
  let result;

  switch (operator) {
    case '+':
      result = prev + curr;
      break;
    case '-':
      result = prev - curr;
      break;
    case '*':
      result = prev * curr;
      break;
    case '/':
      result = curr === 0 ? 'Error' : prev / curr;
      break;
    default:
      return;
  }

  currentValue = result === 'Error' ? 'Error' : trimResult(result);
  operator = null;
  previousValue = null;
  shouldResetDisplay = true;
  updateHistory();
  updateDisplay();
}

function trimResult(number) {
  return parseFloat(number.toFixed(8)).toString();
}

function clearAll() {
  currentValue = '0';
  previousValue = null;
  operator = null;
  shouldResetDisplay = false;
  updateHistory();
  updateDisplay();
}

function deleteLast() {
  if (currentValue.length === 1) {
    currentValue = '0';
  } else {
    currentValue = currentValue.slice(0, -1);
  }
  updateDisplay();
}

function applyPercent() {
  currentValue = trimResult(parseFloat(currentValue) / 100);
  updateDisplay();
}

keys.forEach((key) => {
  key.addEventListener('click', () => {
    const { number, operator: op, action } = key.dataset;

    if (number !== undefined) {
      appendNumber(number);
    } else if (op !== undefined) {
      chooseOperator(op);
    } else if (action === 'equals') {
      calculate();
    } else if (action === 'clear') {
      clearAll();
    } else if (action === 'delete') {
      deleteLast();
    } else if (action === 'percent') {
      applyPercent();
    }
  });
});

// Soporte de teclado físico
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  if (e.key === '.') appendNumber('.');
  if (['+', '-', '*', '/'].includes(e.key)) chooseOperator(e.key);
  if (e.key === 'Enter' || e.key === '=') calculate();
  if (e.key === 'Backspace') deleteLast();
  if (e.key === 'Escape') clearAll();
});
