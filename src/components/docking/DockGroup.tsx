import React, { useRef } from "react"
import { GroupNode, Panel } from "./types"
import { TabHeaderBar } from "./TabHeaderBar"
import { useDock } from "./dockContextHook"

export const DockGroup: React.FC<{ node: GroupNode }> = ({ node }) => {
  const { startDrag, setLayout } = useDock()
  const ref = useRef<HTMLDivElement | null>(null)

  const onHeaderDragStart = (e: React.DragEvent, panel: Panel) => {
    e.dataTransfer.setData("text/plain", panel.id)
    startDrag(panel)
  }

  // 🔹 Switch active tab
  const onTabClick = (tabId: string) => {
    setLayout((prev) => {
      const updateActive = (nodes: typeof prev): typeof prev =>
        nodes.map((n) => {
          if (n.type === "group" && n.id === node.id) {
            return { ...n, activeTab: tabId }
          } else if (n.type === "split") {
            return { ...n, children: updateActive(n.children) }
          }
          return n
        })
      return updateActive(prev)
    })
  }

  return (
    <div ref={ref} className="flex h-full min-h-0 w-full flex-col">
      {node.tabs.length > 0 ? (
        <TabHeaderBar
          node={node}
          onTabClick={onTabClick}
          onHeaderDragStart={onHeaderDragStart}
        />
      ) : null}
      <div className="flex-1 overflow-auto p-0">
        {node.tabs.find((t) => t.id === node.activeTab)?.content}
      </div>
    </div>
  )
}
