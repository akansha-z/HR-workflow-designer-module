# HR Workflow Designer

A modern, interactive workflow designer application built with React, TypeScript, and Vite. This application allows users to create, configure, and simulate HR workflows using a visual drag-and-drop interface.

## 🚀 Features

- **Visual Workflow Designer**: Drag-and-drop interface for creating workflows
- **Multiple Node Types**: Support for Start, Task, Approval, Automated, and End nodes
- **Node Configuration**: Detailed configuration panels for each node type
- **Workflow Simulation**: Sandbox mode to test and simulate workflows
- **Export/Import**: Save and load workflows as JSON
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **Type-Safe**: Full TypeScript support for better development experience

## 🛠️ Tech Stack

- **Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.2
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS v4
- **Workflow Engine**: React Flow (@xyflow/react)
- **Icons**: Lucide React
- **State Management**: React Hooks

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 20.19.0 or higher (or 22.12.0+)
- **npm**: Version 10.2.3 or higher
- A modern web browser (Chrome, Firefox, Safari, or Edge)

## 🏗️ Installation

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd Hr-workflow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## 📁 Project Structure

```
Hr-workflow/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── switch.tsx
│   │   │   └── textarea.tsx
│   │   └── workflow/        # Workflow-specific components
│   │       ├── app-sidebar.tsx      # Left sidebar with node palette
│   │       ├── custom-nodes.tsx     # Custom node components
│   │       ├── node-config-panel.tsx # Node configuration panel
│   │       ├── node-sidebar.tsx     # Node details sidebar
│   │       ├── right-panel.tsx      # Right panel for workflow info
│   │       ├── sandbox-panel.tsx    # Workflow simulation panel
│   │       ├── workflow-canvas.tsx   # Main workflow canvas
│   │       └── workflow-header.tsx  # Header with actions
│   ├── hooks/
│   │   └── use-workflow.ts   # Main workflow state management hook
│   ├── lib/
│   │   ├── mock-api.ts       # Mock API for automations and simulations
│   │   └── utils.ts          # Utility functions (cn helper)
│   ├── types/
│   │   └── workflow.ts       # TypeScript type definitions
│   ├── App.tsx               # Main application component
│   ├── index.css             # Global styles and Tailwind imports
│   └── main.tsx              # Application entry point
├── components.json           # shadcn/ui configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies and scripts
```

## 🎯 Usage

### Creating a Workflow

1. **Add Nodes**: Drag nodes from the left sidebar onto the canvas
2. **Connect Nodes**: Click and drag from a node's output handle to another node's input handle
3. **Configure Nodes**: Click on a node to open the configuration panel
4. **Save Workflow**: Use the export button to save your workflow as JSON

### Node Types

- **Start Node**: Entry point of the workflow
- **Task Node**: Manual task with assignee and due date
- **Approval Node**: Requires approval from specified role
- **Automated Node**: Automated action execution
- **End Node**: Workflow completion point

### Workflow Simulation

1. Click the "Sandbox" button in the header
2. Configure simulation parameters
3. Run the simulation to see step-by-step execution
4. View execution logs and results

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## ⚙️ Configuration

### Tailwind CSS

The project uses Tailwind CSS v4 with the Vite plugin. Configuration is primarily done through CSS variables in `src/index.css`.

### shadcn/ui

Components are configured via `components.json`. To add more components:

```bash
npx shadcn@latest add [component-name]
```

### TypeScript

Type definitions for workflow nodes and data are in `src/types/workflow.ts`. The project uses strict TypeScript settings for type safety.

## 🔧 Development

### Adding New Node Types

1. Define the node data type in `src/types/workflow.ts`
2. Create the node component in `src/components/workflow/custom-nodes.tsx`
3. Add configuration form in `src/components/workflow/node-config-panel.tsx`
4. Register the node type in `src/hooks/use-workflow.ts`

### Styling

