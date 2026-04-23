# Refactor UI: Sidebar y ChatInput

Objetivo: limpiar la interfaz eliminando la barra de herramientas intermedia,
consolidando los controles del sidebar dentro del sidebar, y los filtros
dentro del ChatInput al estilo toolbar inline.

---

## Grupo A — Sidebar

Mover al sidebar todo lo que conceptualmente le pertenece: el trigger para
ocultarlo y el botón para crear chats. Cuando el sidebar esté colapsado,
ambos deben mostrarse como íconos en la columna angosta (comportamiento
nativo de shadcn/ui con `tooltip`).

### A1. Mover `SidebarTrigger` al interior del sidebar

- **Archivo:** `src/pages/Index.tsx`
- **Qué:** el `SidebarTrigger` está actualmente en `chat.tsx` (header del chat).
  Moverlo dentro del `SidebarHeader` en `Index.tsx` (línea 15), como primer
  elemento antes del logo, o como ícono fijo en la parte inferior del sidebar.
- **Estado:** [x] completado — sidebar usa `collapsible="icon"`, logo movido al header del chat, trigger dentro del `SidebarHeader`

### A2. Mover `NewChatButton` al sidebar

- **Archivo:** `src/pages/Index.tsx` + `src/components/chat/chatCreateButton/chat_create_button.tsx`
- **Qué:** colocar el botón debajo del `SidebarHeader` (entre el logo y la lista
  de chats). Reemplazar el `Button` exterior por `SidebarMenuButton` con prop
  `tooltip="Nuevo Chat"` para que cuando el sidebar esté colapsado muestre
  solo el ícono `+`.
- **Estado:** [x] completado — botón movido al `SidebarContent`, texto oculto en modo colapsado, ícono `+` centrado

### A3. Eliminar la barra de herramientas intermedia de `chat.tsx`

- **Archivo:** `src/components/chat/chat.tsx`
- **Qué:** una vez movidos `NewChatButton` y `FilterButton`, eliminar el `div`
  de líneas 161-176 completo. También quitar el badge de "filtros activos" de
  ese bloque (se reubica en el ChatInput, paso B3).
- **Estado:** [x] completado — barra eliminada, `NewChatButton` quitado de `chat.tsx`, `FilterButton` pendiente de mover (paso B3/B4)

---

## Grupo B — ChatInput

Integrar los filtros como toolbar inline debajo del textarea, al estilo del
input de Claude Code en VSCode. El resultado esperado:

```text
┌─────────────────────────────────────────┐
│  Escribí tu consulta...                 │
└─────────────────────────────────────────┘
  [Todos ▾]  [Año ▾]        [Filtros] [↑]
```

### B1. Agregar `MEMOS` al array de tipos de documento

- **Archivo:** `src/components/chat/filter/filter_sidebar.tsx`
- **Qué:** agregar `"MEMOS"` al array `tipoDigestoOptions` (línea 13)
- **Estado:** [ ] pendiente — cambio simple, puede hacerse primero

### B2. Crear dropdown compacto de Tipo de Digesto

- **Archivo:** nuevo componente `src/components/chat/filter/filter_type_select.tsx`
- **Qué:** un `Select` o `DropdownMenu` compacto con las opciones de
  `tipoDigestoOptions` (incluyendo MEMOS). Reemplaza al `FilterButton` como
  control principal. Soporta selección múltiple o selección única según se defina.
- **Estado:** [ ] pendiente

### B3. Integrar toolbar en `ChatInput`

- **Archivo:** `src/components/chat/chat_input.tsx`
- **Qué:** agregar una fila entre el textarea y el texto de ayuda con:
  - El dropdown de tipo (resultado de B2)
  - Opcionalmente un selector de año compacto
  - Badge de filtros activos (movido desde la barra intermedia)
  - Botón de acceso al filtro avanzado (`FilterSidebar`) como ícono pequeño
  - Botón enviar (reubicado a esa misma fila)
- **Estado:** [ ] pendiente — hacer después de B2

### B4. Deprecar o simplificar `FilterButton` (popover completo)

- **Archivo:** `src/components/chat/filter/filter.tsx`
- **Qué:** el panel completo de filtros (`FilterSidebar`) puede quedar accesible
  desde un ícono secundario en la toolbar del input (ej: ícono de sliders).
  Evaluar si conviene mantenerlo o reducirlo solo a los filtros menos frecuentes
  (estado, estado_digesto, tipo_publicacion, límite).
- **Estado:** [ ] pendiente — decisión de diseño antes de implementar

---

## Orden de implementación sugerido

```text
B1 → A1 → A2 → A3 → B2 → B3 → B4
```

Arrancar por B1 (aditivo, sin riesgo), luego consolidar el sidebar (A1-A3),
y finalmente refactorizar el ChatInput (B2-B4) que es la pieza de mayor superficie.
