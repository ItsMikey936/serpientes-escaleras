# AGENTS.md - Serpientes y Escaleras (Knowledge Priming)

## 1. Arquitectura
Juego de tablero 10x10 para 2 jugadores, en el navegador, sin backend ni build.
- `game.js`: estado y reglas. Funciones puras, sin DOM.
- `ui.js`: dibuja el estado en el DOM. Nunca modifica el estado.
- `main.js`: arranque y eventos. Une UI con lógica.
Flujo: click en dado -> `main.js` llama `playTurn(state)` -> nuevo estado -> `renderGame(state)`.

## 2. Stack y versiones
- HTML5, CSS3 (Grid + custom properties), JavaScript ES2022 con módulos nativos.
- Navegadores evergreen actuales. Se sirve con `npx serve .` (los módulos no corren en `file://`).
- Sin librerías, frameworks, npm packages ni bundlers. Estado inmutable (spread, nunca mutar).

## 3. Fuentes (consultar antes de buscar)
| Tema | Fuente |
|------|--------|
| HTML/CSS/JS | https://developer.mozilla.org/es/ |
| Accesibilidad | https://www.w3.org/TR/WCAG22/ |
| Nombres CSS | https://getbem.com/naming/ |
| Reglas del proyecto | `docs/best-practices/html.md`, `css.md`, `js.md` |
| Diseño aprobado | `docs/DESIGN.md` |

## 4. Estructura
index.html | css/styles.css | js/{game,ui,main}.js | docs/{DESIGN.md,PROMPTS.md,best-practices/}

## 5. Naming
- Archivos y clases/IDs: kebab-case. Clases CSS en BEM (`board__cell--snake`).
- Funciones: camelCase, verbo primero (`rollDice`, `applyJump`). Booleanos: `is/has/can`.
- Constantes: SCREAMING_SNAKE_CASE (`BOARD_SIZE`). Código en inglés, textos de UI en español.

## 6. Ejemplo de cómo programamos
```js
/**
 * Moves a player and applies snakes or ladders.
 * @param {number} position - Current square (1-100).
 * @param {number} roll - Dice value (1-6).
 * @returns {number} Final square.
 */
export function movePlayer(position, roll) {
  const target = Math.min(position + roll, BOARD_LAST_SQUARE);
  return JUMPS[target] ?? target;
}
```

## 7. Anti-patrones (NO hacer)
- `var`, variables globales, números mágicos, `innerHTML` con datos dinámicos.
- Lógica del juego dentro de `ui.js` o `document` dentro de `game.js`.
- `!important`, estilos/scripts inline, `div` clicables en vez de `<button>`.
- Agregar features que no se pidieron. Reescribir código que ya funciona.

## Flujo de trabajo
1. Diseño primero: capacidades -> componentes -> interacciones -> contratos. Presenta un nivel, espera mi aprobación. NO escribas código hasta aprobar los contratos.
2. Cambios por refinamiento iterativo: respeta [REFINAMIENTOS ANTERIORES] y [RESTRICCIONES].
3. Cierra cada respuesta con: archivos cambiados y "Best practices aplicadas".
