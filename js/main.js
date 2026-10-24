import { createInitialState, playTurn, rollDice, SCENARIOS, DEFAULT_SCENARIO_ID, getScenarioById, getJumps } from "./game.js";
import { renderScenarioSelector, renderBoard, renderGame, setDiceButtonEnabled } from "./ui.js";

let selectedScenarioId = DEFAULT_SCENARIO_ID;
let state = createInitialState(getScenarioById(selectedScenarioId));

function handleDiceClick() {
  const scenario = getScenarioById(selectedScenarioId);
  const jumps = getJumps(scenario);
  const roll = rollDice();
  try {
    state = playTurn(state, roll, jumps);
    renderGame(state, scenario);
  } catch (err) {
    console.error("Error en playTurn:", err);
  }
}

function handleRestartClick() {
  const scenario = getScenarioById(selectedScenarioId);
  state = createInitialState(scenario);
  renderGame(state, scenario);
}

function handleScenarioChange(newScenarioId) {
  selectedScenarioId = newScenarioId;
  const scenario = getScenarioById(selectedScenarioId);

  renderBoard(scenario);
  renderScenarioSelector(SCENARIOS, selectedScenarioId, handleScenarioChange);

  state = createInitialState(scenario);
  renderGame(state, scenario);
}

function init() {
  const initialScenario = getScenarioById(selectedScenarioId);

  renderScenarioSelector(SCENARIOS, selectedScenarioId, handleScenarioChange);
  renderBoard(initialScenario);
  renderGame(state, initialScenario);

  document.getElementById("dice-button").addEventListener("click", handleDiceClick);
  document.getElementById("restart-button").addEventListener("click", handleRestartClick);
}

document.addEventListener("DOMContentLoaded", init);