"use client"

import type React from "react"
import { useCallback, useRef, type DragEvent } from "react"
import { ReactFlow, Background, Controls, MiniMap, type ReactFlowInstance } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { nodeTypes } from "./custom-nodes"
import type { NodeType, WorkflowNodeData } from "../../types/workflow"
import type { Node, Edge, Connection, NodeChange, EdgeChange } from "@xyflow/react"

interface WorkflowCanvasProps {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  onNodesChange: (changes: NodeChange<Node<WorkflowNodeData>>[]) => void
  onEdgesChange: (changes: EdgeChange<Edge>[]) => void
  onConnect: (connection: Connection) => void
  onNodeClick: (event: React.MouseEvent, node: Node<WorkflowNodeData>) => void
  onPaneClick: () => void
  onAddNode: (type: NodeType, position: { x: number; y: number }) => void
}

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  onAddNode,
}: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useRef<ReactFlowInstance<Node<WorkflowNodeData>, Edge> | null>(null)

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow") as NodeType
      if (!type || !reactFlowInstance.current || !reactFlowWrapper.current) return

      const bounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      })

      onAddNode(type, position)
    },
    [onAddNode],
  )

  const onInit = useCallback((instance: ReactFlowInstance<Node<WorkflowNodeData>, Edge>) => {
    reactFlowInstance.current = instance
  }, [])

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes as any}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          style: { stroke: "#94a3b8", strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls className="!bg-white !border-slate-200 !shadow-sm" />
        <MiniMap
          className="!bg-white !border-slate-200"
          nodeColor={(node) => {
            switch (node.data?.type) {
              case "start":
                return "#10b981"
              case "task":
                return "#475569"
              case "approval":
                return "#f59e0b"
              case "automated":
                return "#8b5cf6"
              case "end":
                return "#f43f5e"
              default:
                return "#94a3b8"
            }
          }}
        />
      </ReactFlow>
    </div>
  )
}
