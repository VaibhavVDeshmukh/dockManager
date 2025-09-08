import React, { createContext, useState } from "react"
import { LayoutNode, Panel, FloatingNode, SplitNode } from "./types"
import cloneDeep from "lodash/cloneDeep"

// 🔹 Helpers
const uid = (p = "") => Math.random().toString(36).slice(2, 9) + p
const deepClone = <T,>(v: T): T => cloneDeep(v)
// 🔹 Helper functions
const findAndRemovePanel = (
	nodes: LayoutNode[],
	panelId: string,
): Panel | null => {
	for (let i = 0; i < nodes.length; i++) {
		const node = nodes[i]
		if (node.type === "group") {
			const idx = node.tabs.findIndex((t) => t.id === panelId)
			if (idx !== -1) {
				const [removed] = node.tabs.splice(idx, 1)
				return removed
			}
		} else if (node.type === "split") {
			for (const child of node.children) {
				const found = findAndRemovePanel([child], panelId)
				if (found) return found
			}
		}
	}
	return null
}

const findGroupById = (
	nodes: LayoutNode[],
	groupId: string,
): (Panel[] & { node: LayoutNode }) | null => {
	for (const node of nodes) {
		if (node.type === "group" && node.id === groupId) {
			return { ...node, node } as any
		} else if (node.type === "split") {
			const found = findGroupById(node.children, groupId)
			if (found) return found
		}
	}
	return null
}

// 🔹 Context type
export type DockContextType = {
	layout: LayoutNode[]
	setLayout: React.Dispatch<React.SetStateAction<LayoutNode[]>>
	startDrag: (panel: Panel) => void
	dragging: Panel | null
	clearDrag: () => void
	floatPanel: (panel: Panel, x: number, y: number) => void
	unDockTab: (panelId: string, x?: number, y?: number) => void
	dockTab: (panel: Panel, targetGroupId: string) => void
	closeTab: (panelId: string) => void
	isDocked: (panelId: string) => boolean
	isFloating: (panelId: string) => boolean
}

// 🔹 Context setup
export const DockContext = createContext<DockContextType | null>(null)

