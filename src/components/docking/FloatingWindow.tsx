import React, { useState, useRef } from "react"
import { FloatingNode } from "./types"
import { createPortal } from "react-dom"
import { Button } from "../ui/button"
import { PinIcon, X } from "lucide-react"
import { useDock } from "./dockContextHook"

export const FloatingWindow: React.FC<{ node: FloatingNode }> = ({ node }) => {
	const { setLayout, dockTab } = useDock()
	const ref = useRef<HTMLDivElement | null>(null)
	const [pos, setPos] = useState({ x: node.x, y: node.y })

	const onMouseDown = (e: React.MouseEvent) => {
		const rect = ref.current!.getBoundingClientRect()
		const offsetX = e.clientX - rect.left
		const offsetY = e.clientY - rect.top

		const onMove = (ev: MouseEvent) => {
			setPos({ x: ev.clientX - offsetX, y: ev.clientY - offsetY })
		}
		const onUp = () => {
			window.removeEventListener("mousemove", onMove)
			window.removeEventListener("mouseup", onUp)
		}
		window.addEventListener("mousemove", onMove)
		window.addEventListener("mouseup", onUp)
	}

	const onClose = () => {
		setLayout((prev) => prev.filter((n) => n.id !== node.id))
	}

	return createPortal(
		<div
			ref={ref}
			className="fixed border border-slate-300 bg-white shadow-2xl 
             dark:border-slate-700 dark:bg-slate-900"
			style={{
				left: pos.x,
				top: pos.y,
				width: node.width,
				height: node.height,
			}}
		>
			{/* Header */}
			<div
				onMouseDown={onMouseDown}
				className="flex cursor-move items-center justify-between border-b 
             border-slate-200 bg-slate-100 p-2 text-slate-800 
             dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
			>
				<span>{node.panel.title}</span>
				<div className="flex">
					<Button
						onClick={(e) => {
							e.stopPropagation()
							dockTab(node.panel, node.id)
						}}
						variant="ghost"
						size="iconSm"
					>
						<PinIcon className="h-3 w-3" />
					</Button>
					<Button
						onClick={(e) => {
							e.stopPropagation()
							onClose()
						}}
						variant="ghost"
						size="iconSm"
					>
						<X className="h-3 w-3" />
					</Button>
				</div>
			</div>

			{/* Content */}
			<div className="p-2 text-slate-700 dark:text-slate-200">
				{node.panel.content}
			</div>
		</div>,
		document.body,
	)
}
