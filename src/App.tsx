import { ExampleApp } from "./components/docking/ExampleApp"
import { SiteHeader } from "./components/site-header"


function App() {

  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <SiteHeader/>
        <ExampleApp />
      </div>
    </>
  )
}

export default App
