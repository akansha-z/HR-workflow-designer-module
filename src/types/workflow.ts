// Workflow node and edge types for the HR Workflow Designer

export type NodeType = "start" | "task" | "approval" | "automated" | "end"

export interface BaseNodeData {
  label: string
  type: NodeType
  [key: string]: unknown
}

export interface StartNodeData extends BaseNodeData {
  type: "start"
  title: string
  metadata: Record<string, string>
}

export interface TaskNodeData extends BaseNodeData {
  type: "task"
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: Record<string, string>
}

export interface ApprovalNodeData extends BaseNodeData {
  type: "approval"
  title: string
  approverRole: "Manager" | "HRBP" | "Director" | string
  autoApproveThreshold: number
}

export interface AutomatedNodeData extends BaseNodeData {
  type: "automated"
  title: string
  actionId: string
  actionParams: Record<string, string>
}

export interface EndNodeData extends BaseNodeData {
  type: "end"
  endMessage: string
  showSummary: boolean
}

export type WorkflowNodeData = StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedNodeData | EndNodeData

export interface AutomationAction {
  id: string
  label: string
  params: string[]
}

export interface SimulationStep {
  nodeId: string
  nodeTitle: string
  nodeType: NodeType
  status: "completed" | "in-progress" | "pending" | "error"
  message: string
  timestamp: string
}

export interface SimulationResult {
  success: boolean
  steps: SimulationStep[]
  errors: string[]
}

export interface WorkflowValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}
