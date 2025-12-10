"use client"

import { useState, useEffect } from "react"
import type { Node } from "@xyflow/react"
import { X, Plus, Trash2 } from "lucide-react"
import { cn } from "../../lib/utils"
import type {
  WorkflowNodeData,
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
  AutomationAction,
} from "../../types/workflow"
import { getAutomations } from "../../lib/mock-api"

interface NodeConfigPanelProps {
  node: Node<WorkflowNodeData> | null
  onUpdate: (nodeId: string, data: Partial<WorkflowNodeData>) => void
  onDelete: (nodeId: string) => void
  onClose: () => void
  className?: string
}

export function NodeConfigPanel({ node, onUpdate, onDelete, onClose, className }: NodeConfigPanelProps) {
  const [automations, setAutomations] = useState<AutomationAction[]>([])

  useEffect(() => {
    getAutomations().then(setAutomations)
  }, [])

  if (!node) {
    return (
      <div className={cn("p-6 flex items-center justify-center text-slate-500", className)}>
        <p className="text-sm">Select a node to configure</p>
      </div>
    )
  }

  const renderForm = () => {
    const data = node.data

    switch (data.type) {
      case "start":
        return <StartNodeForm node={node as Node<StartNodeData>} onUpdate={onUpdate} />
      case "task":
        return <TaskNodeForm node={node as Node<TaskNodeData>} onUpdate={onUpdate} />
      case "approval":
        return <ApprovalNodeForm node={node as Node<ApprovalNodeData>} onUpdate={onUpdate} />
      case "automated":
        return (
          <AutomatedNodeForm node={node as Node<AutomatedNodeData>} onUpdate={onUpdate} automations={automations} />
        )
      case "end":
        return <EndNodeForm node={node as Node<EndNodeData>} onUpdate={onUpdate} />
      default:
        return null
    }
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">Node Configuration</h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-md transition-colors">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">{renderForm()}</div>
      <div className="p-4 border-t border-slate-200">
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          onClick={() => onDelete(node.id)}
        >
          <Trash2 className="w-4 h-4" />
          Delete Node
        </button>
      </div>
    </div>
  )
}

