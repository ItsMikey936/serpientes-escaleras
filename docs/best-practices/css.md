# Best practices de CSS

## Reglas obligatorias
- Colores, espaciados y tamaños como variables en `:root` (`--color-primary`).
- Clases en BEM: `bloque__elemento--modificador`.
- Mobile-first: estilos base para móvil, `@media (min-width: 48rem)` para ampliar.
- Layout con Grid/Flexbox. El tablero 10x10 usa `display: grid` con `repeat(10, 1fr)`.
- Unidades `rem`, `%`, `fr`, `vmin`; `px` solo en bordes finos.
- Contraste de texto mínimo 4.5:1 (WCAG AA) y `:focus-visible` claro.
- Animar solo `transform` y `opacity`, y respetar `prefers-reduced-motion`.
- Un solo archivo `css/styles.css`, con secciones comentadas.

## Ejemplo de referencia
```css
:root { --color-snake: #c0392b; --space-sm: 0.5rem; }
.board { display: grid; grid-template-columns: repeat(10, 1fr); gap: var(--space-sm); }
.board__cell--snake { background: var(--color-snake); }
@media (prefers-reduced-motion: reduce) { .token { transition: none; } }
```

## Anti-patrones (NO hacer)
- `!important`.
- Selectores por ID o anidados a más de 2 niveles.
- Colores hardcodeados fuera de `:root`.
- Anchos fijos en px que rompan la vista a 360px.
- Animar `width`, `height`, `top` o `left`.

## Checklist de revisión
- [ ] ¿Todos los colores salen de variables?
- [ ] ¿BEM consistente y sin `!important`?
- [ ] ¿Se ve bien a 360px y en escritorio?
- [ ] ¿Existe `prefers-reduced-motion` y `:focus-visible`?
