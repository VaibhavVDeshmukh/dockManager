import { useEffect } from "react"
import { useDock } from "./dockContextHook"
import { LayoutNode } from "./types"
import cloneDeep from "lodash/cloneDeep"

/**
 * Hook that observes layout changes and adjusts split sizes dynamically
 * so empty groups take no space, middle/main panels expand.
 */
export const useResponsiveDock = () => {
  const { layout, setLayout } = useDock()

  useEffect(() => {
    const adjustSplits = (nodes: LayoutNode[]): boolean => {
      let updated = false

      nodes.forEach((node) => {
        if (node.type === "split") {
          const children = node.children

          // Determine active children: groups with at least 1 tab or nested splits
          const activeChildren = children.filter((child) => {
            if (child.type === "group") return child.tabs.length > 0
            if (child.type === "split") return true
            return false
          })

          // Only update sizes if something changed
          if (activeChildren.length !== children.length) {
            const newSizes = children.map((child) =>
              activeChildren.includes(child) ? 100 / activeChildren.length : 0
            )
            if (JSON.stringify(newSizes) !== JSON.stringify(node.sizes)) {
              node.sizes = newSizes
              updated = true
            }
          }

          // Recursively adjust nested splits
          children.forEach((child) => {
            if (child.type === "split") {
              const changed = adjustSplits([child])
              if (changed) updated = true
            }
          })
        }
      })

      return updated
    }

    const clone = cloneDeep(layout)
    const changed = adjustSplits(clone)
    if (changed) setLayout(clone)
  }, [layout, setLayout])
}
