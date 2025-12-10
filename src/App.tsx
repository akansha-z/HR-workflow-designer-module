import { ReactFlowProvider } from "@xyflow/react"
import { useState } from "react"
import { AppSidebar } from "./components/workflow/app-sidebar"
import { WorkflowHeader } from "./components/workflow/workflow-header"
import { WorkflowCanvas } from "./components/workflow/workflow-canvas"
import { RightPanel } from "./components/workflow/right-panel"
import { useWorkflow } from "./hooks/use-workflow"

function WorkflowDesigner() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
    addNode,
    updateNodeData,
    deleteNode,
    clearCanvas,
    exportWorkflow,
    importWorkflow,
    setSelectedNode,
  } = useWorkflow()

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Left Sidebar */}
      <AppSidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <WorkflowHeader onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} sidebarCollapsed={sidebarCollapsed} />

        <div className="flex-1 flex overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 relative">
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onAddNode={addNode}
            />
          </div>

          {/* Right Panel */}
          <RightPanel
            selectedNode={selectedNode}
            nodes={nodes}
            edges={edges}
            onUpdateNode={updateNodeData}
            onDeleteNode={deleteNode}
            onDeselectNode={() => setSelectedNode(null)}
            onExport={exportWorkflow}
            onImport={importWorkflow}
            onClear={clearCanvas}
          />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ReactFlowProvider>
      <WorkflowDesigner />
    </ReactFlowProvider>
  )
}
