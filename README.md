# 📦 Shelf OS — Final Inventory Prototype

> A fully functional React prototype for an Inventory Management System built from Figma wireframes. No backend, no API — pure React state management with real interactive behavior.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Getting Started — Step by Step](#4-getting-started--step-by-step)
5. [Architecture & Design Decisions](#5-architecture--design-decisions)
6. [State Management — Deep Dive](#6-state-management--deep-dive)
7. [Component Breakdown](#7-component-breakdown)
8. [Data Models](#8-data-models)
9. [Screen-by-Screen Guide](#9-screen-by-screen-guide)
10. [CRUD Operations — How They Work](#10-crud-operations--how-they-work)
11. [Navigation Flow](#11-navigation-flow)
12. [Styling System](#12-styling-system)
13. [Key React Patterns Used](#13-key-react-patterns-used)
14. [Build & Deployment](#14-build--deployment)
15. [Extending the Project](#15-extending-the-project)

---

## 1. Project Overview

**Shelf OS** is a retail inventory management tool. This prototype replicates 3 Figma wireframe screens as a fully interactive React application:

| Wireframe | Screen Name | Tab |
|-----------|-------------|-----|
| #85 | Final Inventory | All Items |
| #76 | Item Sent for Approval | Items sent for approval |
| #98 | Item Added by You | Items added by you |

### What Works
- ✅ View all inventory products and their batches
- ✅ Add new products via modal form
- ✅ Edit any batch — updates UI instantly
- ✅ Delete any batch — removed from UI immediately
- ✅ Switch between 3 tabs with different data views
- ✅ Search/filter products by name
- ✅ Sidebar navigation with expand/collapse
- ✅ Store active/inactive toggle
- ✅ Approval status badges (Approved / Pending / Rejected)
- ✅ View more / View less batch toggle per product

---

## 2. Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.2.0 | UI framework |
| Vite | 5.2.0 | Dev server + build tool |
| JavaScript (JSX) | ES2022 | Language |
| Inline CSS / Style Objects | — | Styling (no CSS-in-JS lib needed) |
| React useState | Built-in | All state management |

> **No external UI libraries** — zero dependencies beyond React itself. All components are hand-built to match the Figma design pixel-accurately.

---

## 3. Project Structure

```
shelf-inventory/
├── index.html                  ← Entry HTML (mounts React to #root)
├── vite.config.js              ← Vite config with React plugin
├── package.json                ← Dependencies & scripts
├── vercel.json                 ← Vercel deployment config
├── .gitignore                  ← Git ignore rules
└── src/
    ├── main.jsx                ← ReactDOM.render entry point
    └── ShelfInventory.jsx      ← ENTIRE application (single file)
```

### Why a Single File?
This is a **prototype**, not a production app. Keeping everything in one file:
- Makes it easy to share and review
- No import path confusion
- Faster iteration during design review
- Easy to split into modules later

---

## 4. Getting Started — Step by Step

### Step 1 — Clone / Download the project

```bash
git clone <your-repo-url>
cd shelf-inventory
```

### Step 2 — Install dependencies

```bash
npm install
```

This installs:
- `react` + `react-dom` — core UI
- `vite` + `@vitejs/plugin-react` — dev tooling

### Step 3 — Create the entry point

Create `src/main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './ShelfInventory.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### Step 4 — Start development server

```bash
npm run dev
```

Opens at: **http://localhost:5173**

### Step 5 — Build for production

```bash
npm run build
```

Output goes to `/dist` folder — ready to deploy.

### Step 6 — Preview production build locally

```bash
npm run preview
```

Runs built output at: **http://localhost:4173**

---

## 5. Architecture & Design Decisions

### Single Source of Truth

All state lives in the **root `App` component** and flows **down** via props:

```
App (owns all state)
 ├── products[]         → passed to ProductCard
 ├── approvalItems[]    → passed to ProductCard (approval tab)
 ├── activeTab          → controls which screen renders
 ├── editModal          → controls EditModal visibility
 └── showAddModal       → controls AddProductModal visibility
```

### Why No Redux / Context?

The app has **2 levels of component depth** maximum. Prop drilling is clean and traceable. Adding Redux would be over-engineering for a prototype.

### Why No Router?

Navigation is tab-based within one page. React Router adds bundle size and complexity. A simple `activeTab` state string is sufficient.

### Why Inline Styles?

- **Zero configuration** — no CSS modules setup, no class name conflicts
- **Co-located with logic** — easy to understand component appearance at a glance
- **Design tokens** centralized in the `C` (colors) and `s` (styles) objects

---

## 6. State Management — Deep Dive

### All State Variables in `App`

```jsx
// Navigation
const [activeNav, setActiveNav] = useState("my-inventory");
// Which of the 3 main tabs is active
const [activeTab, setActiveTab] = useState("all");

// Data
const [products, setProducts] = useState(INIT_PRODUCTS);
const [approvalItems, setApprovalItems] = useState(INIT_APPROVAL);

// UI state
const [search, setSearch] = useState("");          // TopBar search
const [productSearch, setProductSearch] = useState(""); // Product filter
const [storeActive, setStoreActive] = useState(false);
const [editModal, setEditModal] = useState(null);  // null = closed, object = open
const [showAddModal, setShowAddModal] = useState(false);

// Added-by-you tab
const [addedByYouSubTab, setAddedByYouSubTab] = useState("inventory");
const [showPackaged, setShowPackaged] = useState(true);
const [promotions] = useState(3);
```

### State Flow Diagram

```
User clicks "Edit" on a batch
        ↓
BatchRow calls onEdit(productId, batchId, batch)
        ↓
App.openEdit() → setEditModal({ productId, batchId, batch, isRice })
        ↓
EditModal renders (because editModal !== null)
        ↓
User edits fields & clicks "Save"
        ↓
EditModal calls onSave(productId, batchId, updatedBatch)
        ↓
App.editBatch() → setProducts(immutable map update)
        ↓
React re-renders → UI updates instantly
        ↓
setEditModal(null) → Modal closes
```

---

## 7. Component Breakdown

### `App` — Root Component
- Owns **all state**
- Contains all CRUD handler functions
- Renders `Sidebar`, `TopBar`, and tab content
- Conditionally renders modals

### `Sidebar`
- **Props:** `activeNav`, `setActiveNav`
- Local state: `expanded` object for accordion items
- Renders the left navigation with expand/collapse sections
- Highlights active nav item

### `TopBar`
- **Props:** `search`, `setSearch`, `storeActive`, `setStoreActive`
- Shows store title, global search, toggle switch, user avatar
- Toggle switch is fully functional with CSS animation

### `ProductCard`
- **Props:** `product`, `onDeleteBatch`, `onEditBatch`, `showStatus`, `showAddedByYou`
- Local state: `expanded` (View more/less toggle)
- Renders product header + batch table
- Conditionally shows status column (approval tab) or badges column (other tabs)

### `BatchRow`
- **Props:** `batch`, `isRice`, `productId`, `onDelete`, `onEdit`, `showStatus`, etc.
- One row in the batch table
- Calls `onDelete` / `onEdit` with the batch's IDs

### `EditModal`
- **Props:** `editData`, `onSave`, `onClose`
- Local state: `form` object (copy of batch being edited)
- Pre-fills all fields from existing batch data
- Supports both regular product fields and rice (kg-based) fields
- Calls `onSave` with updated form data

### `AddProductModal`
- **Props:** `onSave`, `onClose`
- Local state: `form` (blank product form)
- Validates product name before saving
- Generates a new product with a default empty batch

### Utility Components

| Component | Purpose |
|-----------|---------|
| `Badge` | Colored pill badge (Added by you, Pending, Approved, etc.) |
| `Btn` | Multi-variant button (primary, outline, danger, ghost, etc.) |
| `Input` | Styled text input with consistent look |
| `Modal` | Overlay modal shell with title and close button |

---

## 8. Data Models

### Product Object

```js
{
  id: "p1",                    // Unique ID
  name: "Pears Original Soap", // Display name
  category: "Nonwoven",        // Product category
  hsn: "19523010",             // HSN tax code
  gst: "18%",                  // GST percentage
  isPackaged: true,            // Packaged Item vs Loose
  isRice: false,               // Changes table columns (weight vs kg)
  batches: [ BatchObject ],    // Array of batch entries
  totalQty: "650",             // Aggregated quantity string
}
```

### Batch Object (Regular Product)

```js
{
  id: "b1",
  upc: "1234567890",     // Barcode
  batch: "-",            // Batch number
  price: "20,000",       // MRP price
  weight: "200g",        // Weight/pack info
  offlinePrice: "200",   // Selling price offline
  qty: 800,              // Quantity
  channel: "Offline",    // Sales channel
  addedByYou: true,      // Whether current user added it
  approval: "pending",   // null | "pending"
  hnc: false,            // HNC badge flag
  pack4: true,           // "Also sent in pack(4)" flag
}
```

### Batch Object (Rice / Bulk Product)

```js
{
  id: "r1",
  upc: "1234567890",
  batch: "-",
  sellingPrice: "200",   // Price per kg
  qtyKg: 800,            // Quantity in kg
  channel: "Offline",
  addedByYou: true,
  approval: null,
}
```

### Approval Item Object

```js
{
  id: "ap1",
  name: "Pears Original Soap",
  approvalStatus: "rejected",       // "rejected" | "pending" | "approved"
  rejectionReason: "Rejected due to XYZ.",  // null if not rejected
  batches: [ BatchObject ],
  totalQty: "650",
  // ... same product fields
}
```

### UID Generator

```js
let _id = 1;
const uid = () => `id_${_id++}`;
// Generates: "id_1", "id_2", "id_3" ...
// Simple auto-increment for new records in-session
```

---

## 9. Screen-by-Screen Guide

### Screen 1 — All Items (Tab: "All Items")

**What it shows:**
- All products from `products` state
- Each product shows all its batches in a table
- Badges: "Added by you" + "Approval pending" for relevant batches
- HNC badge for HNC-flagged batches
- "View more / View less" for products with >2 batches
- Total Quantity at bottom of each product card

**Key interactions:**
- `+ Add new product` → opens `AddProductModal`
- `✏️ Edit` on any batch → opens `EditModal` pre-filled
- `🗑️` on any batch → immediately removes that batch
- Search box → filters products by name in real-time

---

### Screen 2 — Items Sent for Approval (Tab: "Items sent for approval")

**What it shows:**
- Products from `approvalItems` state (separate data)
- Extra "Status" column in batch table
- Status badges per approval state:
  - 🔴 **Rejected** — red badge + "View details" link + red banner with rejection reason
  - 🟡 **Pending** — amber badge "Pending quantity..."
  - 🟢 **Approved** — green badge

**Key interactions:**
- `✏️ Edit` → calls `editApprovalBatch` (updates `approvalItems` state, not `products`)
- `🗑️` → calls `deleteApprovalBatch`

---

### Screen 3 — Items Added By You (Tab: "Items added by you")

**What it shows:**
- Filtered view: only batches where `addedByYou === true`
- Extra checkbox: "Packaged products" filter
- Promotions count
- Sub-tabs: "Items present in the inventory" | "Drafts"
- Drafts sub-tab shows empty state

**How filtering works:**

```js
const addedByYouProducts = filteredProducts
  .map(p => ({
    ...p,
    batches: p.batches.filter(b => b.addedByYou)  // only your batches
  }))
  .filter(p => p.batches.length > 0);             // hide products with no "yours" batches
```

---

## 10. CRUD Operations — How They Work

### ➕ ADD Product

```
User clicks "+ Add new product"
  → setShowAddModal(true)
  → AddProductModal renders
  → User fills: name, category, HSN, GST, type
  → Click "Add Product"
  → addProduct() runs:

const addProduct = (newProduct) => {
  setProducts(ps => [...ps, newProduct]);  // append to array
  setShowAddModal(false);                   // close modal
};
```

New product gets a default batch with `addedByYou: true`.

---

### ✏️ EDIT Batch

```
User clicks "✏️ Edit" on a batch row
  → openEdit(productId, batchId, batch, isRice)
  → setEditModal({ productId, batchId, batch, isRice })
  → EditModal renders with form pre-filled from batch data
  → User changes fields
  → Click "Save Changes"
  → editBatch() runs:

const editBatch = (productId, batchId, updated) => {
  setProducts(ps =>
    ps.map(p =>
      p.id === productId
        ? {
            ...p,
            batches: p.batches.map(b =>
              b.id === batchId ? updated : b   // replace matching batch
            ),
            totalQty: calculateTotalQty(...)   // recalculate total
          }
        : p
    )
  );
  setEditModal(null);  // close modal
};
```

**Pattern:** Nested `map()` — find the product, then find the batch, replace it, keep everything else unchanged.

---

### 🗑️ DELETE Batch

```
User clicks "🗑️" on a batch row
  → deleteBatch(productId, batchId) runs:

const deleteBatch = (productId, batchId) => {
  setProducts(ps =>
    ps.map(p =>
      p.id === productId
        ? { ...p, batches: p.batches.filter(b => b.id !== batchId) }
        : p
    )
  );
};
```

**Pattern:** `filter()` removes the batch. No confirmation dialog (prototype behavior).

---

### 🔍 SEARCH (Filter)

```js
const filteredProducts = products.filter(p =>
  !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase())
);
```

Runs on every render — no debounce needed at prototype scale.

---

## 11. Navigation Flow

```
Sidebar Nav Item Click
  → setActiveNav(id)
  → If "my-inventory" → shows inventory content
  → Any other nav → shows "🚧 Under Construction" screen

Tab Bar Click (inside my-inventory)
  → setActiveTab("all" | "added" | "approval")
  → Conditional render switches the content

Sub-Tab Click (inside "added" tab)
  → setAddedByYouSubTab("inventory" | "drafts")
  → "drafts" shows empty state
```

### Sidebar Accordion

```js
const [expanded, setExpanded] = useState({
  inventory: true,
  "online-store": true
});

// Toggle on click:
setExpanded(e => ({ ...e, [item.id]: !e[item.id] }))
```

---

## 12. Styling System

### Design Token Object `C`

```js
const C = {
  sidebarBg: "#0e1e4b",   // Dark navy sidebar
  blue: "#1a55fb",         // Primary CTA blue
  orange: "#f59e0b",       // Packaged item accent
  red: "#ef4444",          // Delete / Rejected
  green: "#22c55e",        // Approved / Added
  navy: "#0f1f48",         // Heading text
  border: "#e5e7eb",       // All borders
  badge: {
    addedByYou: { bg: "#dbeafe", text: "#1d4ed8", dot: "#22c55e" },
    pending:    { bg: "#fef3c7", text: "#b45309", dot: "#f59e0b" },
    rejected:   { bg: "#fee2e2", text: "#b91c1c", dot: "#ef4444" },
    approved:   { bg: "#dcfce7", text: "#15803d", dot: "#22c55e" },
  }
}
```

### Layout Object `s`

```js
const s = {
  app:      { display: "flex", height: "100vh", overflow: "hidden" },
  sidebar:  { width: 210, background: C.sidebarBg, ... },
  main:     { flex: 1, display: "flex", flexDirection: "column" },
  purpleBar:{ height: 4, background: "linear-gradient(...)" },
  content:  { flex: 1, overflowY: "auto", padding: "16px 20px" },
}
```

### The Purple Gradient Bar

```js
background: "linear-gradient(90deg, #7c3aed 0%, #ec4899 60%, #f59e0b 100%)"
```

This 4px decorative bar at the top matches the Figma brand accent exactly.

---

## 13. Key React Patterns Used

### 1. Lifting State Up
State lives in `App`, child components receive handlers as props. Children never mutate data directly.

### 2. Controlled Inputs
Every input is controlled:
```jsx
<input value={form.upc} onChange={e => set("upc", e.target.value)} />
```

### 3. Immutable State Updates
Never `push()` or mutate arrays directly:
```js
// ✅ Correct
setProducts(ps => [...ps, newProduct])

// ❌ Wrong
products.push(newProduct)
setProducts(products)
```

### 4. Conditional Rendering
```jsx
{activeTab === "all" && <AllItems />}
{activeTab === "approval" && <ApprovalItems />}
{editModal && <EditModal />}
```

### 5. Derived State
`addedByYouProducts` is computed from `filteredProducts` — not stored separately:
```js
const addedByYouProducts = filteredProducts
  .map(p => ({ ...p, batches: p.batches.filter(b => b.addedByYou) }))
  .filter(p => p.batches.length > 0);
```

### 6. Prop Drilling (Intentional)
For a 2-level deep component tree, prop drilling is cleaner than Context.

---

## 14. Build & Deployment

### Local Build

```bash
npm run build
# Output: /dist folder
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

`vercel.json` config:
```json
{
  "name": "shelf-inventory"
}
```

Vercel auto-detects Vite and sets build command to `npm run build` and output to `dist`.

### Deploy to Netlify

1. Push to GitHub
2. Connect repo in Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

---

## 15. Extending the Project

### Add Real API (Backend Integration)

Replace `useState` with API calls:

```js
// Before (prototype)
const [products, setProducts] = useState(INIT_PRODUCTS);

// After (production)
const { data: products, refetch } = useQuery("products", fetchProducts);
const addMutation = useMutation(createProduct, { onSuccess: refetch });
```

### Add Routing (Multiple Pages)

```bash
npm install react-router-dom
```

```jsx
<BrowserRouter>
  <Route path="/inventory" element={<InventoryPage />} />
  <Route path="/inventory/:id" element={<ProductDetail />} />
</BrowserRouter>
```

### Add TypeScript

```bash
npm install -D typescript @types/react @types/react-dom
```

Type the data models:
```ts
interface Batch {
  id: string;
  upc: string;
  batch: string;
  price: string;
  qty: number;
  channel: "Offline" | "Online" | "Both";
  addedByYou: boolean;
  approval: "pending" | null;
}

interface Product {
  id: string;
  name: string;
  batches: Batch[];
  isRice: boolean;
  totalQty: string;
}
```

### Split Into Feature Folders

```
src/
├── components/
│   ├── Sidebar.jsx
│   ├── TopBar.jsx
│   └── ui/
│       ├── Badge.jsx
│       ├── Btn.jsx
│       ├── Input.jsx
│       └── Modal.jsx
├── features/
│   ├── inventory/
│   │   ├── ProductCard.jsx
│   │   ├── BatchRow.jsx
│   │   └── useInventory.js   ← custom hook for state
│   └── approval/
│       └── ApprovalCard.jsx
├── data/
│   └── initialData.js
└── App.jsx
```

---

## Quick Reference

| Action | Where | Handler |
|--------|-------|---------|
| Add product | `AddProductModal` → `App.addProduct()` | `setProducts(ps => [...ps, new])` |
| Edit batch | `EditModal` → `App.editBatch()` | `setProducts(map → map)` |
| Delete batch | `BatchRow` → `App.deleteBatch()` | `setProducts(map → filter)` |
| Switch tab | Tab bar click | `setActiveTab(id)` |
| Toggle store | TopBar toggle | `setStoreActive(!storeActive)` |
| Search product | Search input | `setProductSearch(value)` |
| Open sidebar section | Sidebar accordion | `setExpanded(toggle)` |

---

*Built with React 18 + Vite 5 | Prototype — No backend required*