// 🔹 Provider
export const DockProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [layout, setLayout] = useState<LayoutNode[]>(() => {
		// Default layout
		return [
			{
				id: uid("root-split"),
				type: "split",
				direction: "row",
				sizes: [20, 60, 20],
				children: [
					// 🔹 Left Sidebar
					{
						id: uid("left-group"),
						type: "group",
						tabs: [
							{
								id: "p1",
								title: "Explorer",
								contentId: "explorer",
								content: (
									<div style={{ backgroundColor: "#f28b82", height: "100%" }}>
										Explorer Content
									</div>
								),
							},
							{
								id: "p2",
								title: "Search",
								contentId: "search",
								content: (
									<div style={{ backgroundColor: "#fbbc04", height: "100%" }}>
										Search Content
									</div>
								),
							},
						],
						activeTab: "p1",
					},

					// 🔹 Main Area (nested split: editor + console)
					{
						id: uid("main-split"),
						type: "split",
						direction: "column",
						sizes: [70, 30],
						children: [
							{
								id: uid("editor-group"),
								type: "group",
								tabs: [
									{
										id: "p3",
										title: "Editor.tsx",
										contentId: "editor",
										content: (
											<div
												style={{ backgroundColor: "#34a853", height: "100%" }}
											>
												Editor.tsx Content
											</div>
										),
									},
									{
										id: "p4",
										title: "App.tsx",
										contentId: "editor",
										content: (
											<div
												style={{ backgroundColor: "#4285f4", height: "100%" }}
											>
												App.tsx Content
											</div>
										),
									},
									{
										id: "p5",
										title: "README.md",
										contentId: "markdown",
										content: (
											<div
												style={{ backgroundColor: "#fbbc04", height: "100%" }}
											>
												README.md Content
											</div>
										),
									},
								],
								activeTab: "p3",
							},
							{
								id: uid("console-group"),
								type: "group",
								tabs: [
									{
										id: "p6",
										title: "Terminal",
										contentId: "terminal",
										content: (
											<div
												style={{ backgroundColor: "#a7ffeb", height: "100%" }}
											>
												Terminal Content
											</div>
										),
									},
									{
										id: "p7",
										title: "Problems",
										contentId: "problems",
										content: (
											<div
												style={{ backgroundColor: "#d7aefb", height: "100%" }}
											>
												Problems Content
											</div>
										),
									},
								],
								activeTab: "p6",
							},
						],
					},

					// 🔹 Right Sidebar
					{
						id: uid("right-group"),
						type: "group",
						tabs: [
							{
								id: "p8",
								title: "Outline",
								contentId: "outline",
								content: (
									<div style={{ backgroundColor: "#f28b82", height: "100%" }}>
										Outline Content
									</div>
								),
							},
							{
								id: "p9",
								title: "Extensions",
								contentId: "extensions",
								content: (
									<div style={{ backgroundColor: "#34a853", height: "100%" }}>
										Extensions Content
									</div>
								),
							},
						],
						activeTab: "p8",
					},
				],
			} as SplitNode,

			// 🔹 Floating Panel Example
			{
				id: uid("float1"),
				type: "floating",
				x: 200,
				y: 150,
				width: 400,
				height: 250,
				panel: {
					id: "p10",
					title: "Git History",
					contentId: "git",
					content: (
						<div style={{ backgroundColor: "#fbbc04", height: "100%" }}>
							Git History Content
						</div>
					),
				},
			} as FloatingNode,
		]
	})

	const [dragging, setDragging] = useState<Panel | null>(null)

	const startDrag = (panel: Panel) => setDragging(panel)
	const clearDrag = () => setDragging(null)

	const floatPanel = (panel: Panel, x: number, y: number) => {
		setLayout((prev) => {
			const clone = deepClone(prev)
			clone.push({
				id: uid("f"),
				type: "floating",
				x,
				y,
				width: 420,
				height: 300,
				panel,
			} as FloatingNode)
			return clone
		})
		setDragging(null)
	}

	const unDockTab = (panelId: string, x: number = 150, y: number = 200) => {
		setLayout((prev) => {
			const clone = deepClone(prev)
			const panel = findAndRemovePanel(clone, panelId)
			if (panel) {
				clone.push({
					id: uid("float"),
					type: "floating",
					x,
					y,
					width: 400,
					height: 250,
					panel,
				} as FloatingNode)
			}
			return clone
		})
	}

	const dockTab = (panel: Panel, targetGroupId: string) => {
		setLayout((prev) => {
			const clone = deepClone(prev)
			const target = findGroupById(clone, targetGroupId)
			if (target && target.node.type === "group") {
				target.node.tabs.push(panel)
			}
			return clone
		})
	}

	const closeTab = (panelId: string) => {
		setLayout((prev) => {
			const clone = deepClone(prev) // using lodash
			// Remove from groups
			findAndRemovePanel(clone, panelId)
			// Remove floating panels
			const floatIdx = clone.findIndex(
				(n) => n.type === "floating" && n.panel.id === panelId,
			)
			if (floatIdx !== -1) clone.splice(floatIdx, 1)
			return clone
		})
	}

	const isDocked = (panelId: string) => {
		return layout.some((node) => {
			if (node.type === "group") return node.tabs.some((t) => t.id === panelId)
			return false
		})
	}

	const isFloating = (panelId: string) => {
		return layout.some(
			(node) => node.type === "floating" && node.panel.id === panelId,
		)
	}

	return (
		<DockContext.Provider
			value={{
				layout,
				setLayout, // ✅ directly pass state setter
				startDrag,
				dragging,
				clearDrag,
				floatPanel,
				closeTab,
				dockTab,
				isDocked,
				isFloating,
				unDockTab,
			}}
		>
			{children}
		</DockContext.Provider>
	)
}
