import React from "react"
import { LayoutNode, SplitNode, GroupNode, FloatingNode } from "./types"
import { DockSplit } from "./DockSplit"
import { DockGroup } from "./DockGroup"
import { FloatingWindow } from "./FloatingWindow"
import { useDock } from "./dockContextHook"

// 🔹 Recursive renderer for layout nodes
const NodeRenderer: React.FC<{
  node: LayoutNode
  parent: SplitNode | null
}> = ({ node }) => {
  switch (node.type) {
    case "split":
      return <DockSplit node={node as SplitNode} />
    case "group":
      return <DockGroup node={node as GroupNode} />
    default:
      return null
  }
}

export const DockManager: React.FC = () => {
  const { layout } = useDock()

  // 🔹 Separate floating vs docked nodes
  const dockedNodes = layout.filter(n => n.type !== "floating")
  const floatingNodes = layout.filter(n => n.type === "floating") as FloatingNode[]

  return (
    <div className="relative h-full w-full bg-slate-50">
      {/* 🔹 Docked layout (only one root normally, but we allow multiple) */}
      {dockedNodes.map(node => (
        <div key={node.id} className="absolute inset-0">
          <NodeRenderer node={node} parent={null} />
        </div>
      ))}

      {/* 🔹 Floating windows */}
      {floatingNodes.map(f => (
        <FloatingWindow key={f.id} node={f} />
      ))}
    </div>
  )
}
