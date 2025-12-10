import type React from "react"
import { memo } from "react"
import { Handle, Position } from "@xyflow/react"
import { Play, CheckSquare, UserCheck, Zap, Flag, MoreVertical } from "lucide-react"
import { cn } from "../../lib/utils"
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
} from "../../types/workflow"

const nodeStyles = {
  start: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconBg: "bg-emerald-500",
    accent: "bg-emerald-500",
  },
  task: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    iconBg: "bg-slate-600",
    accent: "bg-slate-600",
  },
  approval: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconBg: "bg-amber-500",
    accent: "bg-amber-500",
  },
  automated: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    iconBg: "bg-violet-500",
    accent: "bg-violet-500",
  },
  end: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    iconBg: "bg-rose-500",
    accent: "bg-rose-500",
  },
}

function NodeWrapper({
  children,
  type,
  selected,
  hasSource = true,
  hasTarget = true,
}: {
  children: React.ReactNode
  type: keyof typeof nodeStyles
  selected?: boolean
  hasSource?: boolean
  hasTarget?: boolean
}) {
  const styles = nodeStyles[type]

  return (
    <div
      className={cn(
        "relative min-w-[200px] rounded-xl border-2 shadow-sm transition-all",
        styles.bg,
        styles.border,
        selected && "ring-2 ring-blue-500 ring-offset-2",
      )}
    >
      <div className={cn("absolute top-0 left-0 right-0 h-1 rounded-t-xl", styles.accent)} />
      {hasTarget && (
        <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white" />
      )}
      {children}
      {hasSource && (
        <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-slate-400 !border-2 !border-white" />
      )}
    </div>
  )
}

function NodeHeader({
  icon: Icon,
  title,
  subtitle,
  type,
}: {
  icon: React.ElementType
  title: string
  subtitle?: string
  type: keyof typeof nodeStyles
}) {
  const styles = nodeStyles[type]

  return (
    <div className="flex items-start gap-3 p-3">
      <div className={cn("p-2 rounded-lg", styles.iconBg)}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-slate-900 truncate">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
      </div>
      <button className="p-1 hover:bg-black/5 rounded">
        <MoreVertical className="w-4 h-4 text-slate-400" />
      </button>
    </div>
  )
}

function NodeStats({ stats }: { stats: { icon: string; value: number; color: string }[] }) {
  return (
    <div className="flex items-center gap-3 px-3 pb-3 text-xs">
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-1">
          <span>{stat.icon}</span>
          <span className={cn("font-medium", stat.color)}>{stat.value}</span>
        </div>
      ))}
    </div>
  )
}

export const StartNode = memo((props: any) => {
  const { data, selected } = props
  const typedData = data as StartNodeData
  const isSelected = Boolean(selected)
  return (
    <NodeWrapper type="start" selected={isSelected} hasTarget={false}>
      <NodeHeader icon={Play} title={typedData.title || "Start"} subtitle="Workflow Entry Point" type="start" />
      <NodeStats
        stats={[
          { icon: "⏱️", value: 0, color: "text-slate-600" },
          { icon: "✅", value: 0, color: "text-emerald-600" },
        ]}
      />
    </NodeWrapper>
  )
})
StartNode.displayName = "StartNode"

export const TaskNode = memo((props: any) => {
  const { data, selected } = props
  const typedData = data as TaskNodeData
  const isSelected = Boolean(selected)
  return (
    <NodeWrapper type="task" selected={isSelected}>
      <NodeHeader
        icon={CheckSquare}
        title={typedData.title || "Task"}
        subtitle={typedData.assignee ? `Assigned to ${typedData.assignee}` : "Unassigned"}
        type="task"
      />
      <NodeStats
        stats={[
          { icon: "⏱️", value: 11, color: "text-slate-600" },
          { icon: "🔀", value: 27, color: "text-slate-600" },
          { icon: "✅", value: 41, color: "text-emerald-600" },
          { icon: "⚡", value: 72, color: "text-blue-600" },
        ]}
      />
    </NodeWrapper>
  )
})
TaskNode.displayName = "TaskNode"

export const ApprovalNode = memo((props: any) => {
  const { data, selected } = props
  const typedData = data as ApprovalNodeData
  const isSelected = Boolean(selected)
  return (
    <NodeWrapper type="approval" selected={isSelected}>
      <NodeHeader
        icon={UserCheck}
        title={typedData.title || "Approval"}
        subtitle={`Approver: ${typedData.approverRole || "Not Set"}`}
        type="approval"
      />
      <NodeStats
        stats={[
          { icon: "⏱️", value: 91, color: "text-slate-600" },
          { icon: "🔀", value: 18, color: "text-rose-600" },
          { icon: "✅", value: 20, color: "text-emerald-600" },
          { icon: "⚡", value: 21, color: "text-blue-600" },
        ]}
      />
    </NodeWrapper>
  )
})
ApprovalNode.displayName = "ApprovalNode"

export const AutomatedNode = memo((props: any) => {
  const { data, selected } = props
  const typedData = data as AutomatedNodeData
  const isSelected = Boolean(selected)
  return (
    <NodeWrapper type="automated" selected={isSelected}>
      <NodeHeader
        icon={Zap}
        title={typedData.title || "Automated Step"}
        subtitle={typedData.actionId || "No action selected"}
        type="automated"
      />
      <NodeStats
        stats={[
          { icon: "🔀", value: 15, color: "text-slate-600" },
          { icon: "👁️", value: 55, color: "text-slate-600" },
          { icon: "✅", value: 41, color: "text-emerald-600" },
          { icon: "⚡", value: 69, color: "text-blue-600" },
        ]}
      />
    </NodeWrapper>
  )
})
AutomatedNode.displayName = "AutomatedNode"

export const EndNode = memo((props: any) => {
  const { data, selected } = props
  const typedData = data as EndNodeData
  const isSelected = Boolean(selected)
  return (
    <NodeWrapper type="end" selected={isSelected} hasSource={false}>
      <NodeHeader icon={Flag} title="End" subtitle={typedData.endMessage || "Workflow Complete"} type="end" />
      <NodeStats stats={[{ icon: "✅", value: typedData.showSummary ? 1 : 0, color: "text-emerald-600" }]} />
    </NodeWrapper>
  )
})
EndNode.displayName = "EndNode"

export const nodeTypes = {
  startNode: StartNode,
  taskNode: TaskNode,
  approvalNode: ApprovalNode,
  automatedNode: AutomatedNode,
  endNode: EndNode,
}