- Use Tailwind CSS utility classes for styling
- Custom CSS variables are defined in `src/index.css`
- shadcn/ui components follow the design system defined in `components.json`

## 🐛 Troubleshooting

### Common Issues

1. **PostCSS/Tailwind Errors**: Ensure you're using Node.js 20.19.0+ or 22.12.0+
2. **Import Alias Errors**: Verify `@/*` alias is configured in `tsconfig.json` and `vite.config.ts`
3. **Type Errors**: Run `npm run build` to check for TypeScript errors

### Clearing Cache

If you encounter build issues:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 🏛️ Architecture

### Component Hierarchy

The application follows a component-based architecture with clear separation of concerns:

```
App (Root)
├── ReactFlowProvider
└── WorkflowDesigner
    ├── AppSidebar (Left)
    │   ├── Navigation Items
    │   └── NodeSidebar (Node Palette)
    ├── Main Content Area
    │   ├── WorkflowHeader (Top)
    │   └── WorkflowCanvas (Center)
    │       └── Custom Node Components
    └── RightPanel
        ├── NodeConfigPanel
        ├── SandboxPanel
        └── Insights Panel
```

### State Management

- **Local Component State**: React `useState` for UI state (sidebar collapse, tab selection)
- **Workflow State**: Custom `useWorkflow` hook managing nodes, edges, and selected node
- **React Flow State**: `useNodesState` and `useEdgesState` for canvas state management
- **State Flow**: Unidirectional data flow from parent to child components via props

### Data Flow

1. **User Interactions** → Component event handlers
2. **State Updates** → `useWorkflow` hook methods
3. **React Flow Updates** → Canvas re-renders automatically
4. **UI Updates** → Components re-render based on state changes

### Key Architectural Patterns

- **Custom Hooks Pattern**: `useWorkflow` encapsulates all workflow logic
- **Compound Components**: Panel system with tabs and content switching
- **Render Props Pattern**: Node components receive props from React Flow
- **Controlled Components**: Form inputs controlled by parent state

## 🎨 Design Decisions

### 1. Technology Choices

**React Flow (@xyflow/react)**
- Chosen for its robust workflow visualization capabilities
- Built-in support for drag-and-drop, node connections, and canvas interactions
- TypeScript support aligns with project requirements
- Active maintenance and community support

**Tailwind CSS v4**
- Utility-first CSS for rapid UI development
- Consistent design system with minimal custom CSS
- Built-in dark mode support (prepared but not fully implemented)
- Better performance with JIT compilation

**shadcn/ui Components**
- Copy-paste component library (not a dependency)
- Built on Radix UI for accessibility
- Fully customizable with Tailwind CSS
- Type-safe with TypeScript

### 2. Component Design

**Separation of Concerns**
- UI components (`custom-nodes.tsx`) separate from logic (`use-workflow.ts`)
- Configuration panels isolated in their own components
- Reusable utilities in `lib/` directory

**Type Safety**
- Comprehensive TypeScript types for all node data
- Union types for different node variants
- Index signatures for React Flow compatibility

**Performance Optimizations**
- `React.memo` for node components to prevent unnecessary re-renders
- `useCallback` for event handlers to maintain referential equality
- Lazy loading capabilities (prepared but not implemented)

### 3. User Experience Decisions

**Collapsible Sidebar**
- Provides more canvas space when needed
- Toggle button in header when collapsed for easy access
- Maintains navigation access even when collapsed

**Drag-and-Drop Interface**
- Intuitive node creation directly on canvas
- Visual feedback with node highlighting
- Connection handles for clear node relationships

**Contextual Panels**
- Right panel adapts based on selection (node config vs. workflow info)
- Tab-based navigation for multiple panel functions
- Persistent state during panel switching

### 4. Code Organization

**File Structure**
- Feature-based component organization
- Shared utilities in `lib/`
- Type definitions centralized in `types/`
- UI components separated from workflow components

