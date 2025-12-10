
🧩 **HR Workflow Designer — Drag & Drop Workflow Builder**

A React + TypeScript application for visually designing HR process workflows.
Built using React Flow, with fully editable nodes, mock APIs, and an interactive simulation engine.

⭐ **Overview**

This project implements a low-code workflow builder where HR teams can compose onboarding, hiring, or approval workflows using a drag-and-drop interface.
Users can:

Drag nodes from a sidebar onto a canvas

Connect them visually

Configure node details in a form panel

Run a mock simulation to validate the workflow

The project meets the requirements outlined in the assignment PDF.

🚀 **Features**
🎛️ Workflow Canvas

Drag nodes onto a visual graph

Connect nodes with edges

Auto-arranged handles for inputs/outputs

Select nodes to edit their properties

Mini-map, panning, and zoom controls

Basic graph integrity checks during simulation

🧱 **Node Types**

Five node types are supported:

Node Type	Purpose
Start	First node of a workflow; supports metadata
Task	User-performed action; supports description, due date, custom fields
Approval	Requires manager/HR approval; optional threshold
Automated Step	Integrates with mock automation actions; supports dynamic parameters
End	Closing step; supports summary toggle

Each node type has unique fields and validation rules.

📝 **Node Configuration Panel**

When a node is selected:

Node details appear in the right panel

All editable fields update live

Custom key–value pairs can be added or removed

Automated nodes fetch available actions from mock API and render dynamic parameter fields

🧪 **Workflow Simulation Panel**

A bottom testing panel lets users validate workflow logic.

The simulation:

Serializes the current workflow (nodes + edges)

Sends it to a mocked /simulate API

Performs structure validation:

Exactly one Start node

Start node must have no incoming edges

Must contain at least one End node

Detects unreachable nodes or cycles

Produces a step-by-step execution log (BFS traversal)

⚙️ **Mock API Layer**

The app includes a lightweight in-browser mock API:

GET /automations

Returns a set of automation actions, e.g.:
```

[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] }
]
```

POST /simulate

Accepts { nodes, edges } and returns:
```

{
  success: boolean
  log: string[]
  errors?: string[]
}
```


This keeps the project backend-free while matching the API contract expected in a real system.

📁 Project Structure
```
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
```

This layout follows clean separation of concerns:

Canvas logic → WorkflowCanvas.tsx

Node editing logic → NodeFormPanel.tsx

Mock API interactions → mockApi.ts

Shared Types → workflow.ts

UI Panels → Sidebar + TestPanel + Canvas

🛠️ **Installation & Running Locally**
1. Install dependencies
```
npm install
```
2. Start development server
```
npm run dev
```

Your app runs at:
```
http://localhost:5173
```
🎨 **Design Decisions**
1. React Flow for visual workflow editing

React Flow provides an excellent abstraction for:

Node/edge rendering

Drag-and-drop interactions

Selection and connection logic

Extensibility for custom nodes

This reduces boilerplate and increases stability.

2. TypeScript Discriminated Unions

Each node type has strongly typed fields. This ensures:

Form panel renders correct fields

Node logic stays predictable

Simulation receives well-defined structures

3. Local Mock API Instead of HTTP Server

The assignment allows using:

JSON server, MSW, or local mocks.

Local mocks simplify development while still matching the “API contract.”

4. BFS Simulation for Clarity

A breadth-first traversal is easy to understand and gives a clean, ordered execution log.

5. Key–Value Editor Component

To support flexible metadata and custom task fields.

🚧 **What’s Missing / Future Improvements (Honest Section)**

This section is required in the assignment as “What I would add with more time.”

Missing but planned:

Delete nodes and edges through UI or keyboard shortcuts

Live canvas validation while building (not only on simulation)

Stronger required-field validation (e.g., Task title must not be empty)

Visual error markers on problematic nodes

Export/Import workflow as JSON

Undo/Redo stack for canvas operations

Reusable custom hooks for cleaner logic (useWorkflowGraph, useSimulation)

Auto-layout for large workflows

These are not mandatory but would significantly enhance usability.

✅ **Status**

All core requirements of the assignment have been implemented, including:

Node types

Node forms

Drag & drop builder

Mock APIs

Workflow simulation

Validation & logging

Additional improvements are documented for future extensions.
[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] }
]

POST /simulate

Accepts { nodes, edges } and returns:

{
  success: boolean
  log: string[]
  errors?: string[]
}


This keeps the project backend-free while matching the API contract expected in a real system.

