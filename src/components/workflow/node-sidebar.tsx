"use client"

import type React from "react"
import type { DragEvent } from "react"
import { Play, CheckSquare, UserCheck, Zap, Flag, GripVertical } from "lucide-react"
import { cn } from "../../lib/utils"
import type { NodeType } from "../../types/workflow"

interface NodeTypeItem {
  type: NodeType
  label: string
  description: string
  icon: React.ElementType
  color: string
}

const nodeTypes: NodeTypeItem[] = [
  {
    type: "start",
    label: "Start Node",
    description: "Workflow entry point",
    icon: Play,
    color: "bg-emerald-500",
  },
  {
    type: "task",
    label: "Task Node",
    description: "Human task assignment",
    icon: CheckSquare,
    color: "bg-slate-600",
  },
  {
    type: "approval",
    label: "Approval Node",
    description: "Manager approval step",
    icon: UserCheck,
    color: "bg-amber-500",
  },
  {
    type: "automated",
    label: "Automated Step",
    description: "System-triggered action",
    icon: Zap,
    color: "bg-violet-500",
  },
  {
    type: "end",
    label: "End Node",
    description: "Workflow completion",
    icon: Flag,
    color: "bg-rose-500",
  },
]

interface NodeSidebarProps {
  className?: string
}

export function NodeSidebar({ className }: NodeSidebarProps) {
  const onDragStart = (event: DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div className={cn("p-4", className)}>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Node Types</h3>
      <div className="space-y-2">
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-grab hover:border-slate-300 hover:shadow-sm transition-all active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4 text-slate-300" />
            <div className={cn("p-2 rounded-lg", node.color)}>
              <node.icon className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{node.label}</p>
              <p className="text-xs text-slate-500 truncate">{node.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
