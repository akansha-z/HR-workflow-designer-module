"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { useNodesState, useEdgesState, addEdge, type Node, type Edge, type Connection } from "@xyflow/react"
import type { WorkflowNodeData, NodeType } from "../types/workflow"

const initialNodes: Node<WorkflowNodeData>[] = []
const initialEdges: Edge[] = []

export function useWorkflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowNodeData>>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null)
  const nodeIdCounter = useRef(1)

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#94a3b8", strokeWidth: 2 },
          },
          eds,
        ),
      )
    },
    [setEdges],
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<WorkflowNodeData>) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const createNode = useCallback((type: NodeType, position: { x: number; y: number }): Node<WorkflowNodeData> => {
    const id = `node-${nodeIdCounter.current++}`

    const baseData = {
      label: getDefaultLabel(type),
      type,
    }

    let data: WorkflowNodeData

    switch (type) {
      case "start":
        data = { ...baseData, type: "start", title: "Start", metadata: {} }
        break
      case "task":
        data = {
          ...baseData,
          type: "task",
          title: "New Task",
          description: "",
          assignee: "",
          dueDate: "",
          customFields: {},
        }
        break
      case "approval":
        data = {
          ...baseData,
          type: "approval",
          title: "Approval Required",
          approverRole: "Manager",
          autoApproveThreshold: 0,
        }
        break
      case "automated":
        data = {
          ...baseData,
          type: "automated",
          title: "Automated Step",
          actionId: "",
          actionParams: {},
        }
        break
      case "end":
        data = {
          ...baseData,
          type: "end",
          endMessage: "Workflow Complete",
          showSummary: false,
        }
        break
      default:
        data = { ...baseData, type: "start", title: "Start", metadata: {} }
    }

    return {
      id,
      type: `${type}Node`,
      position,
      data,
    }
  }, [])

  const addNode = useCallback(
    (type: NodeType, position: { x: number; y: number }) => {
      const newNode = createNode(type, position)
      setNodes((nds) => [...nds, newNode])
      return newNode
    },
    [createNode, setNodes],
  )

  const updateNodeData = useCallback(
    (nodeId: string, newData: Partial<WorkflowNodeData>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            const updatedNode = {
              ...node,
              data: { ...node.data, ...newData } as WorkflowNodeData,
            }
            if (selectedNode?.id === nodeId) {
              setSelectedNode(updatedNode)
            }
            return updatedNode
          }
          return node
        }),
      )
    },
    [setNodes, selectedNode],
  )

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null)
      }
    },
    [setNodes, setEdges, selectedNode],
  )

  const deleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId))
    },
    [setEdges],
  )

  const clearCanvas = useCallback(() => {
    setNodes([])
    setEdges([])
    setSelectedNode(null)
    nodeIdCounter.current = 1
  }, [setNodes, setEdges])

  const exportWorkflow = useCallback(() => {
    return JSON.stringify({ nodes, edges }, null, 2)
  }, [nodes, edges])

  const importWorkflow = useCallback(
    (json: string) => {
      try {
        const { nodes: importedNodes, edges: importedEdges } = JSON.parse(json)
        setNodes(importedNodes)
        setEdges(importedEdges)
        setSelectedNode(null)
        const maxId = Math.max(
          ...importedNodes.map((n: Node) => {
            const match = n.id.match(/node-(\d+)/)
            return match ? Number.parseInt(match[1]) : 0
          }),
          0,
        )
        nodeIdCounter.current = maxId + 1
      } catch (e) {
        console.error("Failed to import workflow:", e)
      }
    },
    [setNodes, setEdges],
  )

  return {
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
    deleteEdge,
    clearCanvas,
    exportWorkflow,
    importWorkflow,
    setSelectedNode,
  }
}

function getDefaultLabel(type: NodeType): string {
  switch (type) {
    case "start":
      return "Start"
    case "task":
      return "Task"
    case "approval":
      return "Approval"
    case "automated":
      return "Automated"
    case "end":
      return "End"
    default:
      return "Node"
  }
}
