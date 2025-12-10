"use client"

import { useState } from "react"
import type { Node, Edge } from "@xyflow/react"
import { X, Search, Plus, ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"
import type { WorkflowNodeData } from "../../types/workflow"
import { NodeConfigPanel } from "./node-config-panel"
import { SandboxPanel } from "./sandbox-panel"

interface RightPanelProps {
  selectedNode: Node<WorkflowNodeData> | null
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  onUpdateNode: (nodeId: string, data: Partial<WorkflowNodeData>) => void
  onDeleteNode: (nodeId: string) => void
  onDeselectNode: () => void
  onExport: () => string
  onImport: (json: string) => void
  onClear: () => void
  className?: string
}

type PanelTab = "config" | "sandbox" | "insights"

export function RightPanel({
  selectedNode,
  nodes,
  edges,
  onUpdateNode,
  onDeleteNode,
  onDeselectNode,
  onExport,
  onImport,
  onClear,
  className,
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState<PanelTab>(selectedNode ? "config" : "sandbox")
  const [isOpen, setIsOpen] = useState(true)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-slate-200 rounded-l-lg p-2 shadow-sm"
      >
        <ChevronDown className="w-4 h-4 -rotate-90" />
      </button>
    )
  }

  return (
    <div className={cn("w-80 bg-white border-l border-slate-200 flex flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <h2 className="font-semibold text-slate-900">
          {activeTab === "config" ? "Performance Overview" : "Workflow Sandbox"}
        </h2>
        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded-md">
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("config")}
          className={cn(
            "flex-1 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "config"
              ? "border-rose-500 text-rose-600"
              : "border-transparent text-slate-500 hover:text-slate-700",
          )}
        >
          Node Config
        </button>
        <button
          onClick={() => setActiveTab("sandbox")}
          className={cn(
            "flex-1 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "sandbox"
              ? "border-rose-500 text-rose-600"
              : "border-transparent text-slate-500 hover:text-slate-700",
          )}
        >
          Sandbox
        </button>
        <button
          onClick={() => setActiveTab("insights")}
          className={cn(
            "flex-1 py-2 text-sm font-medium border-b-2 transition-colors",
            activeTab === "insights"
              ? "border-rose-500 text-rose-600"
              : "border-transparent text-slate-500 hover:text-slate-700",
          )}
        >
          Insights
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "config" && (
          <NodeConfigPanel
            node={selectedNode}
            onUpdate={onUpdateNode}
            onDelete={onDeleteNode}
            onClose={onDeselectNode}
            className="h-full"
          />
        )}
        {activeTab === "sandbox" && (
          <SandboxPanel nodes={nodes} edges={edges} onExport={onExport} onImport={onImport} onClear={onClear} />
        )}
        {activeTab === "insights" && <InsightsPanel nodes={nodes} />}
      </div>
    </div>
  )
}

function InsightsPanel({ nodes }: { nodes: Node<WorkflowNodeData>[] }) {
  const nodesByType = nodes.reduce(
    (acc, node) => {
      const type = node.data?.type || "unknown"
      acc[type] = (acc[type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          placeholder="Search Here..."
          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-slate-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-slate-700">Automation Coverage</h4>
          <X className="w-4 h-4 text-slate-400" />
        </div>
        <p className="text-xs text-slate-500">Your last week is better</p>
        <span className="text-2xl font-bold text-emerald-600">72%</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-700">Node Distribution</h4>
          <Plus className="w-4 h-4 text-slate-400" />
        </div>
        {Object.entries(nodesByType).map(([type, count]) => (
          <div key={type} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="capitalize text-slate-600">{type} Nodes</span>
              <span className="font-medium text-slate-900">{count}</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  type === "start" && "bg-emerald-500",
                  type === "task" && "bg-slate-500",
                  type === "approval" && "bg-amber-500",
                  type === "automated" && "bg-violet-500",
                  type === "end" && "bg-rose-500",
                )}
                style={{ width: `${Math.min((count / nodes.length) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h4 className="text-sm font-medium text-slate-700">Flow Objectives</h4>
        {["Output Generation", "Lorem Ipsum", "Action Trigger", "Data Validation"].map((objective, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg" />
              <div>
                <p className="text-sm font-medium text-slate-900">{objective}</p>
                <p className="text-xs text-slate-500">Compiling Delivering Outputs</p>
              </div>
            </div>
            <button className="p-1 hover:bg-slate-100 rounded">
              <ChevronDown className="w-4 h-4 text-slate-400 -rotate-90" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
