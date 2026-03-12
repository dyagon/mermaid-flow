# Mermaid Flow Editor

A standalone Mermaid C4 diagram renderer and editor built with React and @xyflow/react.

## Features

- **Self-rendered C4 diagrams** - Parse and render C4Context/C4Container syntax without relying on Mermaid's default renderer
- **Draggable nodes** - Freely position diagram elements by dragging
- **Position persistence** - Node positions are saved automatically and restored on reload
- **Customizable themes** - Style your diagrams with configurable fonts, colors, and borders
- **Local storage** - All edits persist locally in your browser

## Supported Syntax

```
Person(id, "Label", "Description")
Person_Ext(id, "Label", "Description")
System(id, "Label", "Description")
System_Ext(id, "Label", "Description")
Container(id, "Label", "Technology", "Description")
ContainerDb(id, "Label", "Technology", "Description")
Component(id, "Label", "Technology", "Description")

Rel(source, target, "Label")
```

## Fonts

- LXGW WenKai
- Yozai

https://fonts.google.com/specimen/LXGW+WenKai+Mono+TC

https://github.com/lxgw/LxgwWenKai

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Tech Stack

- React 18 + TypeScript
- Vite
- @xyflow/react
- Zustand (state management + persistence)
