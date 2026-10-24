import { BOARD_SIZE, BOARD_LAST_SQUARE, START_SQUARE, getSquareCoordinates, SCENARIOS, getScenarioById, getJumps } from "./game.js";

const boardEl = document.getElementById("board");
const diceButtonEl = document.getElementById("dice-button");
const diceValueEl = document.getElementById("dice-value");
const statusEl = document.getElementById("status");
const restartButtonEl = document.getElementById("restart-button");
const scenarioSelectorEl = document.getElementById("scenario-selector");

const SVG_NS = "http://www.w3.org/2000/svg";
const VIEWBOX_SIZE = 1000;
const CELL_SIZE = VIEWBOX_SIZE / BOARD_SIZE;

/**
 * Returns the center coordinates of a square in viewBox space (0-1000).
 * @param {number} square - Square number (1-100)
 * @returns {{x: number, y: number}}
 */
function getSquareCenter(square) {
  const { row, col } = getSquareCoordinates(square);
  return {
    x: col * CELL_SIZE + CELL_SIZE / 2,
    y: row * CELL_SIZE + CELL_SIZE / 2
  };
}

/**
 * Draws a wavy snake path from source to destination.
 * @param {SVGSVGElement} svg - SVG element to append to
 * @param {number} fromSquare - Source square
 * @param {number} toSquare - Destination square
 */
function drawSnake(svg, fromSquare, toSquare) {
  const start = getSquareCenter(fromSquare);
  const end = getSquareCenter(toSquare);

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.hypot(dx, dy);

  const perpX = -dy / dist;
  const perpY = dx / dist;

  const waveAmplitude = Math.min(dist * 0.15, 60);
  const waves = 3;

  const path = document.createElementNS(SVG_NS, "path");
  path.className.baseVal = "board__svg-path board__svg-path--snake";

  let d = `M ${start.x} ${start.y} `;

  for (let i = 1; i <= waves; i++) {
    const t = i / (waves + 1);
    const ctrlX = start.x + dx * t + perpX * waveAmplitude * Math.sin(t * Math.PI * 2);
    const ctrlY = start.y + dy * t + perpY * waveAmplitude * Math.sin(t * Math.PI * 2);
    const nextT = (i + 1) / (waves + 1);
    const nextX = start.x + dx * nextT;
    const nextY = start.y + dy * nextT;
    d += `Q ${ctrlX} ${ctrlY} ${nextX} ${nextY} `;
  }

  d += `Q ${start.x + dx * 0.875 + perpX * waveAmplitude * 0.5} ${start.y + dy * 0.875 + perpY * waveAmplitude * 0.5} ${end.x} ${end.y}`;

  path.setAttribute("d", d);
  svg.appendChild(path);
}

/**
 * Draws a ladder (two rails with rungs) from source to destination.
 * @param {SVGSVGElement} svg - SVG element to append to
 * @param {number} fromSquare - Source square
 * @param {number} toSquare - Destination square
 */
function drawLadder(svg, fromSquare, toSquare) {
  const start = getSquareCenter(fromSquare);
  const end = getSquareCenter(toSquare);

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.hypot(dx, dy);

  const perpX = -dy / dist;
  const perpY = dx / dist;

  const railOffset = 12;

  const rail1StartX = start.x + perpX * railOffset;
  const rail1StartY = start.y + perpY * railOffset;
  const rail1EndX = end.x + perpX * railOffset;
  const rail1EndY = end.y + perpY * railOffset;

  const rail2StartX = start.x - perpX * railOffset;
  const rail2StartY = start.y - perpY * railOffset;
  const rail2EndX = end.x - perpX * railOffset;
  const rail2EndY = end.y - perpY * railOffset;

  const rail1 = document.createElementNS(SVG_NS, "line");
  rail1.className.baseVal = "board__svg-path board__svg-path--ladder";
  rail1.setAttribute("x1", rail1StartX);
  rail1.setAttribute("y1", rail1StartY);
  rail1.setAttribute("x2", rail1EndX);
  rail1.setAttribute("y2", rail1EndY);
  svg.appendChild(rail1);

  const rail2 = document.createElementNS(SVG_NS, "line");
  rail2.className.baseVal = "board__svg-path board__svg-path--ladder";
  rail2.setAttribute("x1", rail2StartX);
  rail2.setAttribute("y1", rail2StartY);
  rail2.setAttribute("x2", rail2EndX);
  rail2.setAttribute("y2", rail2EndY);
  svg.appendChild(rail2);

  const rungCount = Math.max(3, Math.floor(dist / 60));
  for (let i = 1; i <= rungCount; i++) {
    const t = i / (rungCount + 1);
    const rungStartX = start.x + dx * t - perpX * railOffset;
    const rungStartY = start.y + dy * t - perpY * railOffset;
    const rungEndX = start.x + dx * t + perpX * railOffset;
    const rungEndY = start.y + dy * t + perpY * railOffset;

    const rung = document.createElementNS(SVG_NS, "line");
    rung.className.baseVal = "board__svg-rung";
    rung.setAttribute("x1", rungStartX);
    rung.setAttribute("y1", rungStartY);
    rung.setAttribute("x2", rungEndX);
    rung.setAttribute("y2", rungEndY);
    svg.appendChild(rung);
  }
}

/**
 * Creates the SVG overlay for snakes and ladders.
 * @returns {SVGSVGElement}
 */
function createBoardSvg() {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.className.baseVal = "board__svg";
  svg.setAttribute("viewBox", `0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`);
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("pointer-events", "none");
  return svg;
}

