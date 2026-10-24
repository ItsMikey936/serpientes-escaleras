# Best practices de HTML

## Reglas obligatorias
- `<!DOCTYPE html>`, `<html lang="es">`, `<meta charset="UTF-8">` y meta viewport.
- Estructura semántica: `header`, `main`, `section`, `footer`. Un solo `<h1>`.
- Acciones del usuario con `<button type="button">`.
- Imágenes con `alt`; controles sin texto visible con `aria-label`.
- Zonas dinámicas (turno, mensajes) con `aria-live="polite"`.
- IDs y clases en kebab-case; CSS y JS siempre externos.
- JS cargado con `<script type="module" src="js/main.js"></script>`.

## Ejemplo de referencia
```html
<section class="game" aria-labelledby="game-title">
  <h2 id="game-title" class="game__title">Tablero</h2>
  <p class="game__status" aria-live="polite">Turno del Jugador 1</p>
  <button class="game__dice-button" type="button">Tirar dado</button>
</section>
```

## Anti-patrones (NO hacer)
- `style="..."`, `onclick="..."` o `<script>` inline.
- `<div>` o `<span>` clicables en lugar de `<button>`.
- Tablas para maquetar, IDs duplicados, etiquetas obsoletas (`center`, `font`).
- Saltar niveles de encabezado (h1 -> h3).

## Checklist de revisión
- [ ] ¿Un solo `h1`, `lang="es"` y viewport?
- [ ] ¿Todo lo clicable es `<button>` y las imágenes tienen `alt`?
- [ ] ¿Sin estilos ni scripts inline?
- [ ] ¿Se puede jugar solo con teclado?
