import React from "react"
import { GroupNode, Panel } from "./types"
import { TabHeader } from "./TabHeader"

type TabHeaderBarProps = {
	node: GroupNode
	onTabClick: (tabId: string) => void
	onHeaderDragStart: (e: React.DragEvent, panel: Panel) => void
}

export const TabHeaderBar: React.FC<TabHeaderBarProps> = ({
	node,
	onTabClick,
	onHeaderDragStart,
}) => {
	return (
		<div
			className="flex w-full items-center overflow-x-auto border-b 
      border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
		>
			{/* Tab strip */}
			<div className="flex min-w-max">
				{node.tabs.map((t) => (
					<TabHeader
						key={t.id}
						tab={t}
						isActive={node.activeTab === t.id}
						onClick={onTabClick}
						onDragStart={onHeaderDragStart}
					/>
				))}
			</div>
		</div>
	)
}