/**
 * Renders the scenario selector (3 buttons).
 * @param {Object[]} scenarios - Array of { id, name }
 * @param {string} selectedId - Currently selected scenario id
 * @param {Function} onSelect - Callback(selectedId)
 * @returns {HTMLElement} Container element
 */
export function renderScenarioSelector(scenarios, selectedId, onSelect) {
  scenarioSelectorEl.innerHTML = "";

  const label = document.createElement("p");
  label.className = "scenario-selector__label";
  label.textContent = "Elige escenario:";
  scenarioSelectorEl.appendChild(label);

  const btnGroup = document.createElement("div");
  btnGroup.className = "scenario-selector__group";
  btnGroup.setAttribute("role", "radiogroup");
  btnGroup.setAttribute("aria-label", "Selección de escenario");

  scenarios.forEach((scenario) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = `scenario-btn-${scenario.id}`;
    btn.className = `scenario-selector__btn${scenario.id === selectedId ? " scenario-selector__btn--active" : ""}`;
    btn.dataset.scenarioId = scenario.id;
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", scenario.id === selectedId);
    btn.textContent = scenario.name;
    btn.addEventListener("click", () => onSelect(scenario.id));
    btnGroup.appendChild(btn);
  });

  scenarioSelectorEl.appendChild(btnGroup);
  return scenarioSelectorEl;
}

/**
 * Renders the 10x10 board with zigzag numbering for a scenario.
 * Replaces existing board content.
 * @param {Object} scenario - Scenario object { id, name, snakes, ladders }
 */
export function renderBoard(scenario) {
  boardEl.innerHTML = "";

  const jumps = getJumps(scenario);
  const fragments = [];

  for (let square = 1; square <= BOARD_LAST_SQUARE; square++) {
    const cell = document.createElement("div");
    cell.className = "board__cell board__cell-number";
    cell.dataset.square = square;

    const { row, col } = getSquareCoordinates(square);
    cell.dataset.row = row;
    cell.dataset.col = col;
    cell.style.gridRow = row + 1;
    cell.style.gridColumn = col + 1;

    if ((row + col) % 2 === 1) {
      cell.classList.add("board__cell--dark");
    }

    const numberSpan = document.createElement("span");
    numberSpan.className = "board__cell-number";
    numberSpan.textContent = square;
    cell.appendChild(numberSpan);

    if (scenario.snakes[square]) {
      cell.classList.add("board__cell--snake");
      const srLabel = document.createElement("span");
      srLabel.className = "visually-hidden";
      srLabel.textContent = `Serpiente: baja a casilla ${scenario.snakes[square]}`;
      cell.appendChild(srLabel);
    } else if (scenario.ladders[square]) {
      cell.classList.add("board__cell--ladder");
      const srLabel = document.createElement("span");
      srLabel.className = "visually-hidden";
      srLabel.textContent = `Escalera: sube a casilla ${scenario.ladders[square]}`;
      cell.appendChild(srLabel);
    }

    fragments.push(cell);
  }

  boardEl.append(...fragments);

  const svg = createBoardSvg();

  for (const [fromSquare, toSquare] of Object.entries(scenario.snakes)) {
    drawSnake(svg, Number(fromSquare), toSquare);
  }

  for (const [fromSquare, toSquare] of Object.entries(scenario.ladders)) {
    drawLadder(svg, Number(fromSquare), toSquare);
  }

  boardEl.appendChild(svg);
}

/**
 * Renders player tokens on their squares.
 * @param {GameState} state
 * @param {Object} scenario - Scenario object (for jumps lookup if needed)
 */
export function renderTokens(state, scenario) {
  boardEl.querySelectorAll(".token").forEach((el) => el.remove());

  state.positions.forEach((pos, playerIndex) => {
    if (pos === START_SQUARE) return;

    const cell = boardEl.querySelector(`.board__cell[data-square="${pos}"]`);
    if (!cell) return;

    const token = document.createElement("div");
    token.className = `token token--player${playerIndex + 1}`;
    token.dataset.player = playerIndex + 1;

    const existingTokens = cell.querySelectorAll(".token");
    if (existingTokens.length > 0) {
      token.classList.add("token--stacked");
      existingTokens.forEach((t) => t.classList.add("token--stacked"));
    }

    cell.appendChild(token);
  });
}

/**
 * Renders status message (turn, winner).
 * @param {GameState} state
 */
export function renderStatus(state) {
  if (state.winner !== null) {
    statusEl.textContent = `¡Jugador ${state.winner + 1} gana!`;
    statusEl.classList.add("game__status--winner");
  } else {
    statusEl.textContent = `Turno del Jugador ${state.currentPlayer + 1}`;
    statusEl.classList.remove("game__status--winner");
  }
}

/**
 * Shows dice value (no animation).
 * @param {number|null} roll
 * @param {number} [currentPlayer=0]
 */
export function renderDice(roll, currentPlayer = 0) {
  if (roll === null) {
    diceValueEl.textContent = "—";
    diceValueEl.dataset.player = "";
  } else {
    diceValueEl.textContent = roll;
    diceValueEl.dataset.player = currentPlayer + 1;
  }
}

/**
 * Enables/disables dice button.
 * @param {boolean} enabled
 */
export function setDiceButtonEnabled(enabled) {
  diceButtonEl.disabled = !enabled;
}

/**
 * Renders the complete game state to DOM (except board).
 * @param {GameState} state
 * @param {Object} scenario
 */
export function renderGame(state, scenario) {
  renderTokens(state, scenario);
  renderStatus(state);
  renderDice(state.lastRoll, state.currentPlayer);
  setDiceButtonEnabled(state.winner === null);
}