// Start Node Form
function StartNodeForm({
  node,
  onUpdate,
}: {
  node: Node<StartNodeData>
  onUpdate: (nodeId: string, data: Partial<StartNodeData>) => void
}) {
  const [metadata, setMetadata] = useState<[string, string][]>(Object.entries(node.data.metadata || {}))

  const updateMetadata = (newMetadata: [string, string][]) => {
    setMetadata(newMetadata)
    onUpdate(node.id, {
      metadata: Object.fromEntries(newMetadata.filter(([k]) => k)),
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-slate-700">
          Start Title
        </label>
        <input
          id="title"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={node.data.title}
          onChange={(e) => onUpdate(node.id, { title: e.target.value })}
          placeholder="Enter start title"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Metadata (Key-Value)</label>
          <button
            className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
            onClick={() => updateMetadata([...metadata, ["", ""]])}
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        {metadata.map(([key, value], index) => (
          <div key={index} className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Key"
              value={key}
              onChange={(e) => {
                const newMetadata = [...metadata]
                newMetadata[index] = [e.target.value, value]
                updateMetadata(newMetadata)
              }}
            />
            <input
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Value"
              value={value}
              onChange={(e) => {
                const newMetadata = [...metadata]
                newMetadata[index] = [key, e.target.value]
                updateMetadata(newMetadata)
              }}
            />
            <button
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
              onClick={() => {
                updateMetadata(metadata.filter((_, i) => i !== index))
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Task Node Form
function TaskNodeForm({
  node,
  onUpdate,
}: {
  node: Node<TaskNodeData>
  onUpdate: (nodeId: string, data: Partial<TaskNodeData>) => void
}) {
  const [customFields, setCustomFields] = useState<[string, string][]>(Object.entries(node.data.customFields || {}))

  const updateCustomFields = (newFields: [string, string][]) => {
    setCustomFields(newFields)
    onUpdate(node.id, {
      customFields: Object.fromEntries(newFields.filter(([k]) => k)),
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-slate-700">
          Title *
        </label>
        <input
          id="title"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={node.data.title}
          onChange={(e) => onUpdate(node.id, { title: e.target.value })}
          placeholder="Enter task title"
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={node.data.description}
          onChange={(e) => onUpdate(node.id, { description: e.target.value })}
          placeholder="Enter task description"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="assignee" className="text-sm font-medium text-slate-700">
          Assignee
        </label>
        <input
          id="assignee"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={node.data.assignee}
          onChange={(e) => onUpdate(node.id, { assignee: e.target.value })}
          placeholder="Enter assignee name"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="dueDate" className="text-sm font-medium text-slate-700">
          Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={node.data.dueDate}
          onChange={(e) => onUpdate(node.id, { dueDate: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">Custom Fields</label>
          <button
            className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
            onClick={() => updateCustomFields([...customFields, ["", ""]])}
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
        {customFields.map(([key, value], index) => (
          <div key={index} className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Field name"
              value={key}
              onChange={(e) => {
                const newFields = [...customFields]
                newFields[index] = [e.target.value, value]
                updateCustomFields(newFields)
              }}
            />
            <input
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Value"
              value={value}
              onChange={(e) => {
                const newFields = [...customFields]
                newFields[index] = [key, e.target.value]
                updateCustomFields(newFields)
              }}
            />
            <button
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
              onClick={() => {
                updateCustomFields(customFields.filter((_, i) => i !== index))
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Approval Node Form
function ApprovalNodeForm({
  node,
  onUpdate,
}: {
  node: Node<ApprovalNodeData>
  onUpdate: (nodeId: string, data: Partial<ApprovalNodeData>) => void
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          id="title"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={node.data.title}
          onChange={(e) => onUpdate(node.id, { title: e.target.value })}
          placeholder="Enter approval title"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="approverRole" className="text-sm font-medium text-slate-700">
          Approver Role
        </label>
        <select
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={node.data.approverRole}
          onChange={(e) => onUpdate(node.id, { approverRole: e.target.value })}
        >
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
          <option value="VP">VP</option>
          <option value="CEO">CEO</option>
        </select>
      </div>
      <div className="space-y-2">
        <label htmlFor="threshold" className="text-sm font-medium text-slate-700">
          Auto-approve Threshold
        </label>
        <input
          id="threshold"
          type="number"
          min={0}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={node.data.autoApproveThreshold}
          onChange={(e) => onUpdate(node.id, { autoApproveThreshold: Number.parseInt(e.target.value) || 0 })}
          placeholder="Enter threshold value"
        />
        <p className="text-xs text-slate-500">Requests below this value will be auto-approved</p>
      </div>
    </div>
  )
}

// Automated Node Form
function AutomatedNodeForm({
  node,
  onUpdate,
  automations,
}: {
  node: Node<AutomatedNodeData>
  onUpdate: (nodeId: string, data: Partial<AutomatedNodeData>) => void
  automations: AutomationAction[]
}) {
  const selectedAction = automations.find((a) => a.id === node.data.actionId)
  const [params, setParams] = useState<Record<string, string>>(node.data.actionParams || {})

  const updateParams = (key: string, value: string) => {
    const newParams = { ...params, [key]: value }
    setParams(newParams)
    onUpdate(node.id, { actionParams: newParams })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          id="title"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={node.data.title}
          onChange={(e) => onUpdate(node.id, { title: e.target.value })}
          placeholder="Enter step title"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="action" className="text-sm font-medium text-slate-700">
          Select Action
        </label>
        <select
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={node.data.actionId}
          onChange={(e) => {
            onUpdate(node.id, { actionId: e.target.value, actionParams: {} })
            setParams({})
          }}
        >
          <option value="">Choose an automation</option>
          {automations.map((action) => (
            <option key={action.id} value={action.id}>
              {action.label}
            </option>
          ))}
        </select>
      </div>
      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-slate-200">
          <label className="text-xs text-slate-500 uppercase">Action Parameters</label>
          {selectedAction.params.map((param) => (
            <div key={param} className="space-y-1">
              <label htmlFor={param} className="text-sm font-medium text-slate-700 capitalize">
                {param}
              </label>
              <input
                id={param}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={params[param] || ""}
                onChange={(e) => updateParams(param, e.target.value)}
                placeholder={`Enter ${param}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// End Node Form
function EndNodeForm({
  node,
  onUpdate,
}: {
  node: Node<EndNodeData>
  onUpdate: (nodeId: string, data: Partial<EndNodeData>) => void
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="endMessage" className="text-sm font-medium text-slate-700">
          End Message
        </label>
        <textarea
          id="endMessage"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={node.data.endMessage}
          onChange={(e) => onUpdate(node.id, { endMessage: e.target.value })}
          placeholder="Enter completion message"
          rows={3}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="showSummary" className="text-sm font-medium text-slate-700">
            Show Summary
          </label>
          <p className="text-xs text-slate-500">Display workflow summary on completion</p>
        </div>
        <input
          type="checkbox"
          id="showSummary"
          className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
          checked={node.data.showSummary}
          onChange={(e) => onUpdate(node.id, { showSummary: e.target.checked })}
        />
      </div>
    </div>
  )
}
