# HR-workflow-designer-module
A React + TypeScript application that allows users to visually design HR workflows using a low-code, drag-and-drop interface.
Includes a node editor, mock API layer, and workflow simulation engine.

✨ Features
🎛️ Visual Workflow Canvas

Drag nodes from a sidebar onto a canvas

Connect nodes with edges

Select and edit node configuration

Zoom, pan, and use mini-map

Basic structure validation during simulation

🧱 Node Types

The builder supports five configurable node types:

Node Type	Includes
Start	Title, metadata key–values
Task	Title, description, assignee, due date, custom fields
Approval	Approver role, threshold
Automated Step	Automation action + dynamic parameters
End	End message + summary toggle

Each node has its own styling and form fields.

📝 Node Configuration Panel

When a node is selected, a right-side panel appears:

Edit all node-specific fields

Add/remove key–value pairs (metadata/custom fields)

For automated steps, available actions are loaded from mock API and parameter fields are generated dynamically

🧪 Workflow Simulation Panel

A bottom testing panel lets users simulate the entire workflow.

The simulation performs:

✔️ Exactly one Start node
✔️ Start has no incoming edges
✔️ At least one End node
✔️ BFS execution order logging
✔️ Detection of unreachable segments or cycles

Output includes:

Step-by-step execution log

Validation errors (if present)

⚙️ Mock API Layer
GET /automations

Returns a list of available automation actions:

[
  { "id": "send_email", "label": "Send Email", "params": ["to", "subject"] },
  { "id": "generate_doc", "label": "Generate Document", "params": ["template", "recipient"] }
]

POST /simulate

Receives workflow graph { nodes, edges } and returns execution results:

{
  success: boolean;
  log: string[];
  errors?: string[];
}


Implements workflow traversal and structural validation.

📁 Project Structure
src/
  api/
    mockApi.ts
  components/
    Sidebar.tsx
    WorkflowCanvas.tsx
    WorkflowTestPanel.tsx
    nodes/
      NodeBase.tsx
    forms/
      NodeFormPanel.tsx
  types/
    workflow.ts
  App.tsx
  main.tsx
  App.css
  index.css


The structure emphasizes clean separation of logic:

Canvas behavior → WorkflowCanvas

Node UI & logic → NodeBase, NodeFormPanel

API logic → mockApi

Shared modeling → workflow.ts

🛠️ Installation & Running
1. Clone repo
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>

2. Install dependencies
npm install

3. Start development server
npm run dev


The app will be available at:

👉 http://localhost:5173

🎨 Design Decisions
1. React Flow for workflow visualization

Provides robust primitives for nodes, edges, selection, and layout.

2. TypeScript unions for node data

Ensures predictable rendering and form behavior.

3. Mock API instead of real backend

Spec allows JSON mocks, MSW, or local mocks → simplest to maintain.

4. BFS-based simulation

Easy to implement, easy to understand, and produces stable logs.

5. Key–value editor for metadata/custom fields

Gives flexibility without complex schema handling.

🚧 What Could Be Improved (Future Enhancements)

These improvements are either optional or left intentionally incomplete based on assignment expectations:

❌ Delete nodes/edges (UI or keyboard-based)

❌ Live validation while building (not only dur
