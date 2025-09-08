import React from "react"
import { Panel } from "./types"
import { PinIcon, X } from "lucide-react"
import { Button } from "../ui/button"
import { useDock } from "./dockContextHook"

type TabHeaderProps = {
	tab: Panel
	isActive: boolean
	onClick: (id: string) => void
	onDragStart: (e: React.DragEvent, panel: Panel) => void
}

export const TabHeader: React.FC<TabHeaderProps> = ({
	tab,
	isActive,
	onClick,
	onDragStart,
}) => {
	const { closeTab, unDockTab } = useDock()

	return (
		<div
			key={tab.id}
			draggable
			onClick={() => onClick(tab.id)}
			onDragStart={(e) => onDragStart(e, tab)}
			className={`group flex cursor-pointer items-center justify-between rounded-t-md px-3 py-1.5 text-sm transition-colors
        ${
					isActive
						? "border-b-2 border-blue-500 bg-slate-100 font-semibold text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
						: "text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
				}`}
		>
			{/* Title */}
			<span className="truncate">{tab.title}</span>

			{/* Buttons (hover/active visible) */}
			<div
				className={`ml-3 flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100 ${
					isActive ? "opacity-100" : ""
				}`}
			>
				<Button
					onClick={(e) => {
						e.stopPropagation()
						unDockTab(tab.id)
					}}
					variant="ghost"
					size="iconSm"
					className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
				>
					<PinIcon className="h-3 w-3" />
				</Button>
				<Button
					onClick={(e) => {
						e.stopPropagation()
						closeTab(tab.id)
					}}
					variant="ghost"
					size="iconSm"
					className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
				>
					<X className="h-3 w-3" />
				</Button>
			</div>
		</div>
	)
}
