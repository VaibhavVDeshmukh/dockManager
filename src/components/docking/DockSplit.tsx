import React, { useRef } from "react"
import { SplitNode } from "./types"
import { DockGroup } from "./DockGroup"

export const DockSplit: React.FC<{ node: SplitNode }> = ({ node }) => {
	const dirClass = node.direction === "row" ? "flex-row" : "flex-col"
	const sizes = node.sizes || node.children.map(() => 1)
	const containerRef = useRef<HTMLDivElement | null>(null)

	return (
		<div
			ref={containerRef}
			className={`flex ${dirClass} h-full w-full`}
			style={{ minHeight: 0 }}
		>
			{node.children.map((child, i) => (
				<div
					key={child.id}
					style={{ flex: sizes[i] }}
					className="relative min-h-0"
				>
					{child.type === "group" ? (
						<DockGroup node={child} />
					) : (
						<DockSplit node={child as SplitNode} />
					)}
				</div>
			))}
		</div>
	)
}
