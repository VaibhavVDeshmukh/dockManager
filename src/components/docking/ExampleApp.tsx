import React from "react"
import { DockProvider } from "./DockProvider"
import { DockManager } from "./DockManager"
import DockObserver from "./DockObserver"

export const ExampleApp: React.FC = () =>{ 
	return (
	<DockProvider>
		<DockObserver/>
			<div className="h-[calc(80vh)]">
				<DockManager />
			</div>
	</DockProvider>
)}
