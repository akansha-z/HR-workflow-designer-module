"use client"

import type React from "react"
import { useState } from "react"
import {
  LayoutDashboard,
  Shield,
  Calendar,
  BarChart3,
  Puzzle,
  FolderGit2,
  GitBranch,
  Users,
  Inbox,
  MessageSquare,
  Settings,
  HelpCircle,
  ChevronDown,
  PanelLeftClose,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { NodeSidebar } from "./node-sidebar"

interface NavItem {
  icon: React.ElementType
  label: string
  badge?: number
  active?: boolean
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const navigation: NavSection[] = [
  {
    title: "General",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", active: true },
      { icon: Shield, label: "Compliance" },
      { icon: Calendar, label: "Scheduler", badge: 11 },
      { icon: BarChart3, label: "Analytics" },
    ],
  },
  {
    title: "Automation",
    items: [
      { icon: Puzzle, label: "Integrations" },
      { icon: FolderGit2, label: "Repository", badge: 7 },
      { icon: GitBranch, label: "Workflows" },
    ],
  },
  {
    title: "Resources",
    items: [
      { icon: Users, label: "Member" },
      { icon: Inbox, label: "Inbox", badge: 13 },
      { icon: MessageSquare, label: "Messages" },
    ],
  },
]

const bottomNav: NavItem[] = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help & Support" },
]

interface AppSidebarProps {
  className?: string
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function AppSidebar({ className, collapsed: externalCollapsed, onCollapsedChange }: AppSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed
  const setCollapsed = onCollapsedChange || setInternalCollapsed
  const [expandedSections, setExpandedSections] = useState<string[]>(["General", "Automation", "Resources"])

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]))
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-slate-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
          <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-400 rounded-lg flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-slate-900">WorkflowHR</span>}
        </div>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4 text-slate-500" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        {navigation.map((section, idx) => (
          <div key={idx} className="mb-2">
            {section.title && !collapsed && (
              <button
                onClick={() => toggleSection(section.title!)}
                className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:bg-slate-50"
              >
                {section.title}
                <ChevronDown
                  className={cn(
                    "w-4 h-4 transition-transform",
                    !expandedSections.includes(section.title!) && "-rotate-90",
                  )}
                />
              </button>
            )}
            {(collapsed || expandedSections.includes(section.title || "")) && (
              <div className="space-y-0.5 px-2">
                {section.items.map((item) => (
                  <NavButton key={item.label} item={item} collapsed={collapsed} />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Node Types Section */}
        {!collapsed && (
          <div className="border-t border-slate-200 mt-4">
            <NodeSidebar />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-slate-200 p-2 space-y-0.5">
        {bottomNav.map((item) => (
          <NavButton key={item.label} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  )
}

function NavButton({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors",
        item.active ? "bg-rose-50 text-rose-600" : "text-slate-600 hover:bg-slate-100",
      )}
    >
      <item.icon className={cn("w-5 h-5", collapsed && "mx-auto")} />
      {!collapsed && (
        <>
          <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
          {item.badge && (
            <span className="bg-slate-200 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
        </>
      )}
    </button>
  )
}
