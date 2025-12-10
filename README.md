🧩 HR WORKFLOW DESIGNER
DRAG-AND-DROP VISUAL WORKFLOW BUILDER FOR HR PROCESSES








A React + TypeScript application that allows users to visually design HR workflows using a low-code canvas editor. It includes multiple node types, editable node configuration panels, a mock API layer, and a workflow simulation engine.

🧠 FEATURES
🎛️ VISUAL WORKFLOW CANVAS

Drag nodes from a sidebar

Drop onto a dynamic graph canvas

Create connections between nodes

Select nodes to edit properties

Mini-map, zoom, and panning enabled

Automatic validation during simulation

🧱 SUPPORTED NODE TYPES
Node Type	Capabilities
START	Title + metadata key-value pairs
TASK	Title, description, assignee, due date, custom fields
APPROVAL	Approver role, auto-approve threshold
AUTOMATED	Select automation action + dynamic parameters
END	End message + summary toggle

All nodes have unique styling, labels, and handle positions.

📝 NODE CONFIGURATION PANEL

When a node is selected:

Editable form appears on the right

All fields update the workflow in real time

Add/remove dynamic key-value pairs

Automated nodes fetch supported actions from mock API

Parameter fields display dynamically

🧪 WORKFLOW SIMULATION PANEL

Allows validating workflow logic via a mock /simulate API.

✔️ Simulation checks:

Exactly one Start node

Start node must have no incoming edges

At least one End node

Detects unreachable segments or cycles

Returns a step-by-step BFS execution log

Validation errors + logs are displayed clearly for debugging.

⚙️ MOCK API LAYER
GET /automations

Returns automation actions:

[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] }
]

POST /simulate

Accepts the workflow graph:

{
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}


Returns:

{
  success: boolean;
  log: string[];
  errors?: string[];
}

🏗️ ARCHITECTURE
src/
│
├── api/
│   └── mockApi.ts        → Mock GET/POST endpoints
│
├── components/
│   ├── Sidebar.tsx       → Node type list + drag source
│   ├── WorkflowCanvas.tsx → React Flow canvas logic
│   ├── WorkflowTestPanel.tsx → Simulation runner UI
│   │
│   ├── nodes/
│   │   └── NodeBase.tsx  → Base renderer for all node types
│   │
│   └── forms/
│       └── NodeFormPanel.tsx → Dynamic form for node configuration
│
├── types/
│   └── workflow.ts       → Types for all node structures + graph
│
├── App.tsx               → Main layout (Sidebar + Canvas + Form + TestPanel)
├── main.tsx              → React entry point
├── App.css               → Layout styles
└── index.css             → Global styles

✔️ Separation of concerns:

Canvas logic → WorkflowCanvas

Node rendering logic → NodeBase

Node editing logic → NodeFormPanel

API interactions → mockApi

Shared types → workflow.ts

🛠️ INSTALLATION & RUNNING
1. Clone the repository
git clone https://github.com/<your-username>/<your-repository>.git
cd <your-repository>

2. Install dependencies
npm install

3. Start development server
npm run dev


App runs at:

👉 http://localhost:5173

🎨 DESIGN DECISIONS
1. React Flow for Visual Editing

Handles nodes, edges, dragging, selecting, graph updates.

2. TypeScript Discriminated Unions

Ensures correct typing for each node type.

3. Simple Mock API Layer

Spec allows JSON mocks → no backend needed.

4. BFS Workflow Simulation

Produces clear, understandable logs.

5. Key–Value Field Editor

Allows flexible metadata and custom fields.

🚧 LIMITATIONS / FUTURE IMPROVEMENTS

These are intentional gaps due to assignment scope:

Delete node/edge functionality

Real-time validation on canvas (not only on simulation)

Required field validation (e.g., Task title must not be empty)

Visual indicators on invalid nodes

Export/import workflow as JSON

Undo/Redo for canvas actions

Auto-layout for large workflows

More reusable hooks for cleaner architecture

🤝 CONTRIBUTING

Pull requests and suggestions are welcome!
Open an issue before making large changes.

📜 LICENSE

MIT License © 2025
