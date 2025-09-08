// dockContextHook.ts
import { useContext } from "react"
import { DockContext, DockContextType } from "./DockProvider"

export const useDock = (): DockContextType => {
  const ctx = useContext(DockContext)
  if (!ctx) throw new Error("useDock must be used inside DockProvider")
  return ctx
}
