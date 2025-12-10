import { Undo2, Redo2, Save, ChevronDown, Play, Clock, PanelLeft } from "lucide-react"

interface WorkflowHeaderProps {
  workflowName?: string
  onSave?: () => void
  onToggleSidebar?: () => void
  sidebarCollapsed?: boolean
}

export function WorkflowHeader({ workflowName = "User Automation", onToggleSidebar, sidebarCollapsed }: WorkflowHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {sidebarCollapsed && (
            <button
              onClick={onToggleSidebar}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Open sidebar"
            >
              <PanelLeft className="w-4 h-4 text-slate-500" />
            </button>
          )}
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Undo2 className="w-4 h-4 text-slate-500" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Redo2 className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-100 rounded-md">
          <span className="font-semibold text-slate-900">{workflowName}</span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </button>
        <p className="text-sm text-slate-500">Overview of User Workflows.</p>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Save className="w-4 h-4 text-slate-500" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Play className="w-4 h-4 text-slate-500" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Clock className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  )
}