**Naming Conventions**
- PascalCase for components
- camelCase for functions and variables
- Descriptive names for clarity

### 5. Styling Approach

**Tailwind Utility Classes**
- Inline utilities for rapid development
- Consistent spacing and color system
- Responsive design utilities (prepared for future)

**CSS Variables**
- Theme customization via CSS variables
- Easy dark mode implementation
- Consistent color palette across components

## ✅ Completed Features

### Core Functionality

1. **Workflow Canvas**
   - Drag-and-drop node creation
   - Node connections with visual edges
   - Node selection and highlighting
   - Canvas pan and zoom controls
   - Grid background for alignment

2. **Node Types**
   - Start Node with metadata configuration
   - Task Node with assignee and due date
   - Approval Node with approver role selection
   - Automated Node with action configuration
   - End Node with completion message

3. **Node Configuration**
   - Dynamic configuration panels per node type
   - Form validation and data persistence
   - Real-time updates on canvas
   - Node deletion with edge cleanup

4. **Workflow Management**
   - Export workflows as JSON
   - Import workflows from JSON
   - Clear canvas functionality
   - Node ID generation and tracking

5. **UI Components**
   - Collapsible sidebar with navigation
   - Right panel with tab navigation
   - Workflow header with actions
   - Responsive layout structure

6. **Visual Design**
   - Color-coded node types
   - Icon-based node representation
   - Smooth animations for connections
   - Modern, clean interface

### Technical Implementation

- TypeScript type safety throughout
- Custom React hooks for state management
- Component memoization for performance
- Tailwind CSS styling system
- shadcn/ui component integration
- React Flow integration and customization

## 🚧 Future Enhancements

### Planned Features (With More Time)

1. **Workflow Execution**
   - Real workflow engine integration
   - Task assignment and tracking
   - Approval workflow execution
   - Automated action execution
   - Status tracking and notifications

2. **Advanced Node Features**
   - Conditional branching nodes
   - Parallel execution paths
   - Sub-workflow nodes
   - Timer/delay nodes
   - Data transformation nodes

3. **Workflow Validation**
   - Validation rules engine
   - Workflow completeness checks
   - Circular dependency detection
   - Required field validation
   - Workflow testing framework

4. **Enhanced UI/UX**
   - Undo/Redo functionality
   - Keyboard shortcuts
   - Node templates library
   - Workflow templates
   - Drag-and-drop from sidebar

5. **Collaboration Features**
   - Multi-user editing
   - Workflow versioning
   - Change history and audit logs
   - Comments and annotations
   - Workflow sharing

6. **Performance Improvements**
   - Virtualized canvas for large workflows
   - Lazy loading of components
   - Optimized re-rendering
   - Canvas performance monitoring

7. **Backend Integration**
   - REST API integration
   - Database persistence
   - User authentication
   - Role-based access control
   - Workflow deployment system

8. **Analytics & Insights**
   - Workflow execution metrics
   - Performance analytics
   - Usage statistics
   - Bottleneck identification
   - Execution history dashboard

9. **Accessibility**
   - Full keyboard navigation
   - Screen reader support
   - ARIA labels and roles
   - High contrast mode
   - Focus management

10. **Testing**
    - Unit tests for hooks and utilities
    - Component tests
    - Integration tests
    - E2E tests with Playwright/Cypress
    - Visual regression tests

### Technical Debt to Address

- **Type Safety Improvements**: Better handling of React Flow's type constraints
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Loading States**: Skeleton loaders and loading indicators
- **Responsive Design**: Mobile and tablet layout optimizations
- **Code Splitting**: Lazy loading of heavy components
- **Documentation**: Inline code documentation and API docs

## 📝 License

This project is private and intended for assignment purposes.

## 👥 Contributing

This is a HR-Workflow Designer Module project. For questions or issues, please contact the project maintainer.

---

**Built with ❤️ using React, TypeScript, and Vite**
