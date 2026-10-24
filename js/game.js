export const BOARD_SIZE = 10;
export const BOARD_LAST_SQUARE = BOARD_SIZE * BOARD_SIZE;
export const START_SQUARE = 0;
export const DICE_SIDES = 6;
export const PLAYER_COUNT = 2;

export const SCENARIOS = [
  {
    id: "classic",
    name: "Clásico",
    snakes: {
      16: 6,   47: 26,  49: 11,  56: 53,  62: 19,
      64: 60,  87: 24,  93: 73,  95: 75,  98: 78
    },
    ladders: {
      1: 38,   4: 14,   9: 31,   21: 42,  28: 84,
      36: 44,  51: 67,  71: 91,  80: 100
    }
  },
  {
    id: "jungle",
    name: "Selva",
    snakes: {
      17: 7,   32: 10,  48: 26,  50: 11,  54: 34,
      57: 53,  63: 19,  65: 60,  76: 58,  88: 24,
      92: 70,  94: 73,  96: 75,  99: 78
    },
    ladders: {
      2: 14,   10: 31,  22: 42,  37: 44,
      52: 67,  72: 91,  81: 100
    }
  },
  {
    id: "ladders",
    name: "Escaleras",
    snakes: {
      17: 7,   48: 26,  50: 11,  57: 53,
      63: 19,  65: 61,  88: 24
    },
    ladders: {
      2: 14,   3: 31,   5: 25,   10: 42,  15: 35,
      22: 44,  27: 55,  37: 67,  40: 60,
      52: 72,  68: 88,  73: 91,  79: 95,  81: 100
    }
  }
];

export const DEFAULT_SCENARIO_ID = "classic";

/**
 * Returns scenario by id.
 * @param {string} id
 * @returns {Object}
 */
export function getScenarioById(id) {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}

/**
 * Combines snakes and ladders into a single jumps object.
 * @param {Object} scenario
 * @returns {Object}
 */
export function getJumps(scenario) {
  return { ...scenario.snakes, ...scenario.ladders };
}

/**
 * @typedef {Object} GameState
 * @property {number[]} positions - Posiciones [player1, player2], 0-100 (0 = fuera)
 * @property {number} currentPlayer - Índice 0 o 1
 * @property {number|null} lastRoll - Último valor del dado (1-6) o null
 * @property {number|null} winner - Índice del ganador (0/1) o null
 * @property {string} scenarioId - ID del escenario activo
 */

/**
 * Creates the initial game state for a scenario.
 * @param {Object} scenario - Scenario object { id, name, snakes, ladders }
 * @returns {GameState}
 */
export function createInitialState(scenario) {
  return {
    positions: [START_SQUARE, START_SQUARE],
    currentPlayer: 0,
    lastRoll: null,
    winner: null,
    scenarioId: scenario.id
  };
}

/**
 * Rolls a random dice value (1-6).
 * @param {Function} [random=Math.random]
 * @returns {number}
 */
export function rollDice(random = Math.random) {
  return Math.floor(random() * DICE_SIDES) + 1;
}

/**
 * Moves a player and applies scenario jumps.
 * If position + roll > 100, player doesn't move.
 * @param {number} position - Current square (0-100)
 * @param {number} roll - Dice value (1-6)
 * @param {Object} jumps - Combined snakes+ladders { [from]: to }
 * @returns {number} Final square after jumps
 */
export function movePlayer(position, roll, jumps) {
  const target = position + roll;
  if (target > BOARD_LAST_SQUARE) {
    return position;
  }
  return applyJump(target, jumps);
}

/**
 * Applies snake or ladder if present on square.
 * @param {number} square - Square number (1-100)
 * @param {Object} jumps - Combined snakes+ladders { [from]: to }
 * @returns {number} Destination square
 */
export function applyJump(square, jumps) {
  return jumps[square] ?? square;
}

/**
 * Checks if player has won (exactly on 100).
 * @param {number} position - Current square
 * @returns {boolean}
 */
export function checkWin(position) {
  return position === BOARD_LAST_SQUARE;
}

/**
 * Returns next player index (0 ↔ 1).
 * @param {number} current - Current player index
 * @returns {number} Next player index
 */
export function nextPlayer(current) {
  return (current + 1) % PLAYER_COUNT;
}

/**
 * Converts square number (1-100) to {row, col} for zigzag board.
 * Row 0 = top, Row 9 = bottom. Col 0 = left.
 * @param {number} square - Square number (1-100)
 * @returns {{row: number, col: number}}
 */
export function getSquareCoordinates(square) {
  if (square < 1 || square > BOARD_LAST_SQUARE) {
    return { row: -1, col: -1 };
  }
  const zeroBased = square - 1;
  const rowFromBottom = Math.floor(zeroBased / BOARD_SIZE);
  const row = BOARD_SIZE - 1 - rowFromBottom;
  const colInRow = zeroBased % BOARD_SIZE;
  const isEvenRowFromBottom = rowFromBottom % 2 === 0;
  const col = isEvenRowFromBottom ? colInRow : BOARD_SIZE - 1 - colInRow;
  return { row, col };
}

/**
 * Executes one turn: roll, move, check win, switch player.
 * @param {GameState} state - Current state
 * @param {number} roll - Dice value (1-6)
 * @param {Object} jumps - Combined snakes+ladders { [from]: to }
 * @returns {GameState} New immutable state
 * @throws {RangeError} If roll < 1 or > 6
 */
export function playTurn(state, roll, jumps) {
  if (roll < 1 || roll > DICE_SIDES) {
    throw new RangeError(`Invalid roll: ${roll}. Must be 1-${DICE_SIDES}`);
  }

  if (state.winner !== null) {
    return state;
  }

  const currentPos = state.positions[state.currentPlayer];
  const newPos = movePlayer(currentPos, roll, jumps);
  const hasWon = checkWin(newPos);

  const newPositions = [...state.positions];
  newPositions[state.currentPlayer] = newPos;

  const newState = {
    positions: newPositions,
    currentPlayer: hasWon ? state.currentPlayer : nextPlayer(state.currentPlayer),
    lastRoll: roll,
    winner: hasWon ? state.currentPlayer : null,
    scenarioId: state.scenarioId
  };

  return newState;
}