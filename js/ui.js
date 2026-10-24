import { BOARD_SIZE, BOARD_LAST_SQUARE, START_SQUARE, SNAKES, LADDERS, getSquareCoordinates } from "./game.js";

const boardEl = document.getElementById("board");
const diceButtonEl = document.getElementById("dice-button");
const diceValueEl = document.getElementById("dice-value");
const statusEl = document.getElementById("status");
const restartButtonEl = document.getElementById("restart-button");

/**
 * Renders the 10x10 board with zigzag numbering.
 * Called ONCE from init().
 */
export function renderBoard() {
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

    if (SNAKES[square]) {
      cell.classList.add("board__cell--snake");
      const label = document.createElement("span");
      label.className = "board__cell-label";
      label.textContent = `S→${SNAKES[square]}`;
      cell.appendChild(label);
    } else if (LADDERS[square]) {
      cell.classList.add("board__cell--ladder");
      const label = document.createElement("span");
      label.className = "board__cell-label";
      label.textContent = `E→${LADDERS[square]}`;
      cell.appendChild(label);
    }

    fragments.push(cell);
  }

  boardEl.append(...fragments);
}

/**
 * Renders player tokens on their squares.
 * @param {GameState} state
 */
export function renderTokens(state) {
  boardEl.querySelectorAll(".token").forEach((el) => el.remove());

  state.positions.forEach((pos, playerIndex) => {
    if (pos === START_SQUARE) return;

    const { row, col } = getSquareCoordinates(pos);
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
 * @param {number} [currentPlayer=0] - Current player index (0 or 1)
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
 */
export function renderGame(state) {
  renderTokens(state);
  renderStatus(state);
  renderDice(state.lastRoll, state.currentPlayer);
  setDiceButtonEnabled(state.winner === null);
}