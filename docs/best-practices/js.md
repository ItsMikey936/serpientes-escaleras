# Best practices de JavaScript

## Reglas obligatorias
- ES2022 con módulos (`import`/`export`), sin librerías externas.
- `const` por defecto; `let` solo si se reasigna.
- Separación estricta: `game.js` (lógica pura, sin DOM), `ui.js` (DOM), `main.js` (eventos).
- Funciones pequeñas (máx. ~20 líneas), una sola responsabilidad.
- Estado inmutable: las funciones reciben estado y devuelven un estado nuevo.
- Constantes de configuración en SCREAMING_SNAKE_CASE (`BOARD_SIZE`, `SNAKES`, `LADDERS`).
- JSDoc en todas las funciones exportadas.
- Validar entradas; `try/catch` donde algo pueda fallar.
- DOM con `addEventListener`, `textContent` y `classList`.

## Ejemplo de referencia
```js
/**
 * Returns the next game state after a dice roll.
 * @param {GameState} state - Current state.
 * @param {number} roll - Dice value (1-6).
 * @returns {GameState} New state.
 */
export function playTurn(state, roll) {
  if (roll < 1 || roll > DICE_SIDES) throw new RangeError("Invalid roll");
  const position = movePlayer(state.positions[state.currentPlayer], roll);
  return { ...state, positions: updatePosition(state, position) };
}
```

## Anti-patrones (NO hacer)
- `var`, variables globales, `window.algo = ...`.
- `innerHTML` con datos dinámicos.
- Números mágicos (`100`, `10`, `6`) sin constante.
- Mutar el estado directamente o usar `document` dentro de `game.js`.
- `console.log` olvidados y wildcard imports (`import *`).

## Checklist de revisión
- [ ] ¿`game.js` no toca `document` ni `window`?
- [ ] ¿Sin `var`, globales ni números mágicos?
- [ ] ¿JSDoc en lo exportado y errores manejados?
- [ ] ¿El estado nunca se muta?
