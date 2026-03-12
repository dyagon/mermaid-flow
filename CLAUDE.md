# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mermaid Flow Editor - A standalone Mermaid C4 diagram renderer and editor built with React and @xyflow/react. Supports draggable nodes, position persistence via localStorage, and custom theming.

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server at http://localhost:5173
npm run build    # TypeScript check + production build
npm run preview  # Preview production build
```

## Architecture

### Directory Structure

```
src/
├── components/          # React UI components
│   ├── elements/       # C4 diagram node components (Person, System, Container, etc.)
│   ├── Editor.tsx      # Main editor layout (left/right panels)
│   ├── FlowChart.tsx  # ReactFlow wrapper
│   ├── MermaidInput.tsx # Code input panel
│   └── NodeLabel.tsx  # Default node component
├── features/            # Feature modules (business logic)
│   ├── c4Parser/      # C4 syntax parser
│   └── themes/        # Theme definitions
├── hooks/              # Custom React hooks
│   └── useEditor.ts   # Editor business logic (parsing, position calculation)
├── store/              # State management
│   └── editorStore.ts # Zustand store with localStorage persistence
├── types/              # TypeScript type definitions
└── App.tsx            # Root component
```

### Key Patterns

**State Management**: Uses Zustand with persist middleware. Store (`editorStore.ts`) handles only state - no business logic. Hook (`useEditor.ts`) contains parsing, position calculation, and coordinates between store and components.

**Component Types**: Each C4 element type has its own component in `components/elements/`. The parser maps C4 types to component names, and FlowChart registers them as nodeTypes.

**Node Types**:
- `PersonNode`, `PersonExtNode` - User icons (green)
- `SystemNode`, `SystemExtNode` - System boxes (blue)
- `ContainerNode` - Container (yellow)
- `ContainerDbNode` - Database cylinder (purple)
- `ComponentNode` - Component (indigo)
- `BoundaryNode` - Enterprise/System boundary (auto-sizing)

**Styling**: Components use static style objects with `Record<string, React.CSSProperties>` type. Theme values defined in `features/themes/index.ts`.

## Supported C4 Syntax

```mermaid
Person(id, "Label", "Description")
Person_Ext(id, "Label", "Description")
System(id, "Label", "Description")
System_Ext(id, "Label", "Description")
Container(id, "Label", "Technology", "Description")
ContainerDb(id, "Label", "Technology", "Description")
Component(id, "Label", "Technology", "Description")

Rel(source, target, "Label")
BiRel(source, target, "Label")

Enterprise_Boundary(id, "Label") {
  System(s1, "System 1")
}

System_Boundary(id, "Label") {
  Container(c1, "Container 1")
}
```
