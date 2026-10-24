import { createInitialState, playTurn, rollDice } from "./game.js";
import { renderBoard, renderGame, setDiceButtonEnabled } from "./ui.js";

let state = createInitialState();

function handleDiceClick() {
  const roll = rollDice();
  try {
    state = playTurn(state, roll);
    renderGame(state);
  } catch (err) {
    console.error("Error en playTurn:", err);
  }
}

function handleRestartClick() {
  state = createInitialState();
  renderGame(state);
}

function init() {
  renderBoard();
  renderGame(state);

  document.getElementById("dice-button").addEventListener("click", handleDiceClick);
  document.getElementById("restart-button").addEventListener("click", handleRestartClick);
}

document.addEventListener("DOMContentLoaded", init);