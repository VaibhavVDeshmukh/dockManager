📌 Project Description

This project is a custom docking layout system in React (similar to VSCode, WebStorm, or Figma), built with React + TypeScript + TailwindCSS (and ShadCN if needed).

It allows developers to create a multi-panel, resizable, dockable workspace UI, where panels can be:

📂 Docked into groups (tabs inside left, right, top, bottom panels).

📤 Undocked / Floated as independent draggable windows.

❌ Closed to free up space.

📥 Re-docked into other groups dynamically.

The layout is managed through a DockProvider + Context API, where state (layout) represents a tree of split, group, and floating nodes:

Split Node → Defines row/column layout with resizable sections.

Group Node → Holds tabs (like "Explorer", "Terminal", "Outline").

Floating Node → Represents a window that has been undocked.

🔹 Features Implemented

Dynamic Layout Management

Recursive tree structure (LayoutNode) for flexible nesting.

Tabs inside groups can be added, removed, moved, or floated.

Panel Operations

closeTab(panelId) → Closes a tab and removes it from the layout.

unDockTab(panelId) → Converts a tab into a floating window.

dockTab(panel, groupId) → Moves a floating panel back into a group.

floatPanel(panel, x, y) → Creates new floating panels.

Responsive Behavior

Custom hook useResponsiveDock automatically adjusts split sizes.

When side panels (left/right) are closed, the center panel expands to take full width.

Prevents empty panels from occupying space (like VSCode collapsing sidebars).

Drag-and-Drop Support (in-progress)

Start drag with startDrag(panel), clear with clearDrag().

Enables moving panels across groups.

🔹 Current Issues Being Solved

🐞 Empty side panels still occupy small space even when no tabs exist → requires hiding nodes (display: none or flex: 0 0 0).

🐞 Circular JSON errors when deep cloning React elements → solved using lodash.cloneDeep instead of JSON.stringify.

🔄 Need better rendering logic in Split component to completely collapse empty panels.

🔹 Tech Stack

React (TSX) – UI framework

Context API – global dock state

Lodash – deep clone state safely

TailwindCSS + ShadCN – styling & components

(Optional) Framer Motion – for smooth animations when collapsing/expanding

🔹 Use Case

This project is ideal for:

Code editors (like VSCode clone in browser)

Data analysis dashboards with floating panels

UI builders / design tools with dockable sidebars

Custom IDEs for specific domains

Install dependencies
``
npm install
``
Run development server
``
npm run dev
``
