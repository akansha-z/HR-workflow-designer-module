import type { AutomationAction, SimulationResult, SimulationStep, WorkflowNodeData } from "../types/workflow"
import type { Node, Edge } from "@xyflow/react"

// Mock automation actions
const automationActions: AutomationAction[] = [
  { id: "send_email", label: "Send Email", params: ["to", "subject", "body"] },
  { id: "generate_doc", label: "Generate Document", params: ["template", "recipient"] },
  { id: "slack_notify", label: "Send Slack Notification", params: ["channel", "message"] },
  { id: "create_ticket", label: "Create Support Ticket", params: ["title", "priority"] },
  { id: "update_database", label: "Update Database Record", params: ["table", "field", "value"] },
  { id: "schedule_meeting", label: "Schedule Meeting", params: ["attendees", "duration", "title"] },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// GET /automations - Returns available automation actions
export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300)
  return automationActions
}

// POST /simulate - Simulates workflow execution
export async function simulateWorkflow(nodes: Node<WorkflowNodeData>[], edges: Edge[]): Promise<SimulationResult> {
  await delay(500)

  const errors: string[] = []
  const steps: SimulationStep[] = []

  // Find start node
  const startNode = nodes.find((n) => n.data?.type === "start")
  if (!startNode) {
    return {
      success: false,
      steps: [],
      errors: ["No Start Node found in workflow"],
    }
  }

  // Find end node
  const endNode = nodes.find((n) => n.data?.type === "end")
  if (!endNode) {
    errors.push("No End Node found in workflow")
  }

  // Build adjacency map
  const adjacencyMap = new Map<string, string[]>()
  edges.forEach((edge) => {
    const sources = adjacencyMap.get(edge.source) || []
    sources.push(edge.target)
    adjacencyMap.set(edge.source, sources)
  })

  // Traverse workflow from start
  const visited = new Set<string>()
  const queue = [startNode.id]
  let stepIndex = 0

  while (queue.length > 0) {
    const currentId = queue.shift()!
    if (visited.has(currentId)) continue
    visited.add(currentId)

    const currentNode = nodes.find((n) => n.id === currentId)
    if (!currentNode || !currentNode.data) continue

    const nodeData = currentNode.data

    // Create simulation step
    const step: SimulationStep = {
      nodeId: currentId,
      nodeTitle: "title" in nodeData ? (nodeData.title as string) : nodeData.label,
      nodeType: nodeData.type,
      status: "completed",
      message: getStepMessage(nodeData),
      timestamp: new Date(Date.now() + stepIndex * 1000).toISOString(),
    }

    // Simulate random failures for demo
    if (nodeData.type === "approval" && Math.random() < 0.1) {
      step.status = "error"
      step.message = "Approval rejected by " + (nodeData as any).approverRole
    }

    steps.push(step)
    stepIndex++

    // Add connected nodes to queue
    const nextNodes = adjacencyMap.get(currentId) || []
    nextNodes.forEach((id) => queue.push(id))
  }

  // Check for disconnected nodes
  const disconnectedNodes = nodes.filter((n) => !visited.has(n.id))
  if (disconnectedNodes.length > 0) {
    errors.push(`${disconnectedNodes.length} node(s) are not connected to the workflow`)
  }

  return {
    success: errors.length === 0,
    steps,
    errors,
  }
}

function getStepMessage(nodeData: WorkflowNodeData): string {
  switch (nodeData.type) {
    case "start":
      return `Workflow started: ${nodeData.title}`
    case "task":
      return `Task "${nodeData.title}" assigned to ${nodeData.assignee || "Unassigned"}`
    case "approval":
      return `Awaiting approval from ${nodeData.approverRole}`
    case "automated":
      return `Executing automated action: ${nodeData.actionId || "None selected"}`
    case "end":
      return nodeData.endMessage || "Workflow completed"
    default:
      return "Processing..."
  }
}

// Validate workflow structure
export function validateWorkflow(
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  // Check for start node
  const startNodes = nodes.filter((n) => n.data?.type === "start")
  if (startNodes.length === 0) {
    errors.push("Workflow must have a Start Node")
  } else if (startNodes.length > 1) {
    errors.push("Workflow can only have one Start Node")
  }

  // Check for end node
  const endNodes = nodes.filter((n) => n.data?.type === "end")
  if (endNodes.length === 0) {
    warnings.push("Workflow should have an End Node")
  }

  // Check that start node has outgoing edges
  if (startNodes.length === 1) {
    const hasOutgoing = edges.some((e) => e.source === startNodes[0].id)
    if (!hasOutgoing) {
      errors.push("Start Node must have at least one outgoing connection")
    }
  }

  // Check for nodes without connections
  nodes.forEach((node) => {
    if (node.data?.type === "start") return
    const hasIncoming = edges.some((e) => e.target === node.id)
    if (!hasIncoming) {
      warnings.push(`Node "${node.data?.label || node.id}" has no incoming connections`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
