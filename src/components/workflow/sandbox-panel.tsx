"use client"

import { useState } from "react"
import type { Node, Edge } from "@xyflow/react"
import { Play, CheckCircle2, XCircle, Clock, AlertTriangle, Download, Upload, Trash2, Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"
import type { WorkflowNodeData, SimulationResult, SimulationStep } from "../../types/workflow"
import { simulateWorkflow, validateWorkflow } from "../../lib/mock-api"

interface SandboxPanelProps {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge[]
  onExport: () => string
  onImport: (json: string) => void
  onClear: () => void
}

export function SandboxPanel({ nodes, edges, onExport, onImport, onClear }: SandboxPanelProps) {
  const [isSimulating, setIsSimulating] = useState(false)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [importJson, setImportJson] = useState("")
  const [importDialogOpen, setImportDialogOpen] = useState(false)

  const validation = validateWorkflow(nodes, edges)

  const handleSimulate = async () => {
    setIsSimulating(true)
    setResult(null)
    try {
      const simResult = await simulateWorkflow(nodes, edges)
      setResult(simResult)
    } catch (error) {
      console.error("Simulation failed:", error)
    } finally {
      setIsSimulating(false)
    }
  }

  const handleExport = () => {
    const json = onExport()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "workflow.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    try {
      onImport(importJson)
      setImportDialogOpen(false)
      setImportJson("")
    } catch (error) {
      console.error("Import failed:", error)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900 mb-3">Workflow Sandbox</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSimulate}
            disabled={isSimulating || !validation.isValid}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSimulating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isSimulating ? "Running..." : "Simulate"}
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleExport}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setImportDialogOpen(true)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={onClear}
            className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Import Dialog */}
      {importDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Import Workflow</h3>
            <textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste workflow JSON here..."
              rows={10}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setImportDialogOpen(false)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Validation Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-700">Validation</h4>
          {validation.errors.length > 0 && (
            <div className="space-y-1">
              {validation.errors.map((error, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-rose-600 bg-rose-50 p-2 rounded-md">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}
          {validation.warnings.length > 0 && (
            <div className="space-y-1">
              {validation.warnings.map((warning, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{warning}</span>
                </div>
              ))}
            </div>
          )}
          {validation.isValid && validation.warnings.length === 0 && (
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 p-2 rounded-md">
              <CheckCircle2 className="w-4 h-4" />
              <span>Workflow is valid</span>
            </div>
          )}
        </div>

        {/* Simulation Results */}
        {result && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700">Simulation Result</h4>
            <div
              className={cn(
                "flex items-center gap-2 text-sm p-2 rounded-md",
                result.success ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50",
              )}
            >
              {result.success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              <span>{result.success ? "Simulation completed successfully" : "Simulation failed"}</span>
            </div>

            {result.errors.length > 0 && (
              <div className="space-y-1">
                {result.errors.map((error, i) => (
                  <div key={i} className="text-xs text-rose-600 bg-rose-50 p-2 rounded-md">
                    {error}
                  </div>
                ))}
              </div>
            )}

            {/* Execution Timeline */}
            <div className="space-y-2 mt-4">
              <h5 className="text-xs font-medium text-slate-500 uppercase">Execution Log</h5>
              <div className="space-y-1">
                {result.steps.map((step, index) => (
                  <SimulationStepItem key={index} step={step} index={index} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="space-y-2 pt-4 border-t border-slate-200">
          <h4 className="text-sm font-medium text-slate-700">Statistics</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2 rounded-md">
              <span className="text-slate-500">Total Nodes</span>
              <p className="text-lg font-semibold text-slate-900">{nodes.length}</p>
            </div>
            <div className="bg-slate-50 p-2 rounded-md">
              <span className="text-slate-500">Connections</span>
              <p className="text-lg font-semibold text-slate-900">{edges.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SimulationStepItem({ step, index }: { step: SimulationStep; index: number }) {
  const getStatusIcon = () => {
    switch (step.status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-rose-500" />
      case "in-progress":
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-slate-400" />
    }
  }

  const getTypeColor = () => {
    switch (step.nodeType) {
      case "start":
        return "bg-emerald-100 text-emerald-700"
      case "task":
        return "bg-slate-100 text-slate-700"
      case "approval":
        return "bg-amber-100 text-amber-700"
      case "automated":
        return "bg-violet-100 text-violet-700"
      case "end":
        return "bg-rose-100 text-rose-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="flex items-start gap-2 p-2 bg-white rounded-md border border-slate-100">
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-slate-900 truncate">{step.nodeTitle}</span>
          <span className={cn("text-xs px-1.5 py-0.5 rounded", getTypeColor())}>{step.nodeType}</span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{step.message}</p>
      </div>
    </div>
  )
}
